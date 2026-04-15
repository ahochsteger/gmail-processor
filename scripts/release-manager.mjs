#!/usr/bin/env node

/**
 * AI-Powered Release Manager for Gmail Processor
 *
 * Manages the full release lifecycle using GitHub Draft Releases (Option C+):
 * - Draft releases are invisible to the public until explicitly published.
 * - AI-generated sections are wrapped in delimiters, preserving manual edits on re-runs.
 * - Community announcements fire exactly once, in --publish mode only.
 *
 * Usage:
 *   node scripts/release-manager.mjs preview                      # Preview locally
 *   node scripts/release-manager.mjs update [tag]                 # Patch release (draft or published)
 *   node scripts/release-manager.mjs update [tag] --pr <num>      # Use specific PR
 *   node scripts/release-manager.mjs publish <tag>                # Finalize release + announce
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPO = "ahochsteger/gmail-processor"
const BASE_DIR = path.resolve(__dirname, "..")
const PROMPT_FILE = path.join(BASE_DIR, "scripts/prompts/release-summary.md")
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

// HTML comment delimiters that wrap the AI-generated section.
// Content outside these markers is preserved on re-runs.
const AI_SECTION_START = "<!-- RELEASE_NOTES_AI_START -->"
const AI_SECTION_END = "<!-- RELEASE_NOTES_AI_END -->"

// --- Mode & Argument Parsing ---
const args = process.argv.slice(2)
const command = args[0] // preview, update, publish

const isDryRun = command === "preview" || !command
const isUpdateRelease = command === "update"
const isPublish = command === "publish"

// If no mode specified, default to preview
const mode = isPublish
  ? "publish"
  : isUpdateRelease
    ? "update-release"
    : "preview"

const possibleTag = args[1]
const tagArg = possibleTag && !possibleTag.startsWith("--") ? possibleTag : null

const prOverride = args.find((_, i) => args[i - 1] === "--pr") || null

const geminiApiKey = process.env.GEMINI_API_KEY

// --- Core Utilities ---

/**
 * Execute a shell command and return stdout, or empty string on failure.
 */
function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim()
  } catch {
    return ""
  }
}

/**
 * Sleep for ms milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a GitHub Release by tag with a retry loop.
 * Handles propagation delay after release-please creates the release.
 */
async function fetchReleaseWithRetry(tag, maxAttempts = 5, delayMs = 10000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = run(
      `gh release view "${tag}" --json tagName,body,isDraft,url 2>/dev/null`,
    )
    if (result) {
      try {
        return JSON.parse(result)
      } catch {
        // malformed, keep retrying
      }
    }
    if (attempt < maxAttempts) {
      console.log(
        `Release "${tag}" not found yet, retrying in ${delayMs / 1000}s... (${attempt}/${maxAttempts})`,
      )
      await sleep(delayMs)
    }
  }
  return null
}

/**
 * Auto-detect the release tag from the release-please PR.
 * Checks pending PRs first, then recently tagged (merged) ones.
 */
function detectTag() {
  // 1. Pending release PR (not yet merged)
  const pending = JSON.parse(
    run(
      `gh pr list --label "autorelease: pending" --json title,number,headRefName`,
    ) || "[]",
  )
  if (pending.length > 0) {
    const match = pending[0].title.match(/release (\d+\.\d+\.\d+)/)
    if (match) return `v${match[1]}`
  }

  // 2. Recently tagged (merged) release PR
  const tagged = JSON.parse(
    run(
      `gh pr list --state merged --label "autorelease: tagged" --limit 1 --json title,headRefName`,
    ) || "[]",
  )
  if (tagged.length > 0) {
    const match = tagged[0].title.match(/release (\d+\.\d+\.\d+)/)
    if (match) return `v${match[1]}`
  }

  // 3. Fallback to latest git tag
  return run("git describe --tags --abbrev=0") || null
}

/**
 * Get the previous tag before the given tag.
 */
function getPreviousTag(currentTag) {
  const previous = run(
    `git describe --tags --abbrev=0 "${currentTag}^" 2>/dev/null`,
  )
  return previous || "v0.0.0"
}

