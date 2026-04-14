#!/usr/bin/env node

/**
 * AI-Powered Release Manager for Gmail Processor
 *
 * This script automates the generation of community-centric release notes by:
 * 1. Programmatically diffing package.json files for exact dependency updates.
 * 2. Gathering community context from GitHub (linked issues, discussions, new contributors).
 * 3. Using Gemini AI (gemini-flash-latest) to summarize the release.
 * 4. Patching the GitHub release notes.
 *
 * Usage:
 *   node scripts/release-manager.mjs [--dry-run] [--release-id latest]
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

const dryRun = process.argv.includes("--dry-run")
const releaseId =
  process.argv.find((_, i) => process.argv[i - 1] === "--release-id") ||
  "latest"
const geminiApiKey = process.env.GEMINI_API_KEY

/**
 * Execute a shell command and return the output.
 */
function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim()
  } catch (error) {
    return ""
  }
}

/**
 * Get the previous tag before HEAD.
 */
function getPreviousTag() {
  const currentTag = run("git describe --tags --abbrev=0") || "v0.0.0"
  const previousTag = run(`git describe --tags --abbrev=0 ${currentTag}^`)
  return previousTag || "v0.0.0"
}

/**
 * Parse package.json dependencies.
 */
function getDeps(content) {
  try {
    const pkg = JSON.parse(content)
    return { ...pkg.dependencies, ...pkg.devDependencies }
  } catch (e) {
    return {}
  }
}

/**
 * Determine the scale of a semver version change.
 */
function getVersionScale(prev, current) {
  const clean = (v) => (v || "").replace(/[^0-9.]/g, "").split(".")
  const p = clean(prev)
  const c = clean(current)

  if (p[0] !== c[0]) return "MAJOR"
  if (p[1] !== c[1]) return "MINOR"
  if (p[2] !== c[2]) return "PATCH"
  return ""
}

/**
 * Calculate the net difference of dependencies between two git references.
 */
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

/**
 * Try to identify the next version from a release-please PR.
 */
async function getNextVersion() {
  const prs = JSON.parse(
    run(`gh pr list --label "autorelease: pending" --json title,body,number`) ||
      "[]",
  )
  if (prs.length > 0) {
    const pr = prs[0]
    const match = pr.title.match(/release (\d+\.\d+\.\d+)/)
    return {
      version: match ? match[1] : "upcoming",
      body: pr.body,
      number: pr.number,
    }
  }
  return null
}

/**
 * Replace placeholders like {{version}} and {{changelog}} in the notes.
 */
function fillPlaceholders(text, context) {
  let result = text
  for (const [key, value] of Object.entries(context)) {
    const placeholder = new RegExp(`{{${key}}}`, "g")
    result = result.replace(placeholder, value || "")
  }
  return result
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

    const grouped = new Map() // Header -> Set of Links
    const otherContent = []

    for (const item of sectionBuffer) {
      // Matches standard bullet: * Header (#123) (abc)
      // Header is up to the first space followed by ( or [
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

    // Sort headers alphabetically (this clusters scopes like **docs:** together)
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
      // Still in a section, might be empty line or other text
      sectionBuffer.push(line)
    } else {
      result.push(line)
    }
  }
  flushSection()
  return result.join("\n")
}

/**
 * Auto-link PR numbers and commit hashes.
 */
function linkify(text) {
  return text
    .replace(
      /(^|\s)#(\d+)/g,
      "$1[#$2](https://github.com/ahochsteger/gmail-processor/pull/$2)",
    )
    .replace(
      /\(([0-9a-f]{7,40})\)/g,
      "([$1](https://github.com/ahochsteger/gmail-processor/commit/$1))",
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

/**
 * Get context for Pull Requests mentioned in the changelog.
 */
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

/**
 * Gather community context using GitHub API and Git history.
 */
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

  // Surgical relevance: Only fetch metadata for numbers mentioned in the changelog
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

  // Discussions: Filter by updatedAt since the previous release date
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

/**
 * Scan docs directory to build a technical reference for AI summary deep-linking.
 */
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

/**
 * Generate the AI summary using Gemini.
 */
async function generateAISummary(context) {
  if (!geminiApiKey) {
    return "> [!WARNING]\n> **AI Release Summary skipped**: `GEMINI_API_KEY` environment variable was not found. Please provide it for an automated summary."
  }

  const promptTemplate = fs.readFileSync(PROMPT_FILE, "utf8")

  // Decouple logic: Prepend data to instructions instead of injecting into sentences
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

  // Clean up any stray AI meta-text or trailers if the AI hallucinated them into the middle
  summary = summary.replace(/AI-Assisted: true/g, "").trim()

  return summary
}

/**
 * Create a GitHub Discussion announcement.
 */
async function announceInDiscussions(version, body) {
  const versionParts = version.replace(/^v/, "").split(".")
  const patch = parseInt(versionParts[2] || "0")
  if (patch !== 0) {
    console.log(`Skipping community announcement for patch version ${version}`)
    return
  }

  console.log(`Creating community announcement for ${version}...`)
  const query = `mutation($repositoryId:ID!, $categoryId:ID!, $title:String!, $body:String!) {
    createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
      discussion { url }
    }
  }`

  const REPO_ID = "MDEwOlJlcG9zaXRvcnk4MTI4Mjc3"
  const CAT_ID = "DIC_kwDOAHwHFc4CYWbf" // Announcements
  const title = `🚀 Release ${version}`

  if (dryRun) {
    console.log(`[DRY RUN] Would create discussion: ${title}`)
    return
  }

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

/**
 * Clean up the changelog by removing the release-please robot header.
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
 * Patch the GitHub release.
 */
async function patchRelease(releaseId, version, finalBody, promptContent) {
  const buildDir = path.join(BASE_DIR, "build")

  if (dryRun) {
    console.log(
      `\n[SAFE PREVIEW] --- Proposed Release Notes for "${releaseId}" ---`,
    )
    console.log(
      `(Generated local preview using real environment data. Prompt saved to build/release-notes-prompt.md)\n`,
    )

    // Save both artifacts for verification
    fs.writeFileSync(path.join(buildDir, "release-notes-preview.md"), finalBody)
    fs.writeFileSync(
      path.join(buildDir, "release-notes-prompt.md"),
      promptContent,
    )

    console.log(`Saved preview to build/release-notes-preview.md`)
    console.log(`Saved detailed prompt to build/release-notes-prompt.md`)
    return
  }

  const id = run(`gh api /repos/${REPO}/releases/${releaseId} --jq .id`)
  console.log(`Patching release ${releaseId} (ID: ${id})...`)
  fs.writeFileSync("new_body.md", finalBody)
  run(`gh api -X PATCH "/repos/${REPO}/releases/${id}" -F body=@new_body.md`)
  fs.unlinkSync("new_body.md")

  // Also announce if major/minor
  await announceInDiscussions(version, finalBody)
}

async function main() {
  try {
    const buildDir = path.join(BASE_DIR, "build")
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir)

    console.log("Gathering release context...")
    const prevTag = getPreviousTag()
    const currentRef = "HEAD"

    // 1. Version Detection
    const upcoming = await getNextVersion()
    const version = upcoming
      ? upcoming.version
      : run("git describe --tags --always")
    console.log(`Target version: ${version}`)

    // 2. Dependency Diff
    const rootDeps = getDependencyDiff(prevTag, currentRef, "package.json")
    const docsDeps = getDependencyDiff(prevTag, currentRef, "docs/package.json")
    const depDiff = [...new Set([...rootDeps, ...docsDeps])].sort().join("\n")

    // 3. GAS Info (with resilient fallback)
    let gasInfo = run(
      "npm run release:info | grep 'Google Apps Script Version' | sed 's/Google Apps Script Version: //g' || true",
    )
    if (!gasInfo) {
      let gVersion = fs.existsSync("build/gas/lib-version.txt")
        ? fs.readFileSync("build/gas/lib-version.txt", "utf8").trim()
        : "LATEST"

      // Projection: If dry-run and we have an upcoming version, increment the GAS version
      if (dryRun && upcoming && gVersion !== "LATEST") {
        const nextGVersion = parseInt(gVersion) + 1
        console.log(
          `Dry-run Projection: Incrementing GAS version ${gVersion} -> ${nextGVersion}`,
        )
        gVersion = nextGVersion.toString()
      }

      const scriptId =
        process.env.CLASP_LIB_SCRIPT_ID ||
        "1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK"
      gasInfo = `[${gVersion}](https://script.google.com/macros/library/d/${scriptId}/${gVersion})`
    }

    // Failsafe Verification: In production mode, verify the newly deployed version matches the tag
    if (!dryRun && upcoming && upcoming.version !== "upcoming") {
      console.log(`Verifying GAS library deployment for ${upcoming.version}...`)
      const verification = run(
        `./scripts/clasp.sh lib verify-lib-version ${upcoming.version}`,
      )
      if (!verification || verification.includes("Error")) {
        console.error("HALTING RELEASE: GAS deployment verification failed!")
        console.error(verification)
        process.exit(1)
      }
      console.log("GAS deployment verified successfully.")
    }

    // 4. Raw Changelog
    let rawNotes = ""
    if (upcoming) {
      console.log(`Using changelog from Release PR #${upcoming.number}`)
      rawNotes = cleanChangelog(upcoming.body)
    } else if (releaseId === "upcoming" || (dryRun && releaseId === "latest")) {
      console.log(
        `Generating draft changelog from git (${prevTag}..${currentRef})...`,
      )
      rawNotes = run(
        `git log ${prevTag}..${currentRef} --pretty=format:"* %s (%h)"`,
      )
    } else {
      rawNotes = cleanChangelog(
        run(`gh api /repos/${REPO}/releases/${releaseId} --jq .body`),
      )
    }

    if (!rawNotes) {
      console.warn("WARNING: No raw changelog notes found. Using fallback.")
      rawNotes = "No technical changes identified in history."
    }

    // 5. Community & Documentation Context
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

    // 7. PR Context & Filtering
    const filteredChangelog = filterChangelog(rawNotes)
    const prContext = await getPRContext(rawNotes)

    // 8. Assemble Prompt Context
    const aiContext = {
      version,
      gas_info: gasInfo,
      changelog: filteredChangelog,
      dep_diff: depDiff || "No dependency changes.",
      community_info: JSON.stringify(communityInfo, null, 2),
      pr_context: prContext || "No additional PR context available.",
      docs_context: docsContext || "No specific documentation mapped.",
    }

    // Render the exact prompt that would be sent to Gemini
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

    // 8. Generate Summary (using mock if dry-run & no key)
    const aiSummary = await generateAISummary(aiContext)

    // 9. Assemble Final Body
    const currentNotes = rawNotes
    const groupedNotes = groupChangelogEntries(currentNotes)

    // Extract metadata from the release-please notes
    // Header format: ## [vX.Y.Z](link) (date)
    const headerMatch = groupedNotes.match(/## \[(.*?)\]\((.*?)\) \((.*?)\)/)
    const diffLink = headerMatch ? headerMatch[2] : ""
    const releaseDate = headerMatch
      ? headerMatch[3]
      : new Date().toISOString().slice(0, 10)

    // Strip the primary header from groupedNotes
    const entriesBody = groupedNotes
      .replace(/^## \[.*?\]\(.*?\).*?\n+/, "")
      .trim()

    const filledBody = fillPlaceholders(entriesBody, aiContext)
    const linkedBody = linkify(filledBody)

    // Split AI summary to insert metadata bar after the H1 title
    // AI Summary is expected to start with "# 🚀 ..."
    let h1Title = `# 🚀 Gmail Processor v${version}`
    let remainingAi = aiSummary

    if (aiSummary.startsWith("#")) {
      const aiLines = aiSummary.split("\n")
      h1Title = aiLines[0]
      remainingAi = linkify(aiLines.slice(1).join("\n").trim())
    } else {
      // If AI summary skipped or doesn't follow format, keep summary below the bar
      remainingAi = linkify(aiSummary.trim())
    }

    const metadataBar = `**ℹ️ GAS Lib Version**: ${gasInfo} | 📅 ${releaseDate} | [Docs](https://ahochsteger.github.io/gmail-processor/docs/) | [Playground](https://ahochsteger.github.io/gmail-processor/playground/) | [Reference](https://ahochsteger.github.io/gmail-processor/docs/reference/) | [Examples](https://ahochsteger.github.io/gmail-processor/docs/examples/)${diffLink ? ` | [Diff](${diffLink})` : ""}`

    const finalBody = `
${h1Title}
${metadataBar}

---

${remainingAi}

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
_AI-Assisted: true_
`.trim()

    await patchRelease(releaseId, version, finalBody, resolvedPrompt)
    console.log("Release notes processing complete!")
  } catch (error) {
    console.error("Failed to update release notes:", error)
    process.exit(1)
  }
}

main()