/**
 * Find the release-please PR associated with a given release tag.
 * Works for both pending and merged PRs.
 */
function findReleasePR(tag, prNumber = null) {
  if (prNumber) {
    const info = run(
      `gh pr view ${prNumber} --json title,body,number,state 2>/dev/null`,
    )
    if (info) return JSON.parse(info)
  }

  // Search by label and branch pattern
  const version = tag.replace(/^v/, "")
  const byLabel = JSON.parse(
    run(
      `gh pr list --label "autorelease: pending" --json title,body,number,state`,
    ) || "[]",
  )
  const match = byLabel.find((pr) => pr.title.includes(version))
  if (match) return match

  // Merged PR
  const merged = JSON.parse(
    run(
      `gh pr list --state merged --label "autorelease: tagged" --limit 5 --json title,body,number,state`,
    ) || "[]",
  )
  return merged.find((pr) => pr.title.includes(version)) || null
}

// --- Dependency Diff ---

function getDeps(content) {
  try {
    const pkg = JSON.parse(content)
    return { ...pkg.dependencies, ...pkg.devDependencies }
  } catch {
    return {}
  }
}

function getVersionScale(prev, current) {
  const clean = (v) => (v || "").replace(/[^0-9.]/g, "").split(".")
  const p = clean(prev)
  const c = clean(current)
  if (p[0] !== c[0]) return "MAJOR"
  if (p[1] !== c[1]) return "MINOR"
  if (p[2] !== c[2]) return "PATCH"
  return ""
}

function getDependencyDiff(prevRef, currentRef, filePath) {
  const prevContent = run(`git show ${prevRef}:${filePath}`)
  const currentContent = fs.existsSync(path.join(BASE_DIR, filePath))
    ? fs.readFileSync(path.join(BASE_DIR, filePath), "utf8")
    : run(`git show ${currentRef}:${filePath}`)

  const prevDeps = getDeps(prevContent)
  const currentDeps = getDeps(currentContent)

  const diff = []
  const allKeys = new Set([
    ...Object.keys(prevDeps),
    ...Object.keys(currentDeps),
  ])

  for (const pkg of allKeys) {
    if (prevDeps[pkg] !== currentDeps[pkg]) {
      if (!prevDeps[pkg]) {
        diff.push(`+ ${pkg}: ${currentDeps[pkg]}`)
      } else if (!currentDeps[pkg]) {
        diff.push(`- ${pkg}: ${prevDeps[pkg]}`)
      } else {
        const scale = getVersionScale(prevDeps[pkg], currentDeps[pkg])
        const scaleTag = scale ? ` [${scale}]` : ""
        diff.push(
          `~ ${pkg}: ${prevDeps[pkg]} -> ${currentDeps[pkg]}${scaleTag}`,
        )
      }
    }
  }
  return diff
}

// --- Changelog Processing ---

/**
 * Strip release-please robot header/footer from changelog text.
 */
function cleanChangelog(text) {
  if (!text) return ""
  return text
    .replace(
      /^:robot: I have created a release \*beep\* \*boop\*\s*---[\s\n]*/g,
      "",
    )
    .replace(
      /---[\s\n]*This PR was generated with \[Release Please\].*$/gms,
      "",
    )
    .trim()
}

/**
 * Group redundant changelog entries (e.g. multiple "update libs-non-major").
 */
function groupChangelogEntries(text) {
  if (!text) return ""
  const lines = text.split("\n")
  const result = []
  let sectionBuffer = []

  const flushSection = () => {
    if (sectionBuffer.length === 0) return
    const grouped = new Map()
    const otherContent = []

    for (const item of sectionBuffer) {
      const match = item.match(/^(\* .*?)( (?:[\(\[].*))$/)
      if (match) {
        const header = match[1].trim()
        const links = match[2].trim()
        if (!grouped.has(header)) grouped.set(header, new Set())
        grouped.get(header).add(links)
      } else if (item.trim() !== "") {
        otherContent.push(item)
      }
    }

    const sortedHeaders = Array.from(grouped.keys()).sort((a, b) =>
      a.localeCompare(b),
    )
    for (const header of sortedHeaders) {
      const links = Array.from(grouped.get(header)).join(", ")
      result.push(`${header} ${links}`)
    }
    result.push(...otherContent)
    sectionBuffer = []
  }

  for (const line of lines) {
    if (line.startsWith("###")) {
      flushSection()
      result.push(line)
    } else if (line.trim().startsWith("*")) {
      sectionBuffer.push(line)
    } else if (line.trim() === "" && sectionBuffer.length === 0) {
      result.push(line)
    } else if (sectionBuffer.length > 0) {
      sectionBuffer.push(line)
    } else {
      result.push(line)
    }
  }
  flushSection()
  return result.join("\n")
}

/**
 * Auto-link PR numbers and commit hashes. Never emits @-mentions.
 */
function linkify(text) {
  return text
    .replace(/(^|\s)#(\d+)/g, `$1[#$2](https://github.com/${REPO}/pull/$2)`)
    .replace(
      /\(([0-9a-f]{7,40})\)/g,
      `([$1](https://github.com/${REPO}/commit/$1))`,
    )
}

/**
 * Filter out dependency noise from the AI-facing changelog.
 */
function filterChangelog(changelog) {
  if (!changelog) return ""
  return changelog
    .split("\n")
    .filter(
      (line) =>
        !line.toLowerCase().includes("chore(deps)") &&
        !line.toLowerCase().includes("build(deps)"),
    )
    .join("\n")
}

// --- Community Context ---

async function getCommunityContext(
  prevRef,
  currentRef,
  changelog,
  maintainers = [],
) {
  const logOutput = run(
    `git log ${prevRef}..${currentRef} --pretty=format:"AUTH:%an|%ae%nTRAIL:%(trailers:key=Co-authored-by,valueonly=true)"`,
  )

  const bots = [
    "bot",
    "renovate",
    "snyk",
    "google-labs-jules",
    "gemini-code-assist",
    "allcontributors",
    "github-actions",
  ]
  const contributors = new Map()

  const allContributors = JSON.parse(
    fs.readFileSync(path.join(BASE_DIR, ".all-contributorsrc"), "utf8"),
  ).contributors

  const lines = logOutput.split("\n")
  for (const line of lines) {
    let rawName = "",
      rawEmail = ""
    if (line.startsWith("AUTH:")) {
      ;[rawName, rawEmail] = line.slice(5).split("|")
    } else if (line.startsWith("TRAIL:") && line.length > 6) {
      const coauthorMatch = line.match(/([^<]+)<([^>]+)>/)
      if (coauthorMatch) {
        rawName = coauthorMatch[1].trim()
        rawEmail = coauthorMatch[2].trim()
      } else {
        rawName = line.slice(6).trim()
      }
    }

    if (!rawName) continue
    const name = rawName.trim(),
      email = rawEmail ? rawEmail.trim() : ""
    if (
      bots.some(
        (b) =>
          name.toLowerCase().includes(b.toLowerCase()) ||
          email.toLowerCase().includes(b.toLowerCase()),
      )
    )
      continue

    const entry = allContributors.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.login.toLowerCase() === name.toLowerCase() ||
        (email && email.toLowerCase().includes(c.login.toLowerCase())) ||
        (name.toLowerCase().includes("chris") && c.login === "chrismazanec"),
    )

    const normName = entry ? entry.name : name
    const login = entry?.login || name
    if (
      maintainers.includes(normName.toLowerCase()) ||
      maintainers.includes(login.toLowerCase())
    )
      continue

    if (!contributors.has(normName)) {
      const profile = `https://github.com/${login.replace(/^@/, "")}`
      const totalCount = parseInt(
        run(`git rev-list --count HEAD --author="${name}"`) || "1",
      )
      const releaseCount = parseInt(
        run(
          `git rev-list --count ${prevRef}..${currentRef} --author="${name}"`,
        ) || "1",
      )
      const isNew = totalCount > 0 && totalCount <= releaseCount
      contributors.set(normName, { name: normName, login, profile, isNew })
    }
  }

  const newContributors = Array.from(contributors.values())
    .filter((c) => c.isNew)
    .map((c) => ({ name: c.name, login: c.login, profile: c.profile }))

  const linkedNumbers = [
    ...new Set((changelog.match(/#(\d+)/g) || []).map((p) => p.slice(1))),
  ]
  const issues = []
  for (const num of linkedNumbers) {
    const info = run(
      `gh issue view ${num} --json title,number,author 2>/dev/null`,
    )
    if (info) {
      const issue = JSON.parse(info)
      const authorLogin = (issue.author?.login || "").toLowerCase()
      const authorName = (issue.author?.name || "").toLowerCase()
      const isBot =
        issue.author?.is_bot ||
        bots.some((b) => authorLogin.includes(b) || authorName.includes(b))
      if (
        !isBot &&
        !maintainers.includes(authorLogin) &&
        !maintainers.includes(authorName)
      ) {
        issues.push(issue)
      }
    }
  }

  const prevTagDate =
    run(`git log -1 --format=%aI ${prevRef}`) || new Date(0).toISOString()
  const discussionsRaw = run(
    `gh api graphql -f query='{ repository(owner: "ahochsteger", name: "gmail-processor") { discussions(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) { nodes { title, url, updatedAt, author { login, name } } } } }' --jq '.data.repository.discussions.nodes'`,
  )
  const discussions = JSON.parse(discussionsRaw || "[]").filter((d) => {
    const login = (d.author?.login || "").toLowerCase()
    const name = (d.author?.name || "").toLowerCase()
    const updatedAt = d.updatedAt || "1970-01-01T00:00:00Z"
    const isActive = new Date(updatedAt) > new Date(prevTagDate)
    return (
      isActive &&
      !maintainers.includes(login) &&
      (!name || !maintainers.includes(name))
    )
  })

  return {
    authors: Array.from(contributors.values()).map((c) => ({
      name: c.name,
      profile: c.profile,
    })),
    newContributors,
    issues,
    discussions: discussions.slice(0, 5),
  }
}

// --- PR Context ---

async function getPRContext(changelog) {
  const prs = [
    ...new Set((changelog.match(/#(\d+)/g) || []).map((p) => p.slice(1))),
  ]
  let context = ""
  for (const pr of prs) {
    const info = run(
      `gh pr view ${pr} --json title,body,author --template "{{.author.login}} ({{.author.name}}): {{.title}}: {{.body}}" 2>/dev/null`,
    )
    if (info) context += `\nPR #${pr} by ${info.slice(0, 2000)}...`
  }
  return context
}

// --- Documentation Context ---

function getDocumentationContext() {
  const docsDir = path.join(BASE_DIR, "docs/docs")
  if (!fs.existsSync(docsDir)) return ""

  const files = []
  const scan = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const res = path.resolve(dir, entry.name)
      if (entry.isDirectory()) {
        scan(res)
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
        const relative = path.relative(docsDir, res).replace(/\\/g, "/")
        const content = fs.readFileSync(res, "utf8")
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1].trim() : entry.name
        const url = `https://ahochsteger.github.io/gmail-processor/docs/${relative.replace(/\.mdx?$/, "")}`
        files.push({ title, url })
      }
    }
  }
  scan(docsDir)
  return files.map((f) => `- [${f.title}](${f.url})`).join("\n")
}

// --- AI Summary ---

async function generateAISummary(context) {
  if (!geminiApiKey) {
    return "> [!WARNING]\n> **AI Release Summary skipped**: `GEMINI_API_KEY` environment variable was not found. Please provide it for an automated summary."
  }

  const promptTemplate = fs.readFileSync(PROMPT_FILE, "utf8")

  const dataBlock = `
### TECHNICAL DATA
- **VERSION**: ${context.version}
- **GAS_LIBRARY**: ${context.gas_info}
- **CHANGELOG**:
${context.changelog}

- **DEPENDENCY_DIFF**:
${context.dep_diff}

- **COMMUNITY_INFO**:
${context.community_info}

- **PR_SUMMARIES**:
${context.pr_context}

- **DOCUMENTATION_REFERENCE**:
${context.docs_context}
`
  const prompt = `${promptTemplate}\n\n${dataBlock}`

  const response = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, topP: 0.95 },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  let summary = data.candidates[0].content.parts[0].text.trim()
  summary = summary.replace(/AI-Assisted: true/g, "").trim()
  return summary
}

// --- Release Body Composition ---

/**
 * Replace the AI section in an existing release body, preserving content
 * outside the HTML comment delimiters. If no delimiters exist, the full
 * body is treated as non-AI content and the AI section is prepended.
 */
function patchAiSection(existingBody, newAiSection) {
  const startIdx = existingBody.indexOf(AI_SECTION_START)
  const endIdx = existingBody.indexOf(AI_SECTION_END)

  if (startIdx !== -1 && endIdx !== -1) {
    // Delimiters found — replace only the AI section
    const before = existingBody.slice(0, startIdx)
    const after = existingBody.slice(endIdx + AI_SECTION_END.length)
    return `${before}${AI_SECTION_START}\n${newAiSection}\n${AI_SECTION_END}${after}`
  }

  // No delimiters — this body was generated without them (first run).
  // Return the new structured body from scratch.
  return null // Signal to caller to use full rebuild
}

/**
 * Update the GAS Lib version in the metadata bar of an existing release body.
 */
function injectGasVersion(body, newGasInfo) {
  return body.replace(
    /(\*\*ℹ️ GAS Lib Version\*\*:\s*)[^| \n]+(?:\s*\*\([^)]+\)\*)?/,
    `$1${newGasInfo}`,
  )
}

/**
 * Build a complete, structured release body from scratch.
 */
function buildFullReleaseBody(params) {
  const { h1Title, metadataBar, aiSummary, linkedBody, depDiff, version } =
    params

  // Split AI summary: first line is H1, rest is content
  let finalH1 = h1Title
  let aiContent = aiSummary
  if (aiSummary.startsWith("#")) {
    const lines = aiSummary.split("\n")
    finalH1 = lines[0]
    aiContent = linkify(lines.slice(1).join("\n").trim())
  } else {
    aiContent = linkify(aiSummary.trim())
  }

  return `${finalH1}
${metadataBar}

---

${AI_SECTION_START}
${aiContent}
${AI_SECTION_END}

---

### 📦 Detailed Changelog

${linkedBody}

<details>
<summary><b>Detailed Dependency Changes</b></summary>

\`\`\`text
${depDiff || "No dependency changes."}
\`\`\`
</details>

---
_AI-Assisted: true_`.trim()
}

// --- GitHub Release Operations ---

/**
 * Write a new body to a GitHub Release (draft or published).
 * Uses gh release edit for reliable tag-based targeting.
 */
function writeReleaseBody(tag, body) {
  const tmpFile = path.join(BASE_DIR, "build", ".release-notes-tmp.md")
  fs.writeFileSync(tmpFile, body)
  const result = run(`gh release edit "${tag}" --notes-file "${tmpFile}"`)
  fs.unlinkSync(tmpFile)
  return result
}

/**
 * Publish a draft release (set draft=false).
 */
function publishDraft(tag) {
  run(`gh release edit "${tag}" --draft=false --latest`)
}

/**
 * Create a GitHub Discussion announcement (only for minor/major releases).
 */
async function announceInDiscussions(version, body) {
  const versionParts = version.replace(/^v/, "").split(".")
  const patch = parseInt(versionParts[2] || "0")
  if (patch !== 0) {
    console.log(`Skipping community announcement for patch version ${version}`)
    return
  }

  const CAT_ID = "DIC_kwDOAHwHFc4CYWbf" // Announcements
  const title = `🚀 Release ${version}`

  console.log(`Checking for existing announcements for ${version}...`)
  const checkRaw = run(
    `gh api graphql -f query='{ repository(owner: "ahochsteger", name: "gmail-processor") { discussions(first: 10, categoryId: "${CAT_ID}", orderBy: {field: CREATED_AT, direction: DESC}) { nodes { title } } } }' --jq '.data.repository.discussions.nodes' 2>/dev/null`,
  )
  try {
    const nodes = JSON.parse(checkRaw)
    if (nodes.some((n) => n.title === title)) {
      console.log(
        `Announcement discussion "${title}" already exists. Skipping creation.`,
      )
      return
    }
  } catch (e) {
    // Ignore error and proceed
  }

  console.log(`Creating community announcement for ${version}...`)
  const query = `mutation($repositoryId:ID!, $categoryId:ID!, $title:String!, $body:String!) {
    createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
      discussion { url }
    }
  }`

  const REPO_ID = "MDEwOlJlcG9zaXRvcnk4MTI4Mjc3"

  const vars = JSON.stringify({
    repositoryId: REPO_ID,
    categoryId: CAT_ID,
    title,
    body,
  })
  fs.writeFileSync("vars.json", vars)
  run(`gh api graphql -f query='${query}' --input vars.json`)
  fs.unlinkSync("vars.json")
}

// --- GAS Version Resolution ---

function resolveGasInfo(version, isPreview, upcoming, existingBody) {
  const envVersion = process.env.GAS_LIB_VERSION
  let gVersion = envVersion || "LATEST"

  if (gVersion === "LATEST") {
    if (fs.existsSync(path.join(BASE_DIR, "build/gas/lib-version.txt"))) {
      gVersion = fs
        .readFileSync(path.join(BASE_DIR, "build/gas/lib-version.txt"), "utf8")
        .trim()
    } else if (existingBody) {
      const match = existingBody.match(
        /\*\*ℹ️ GAS Lib Version\*\*: \[?(\d+)\]?\(/,
      )
      if (match) {
        gVersion = match[1]
      }
    }
  }

  if (gVersion === "LATEST") {
    return "LATEST \*(pending deployment)\*"
  }

  const scriptId =
    process.env.CLASP_LIB_SCRIPT_ID ||
    "1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK"
  return `[${gVersion}](https://script.google.com/macros/library/d/${scriptId}/${gVersion})`
}

// --- Main ---

async function main() {
  try {
    const buildDir = path.join(BASE_DIR, "build")
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir)

    console.log(`Release manager starting in mode: ${mode}`)
    console.log("Gathering release context...")

    // --- Tag Resolution ---
    const tag = tagArg || detectTag()
    if (!tag && mode !== "preview") {
      console.error(
        "ERROR: Could not detect release tag. Use --update-release <tag> or --publish <tag>.",
      )
      process.exit(1)
    }
    if (tag) console.log(`Target tag: ${tag}`)

    const version = tag ? tag.replace(/^v/, "") : "upcoming"
    const prevTag = tag
      ? getPreviousTag(tag)
      : run("git describe --tags --abbrev=0") || "v0.0.0"
    const currentRef = tag || "HEAD"

    // --- Source of Truth: Release PR ---
    let rawNotes = ""
    let releasePR = null

    if (mode === "publish") {
      // In publish mode: fetch from existing draft release body (preserves manual edits)
      console.log(`Fetching draft release for "${tag}"...`)
      const release = await fetchReleaseWithRetry(tag)
      if (!release) {
        console.error(`ERROR: Could not fetch release "${tag}" after retries.`)
        process.exit(1)
      }
      if (!release.isDraft) {
        console.warn(
          `WARNING: Release "${tag}" is not a draft. Proceeding with publish anyway.`,
        )
      }
      // Inject real GAS version into existing body and publish
      const gasInfo = resolveGasInfo(version, false, false, release.body)
      let finalBody = injectGasVersion(release.body || "", gasInfo)
      if (!finalBody.includes("_AI-Assisted: true_")) {
        finalBody += "\n\n---\n_AI-Assisted: true_"
      }
      writeReleaseBody(tag, finalBody)
      console.log(`Publishing release "${tag}"...`)
      publishDraft(tag)
      await announceInDiscussions(tag, finalBody)
      console.log("Release published successfully!")
      return
    }

    // --- Changelog Sourcing (preview and update-release modes) ---
    if (tag && mode === "update-release") {
      releasePR = findReleasePR(tag, prOverride ? parseInt(prOverride) : null)
      if (releasePR) {
        console.log(`Using changelog from Release PR #${releasePR.number}`)
        rawNotes = cleanChangelog(releasePR.body)
      } else {
        // Fallback: existing release body or git log
        const release = await fetchReleaseWithRetry(tag)
        if (release?.body) {
          console.log(`Using existing release body for "${tag}"`)
          rawNotes = cleanChangelog(release.body)
        } else {
          console.log(
            `Generating draft changelog from git (${prevTag}..${currentRef})...`,
          )
          rawNotes = run(
            `git log ${prevTag}..${currentRef} --pretty=format:"* %s (%h)"`,
          )
        }
      }
    } else {
      // Dry-run: use pending release PR
      const pending = JSON.parse(
        run(
          `gh pr list --label "autorelease: pending" --json title,body,number`,
        ) || "[]",
      )
      if (pending.length > 0) {
        releasePR = pending[0]
        console.log(
          `Using changelog from pending Release PR #${releasePR.number}`,
        )
        rawNotes = cleanChangelog(releasePR.body)
      } else {
        console.log(`Generating draft changelog from git (${prevTag}..HEAD)...`)
        rawNotes = run(`git log ${prevTag}..HEAD --pretty=format:"* %s (%h)"`)
      }
    }
    // Always fetch full git log for the AI context (ensures "Under the Hood" sees hidden commits)
    const fullGitLog = run(
      `git log ${prevTag}..${currentRef} --pretty=format:"* %s (%h)"`,
    )

    if (!rawNotes) {
      console.warn("WARNING: No raw changelog notes found. Using fallback.")
      rawNotes = "No technical changes identified in history."
    }

    // --- Ancillary Context ---
    const rootDeps = getDependencyDiff(prevTag, currentRef, "package.json")
    const docsDeps = getDependencyDiff(prevTag, currentRef, "docs/package.json")
    const depDiff = [...new Set([...rootDeps, ...docsDeps])].sort().join("\n")

    let releaseBodyToParse = ""
    if (mode === "update-release") {
      const draft = await fetchReleaseWithRetry(tag)
      if (draft && draft.body) releaseBodyToParse = draft.body
    }
    const gasInfo = resolveGasInfo(
      version,
      mode === "preview",
      releasePR,
      releaseBodyToParse,
    )

    const repoOwner = run(
      `gh repo view --json owner --template "{{.owner.login}}"`,
    ).toLowerCase()
    const maintainers = [repoOwner, "ahochsteger"]
    const communityInfo = await getCommunityContext(
      prevTag,
      currentRef,
      rawNotes,
      maintainers,
    )
    const docsContext = getDocumentationContext()
    const filteredChangelog = filterChangelog(rawNotes)
    const prContext = await getPRContext(rawNotes)

    // --- Build AI Summary ---
    const aiContext = {
      version,
      gas_info: gasInfo,
      changelog: fullGitLog || rawNotes, // AI sees EVERYTHING for better "Under the Hood"
      dep_diff: depDiff || "No dependency changes.",
      community_info: JSON.stringify(communityInfo, null, 2),
      pr_context: prContext || "No additional PR context available.",
      docs_context: docsContext || "No specific documentation mapped.",
    }

    // Render the resolved prompt for verification
    const promptTemplate = fs.readFileSync(PROMPT_FILE, "utf8")
    const dataBlock = `
### TECHNICAL DATA
- **VERSION**: ${aiContext.version}
- **GAS_LIBRARY**: ${aiContext.gas_info}
- **CHANGELOG**:
${aiContext.changelog}

- **DEPENDENCY_DIFF**:
${aiContext.dep_diff}

- **COMMUNITY_INFO**:
${aiContext.community_info}

- **PR_SUMMARIES**:
${aiContext.pr_context}

- **DOCUMENTATION_REFERENCE**:
${aiContext.docs_context}
`
    const resolvedPrompt = `${promptTemplate}\n\n${dataBlock}`

    const aiSummary = await generateAISummary(aiContext)

    // --- Assemble Release Body ---
    const groupedNotes = groupChangelogEntries(rawNotes)
    const headerMatch = groupedNotes.match(/## \[(.*?)\]\((.*?)\) \((.*?)\)/)
    const diffLink =
      (headerMatch ? headerMatch[2] : null) ||
      (prevTag && tag
        ? `https://github.com/${REPO}/compare/${prevTag}...${tag}`
        : "")
    const releaseDate = headerMatch
      ? headerMatch[3]
      : new Date().toISOString().slice(0, 10)
    const entriesBody = groupedNotes
      .replace(/^## \[.*?\]\(.*?\).*?\n+/, "")
      .trim()
    const linkedBody = linkify(entriesBody)

    const h1Title = `# 🚀 Gmail Processor v${version}`
    const metadataBar = `**ℹ️ GAS Lib Version**: ${gasInfo} | 📅 ${releaseDate} | [Docs](https://ahochsteger.github.io/gmail-processor/docs/) | [Playground](https://ahochsteger.github.io/gmail-processor/playground/) | [Reference](https://ahochsteger.github.io/gmail-processor/docs/reference/) | [Examples](https://ahochsteger.github.io/gmail-processor/docs/examples/)${diffLink ? ` | [Diff](${diffLink})` : ""}`

    const fullBody = buildFullReleaseBody({
      h1Title,
      metadataBar,
      aiSummary,
      linkedBody,
      depDiff,
      version,
    })

    // --- Output ---
    if (mode === "preview") {
      console.log(`\n[SAFE PREVIEW] --- Proposed Release Notes ---`)
      console.log(
        `(No changes made. Prompt saved to build/release-notes-prompt.md)\n`,
      )
      fs.writeFileSync(
        path.join(buildDir, "release-notes-preview.md"),
        fullBody,
      )
      fs.writeFileSync(
        path.join(buildDir, "release-notes-prompt.md"),
        resolvedPrompt,
      )
      console.log(`Saved preview to build/release-notes-preview.md`)
      console.log(`Saved prompt to build/release-notes-prompt.md`)
    } else if (mode === "update-release") {
      // Attempt delimiter-aware patch of existing release body
      const existingRelease = await fetchReleaseWithRetry(tag)
      let finalBody = fullBody

      if (
        existingRelease?.body &&
        existingRelease.body.includes(AI_SECTION_START)
      ) {
        // Existing body has delimiters from a previous run — patch AI section only
        const splitAi = aiSummary.startsWith("#")
          ? linkify(aiSummary.split("\n").slice(1).join("\n").trim())
          : linkify(aiSummary.trim())
        const patched = patchAiSection(existingRelease.body, splitAi)
        if (patched) {
          finalBody = injectGasVersion(patched, gasInfo)
          console.log(
            `Delimiter-aware patch: AI section replaced, manual edits preserved.`,
          )
        }
      } else if (existingRelease?.body) {
        console.log(
          `No delimiters found in existing body — rebuilding full release notes.`,
        )
      }

      console.log(`Patching draft release "${tag}"...`)
      writeReleaseBody(tag, finalBody)
      fs.writeFileSync(
        path.join(buildDir, "release-notes-preview.md"),
        finalBody,
      )
      fs.writeFileSync(
        path.join(buildDir, "release-notes-prompt.md"),
        resolvedPrompt,
      )
      console.log(`Release "${tag}" updated successfully.`)
      console.log(
        `Local copies saved to build/release-notes-{preview,prompt}.md`,
      )
    }

    console.log("Release notes processing complete!")
  } catch (error) {
    console.error("Failed to update release notes:", error)
    process.exit(1)
  }
}

main()
