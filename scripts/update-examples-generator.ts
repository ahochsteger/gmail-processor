import { Eta } from "eta"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs"
import path from "path"
import {
  EnumTypeInfo,
  Example,
  ExampleCategory,
  ExampleCategoryInfo,
  ExampleDoc,
  GenSpec,
  V1Example,
} from "../src/examples/Example"
import { ActionRegistration } from "../src/lib/actions/ActionRegistry"

export class ExampleHandler {
  private eta: Eta
  constructor(
    public baseDir: string,
    public templatesDir: string,
    public examplesSourceDir: string,
    public exampleDocs: ExampleDoc[],
    public enums: EnumTypeInfo[],
    public libSymbols: string[],
  ) {
    this.eta = new Eta({
      autoTrim: [false, false],
      views: `${baseDir}/${templatesDir}`,
    })
  }

  public static indent(code: string, ind = 2): string {
    return (
      code
        .split("\n")
        .map((l) => `${" ".repeat(ind)}${l}`)
        .join("\n")
        .trimStart() + "\n"
    )
  }

  public static getGeneratedFiles(
    specs: GenSpec[],
    baseSplit: string,
  ): string[] {
    let files: string[] = []
    specs.forEach((spec) => {
      const [baseDir, suffix] = spec.file.split(baseSplit)
      const catsRegex = Object.values(ExampleCategory).join("|")
      const exampleFileRegex = new RegExp(
        `^(${catsRegex})/[a-z][A-Za-z0-9]+${suffix.replace(".", "\\.")}$`,
      )
      files = files.concat(
        readdirSync(baseDir, {
          recursive: true,
          withFileTypes: true,
        })
          .filter((dirEnt) => {
            const relPath = path.relative(
              baseDir,
              `${dirEnt.parentPath}/${dirEnt.name}`,
            )
            const b =
              dirEnt.isFile() &&
              exampleFileRegex.test(relPath) &&
              relPath.endsWith(suffix)
            return b
          })
          .map((dirEnt) => {
            const relFilePath = path.relative(
              baseDir,
              `${dirEnt.parentPath}/${dirEnt.name}`,
            )
            return `${baseDir}/${relFilePath}`
          }),
      )
    })
    return files
  }

  public static removeGeneratedFiles(specs: GenSpec[], baseSplit: string) {
    this.getGeneratedFiles(specs, baseSplit).forEach((filePath) => {
      console.log(`  Removing file ${filePath} ...`)
      rmSync(filePath)
    })
  }

  public static genCustomActionsCode(
    actions?: ActionRegistration[],
    ind = 2,
  ): string | undefined {
    if (actions === undefined) return undefined
    let code = "[\n"
    actions.forEach((a) => {
      code += `${" ".repeat(ind)}{\n`
      code += `${" ".repeat(ind + 1)}"name": "${a.name}",\n`
      code += `${" ".repeat(ind + 1)}"action": ${a.action.toString()}\n`
      code += `${" ".repeat(ind)}},\n`
    })
    code += "]"
    return this.indent(code, ind)
  }

  // public extractExportedSymbols(content: string): string[] {

  // }

  public genE2eTestCode(content: string): string {
    // const content = readFileSync(srcFile)
    //   .toString()
    //   .replace(/^import .*/g, "")
    //   .replace(/^export const ([^:]+):.*=/g, "const $1 =")
    //   .replace(/^/g, "  ")
    //   .replace(/\\b(${lib_exports_regex})\\./g, "GmailProcessorLib.$1.")

    // BEGIN { inImport=0 }
    // /^import / { inImport=1 }
    // { if (inImport==0) print $0 }
    // / from "/ && inImport==1 { inImport=0 }

    // skipImports <"${EXAMPLE_SRC_BASEDIR}/${f}" \
    // | sed -re "
    //   s/^export const ([^:]+):.*=/const \\1 =/g;
    //   s/^/  /g;
    //   s/\\b(${lib_exports_regex})\\./GmailProcessorLib.\\1./g;
    // "
    // TODO: Move to constructor or pass into this class
    let inImport = false
    content = content
      .split("\n")
      // TODO: Replace enums with their string values
      .map((l) => l.replace(/^export const ([^:]+):.*=/, "const $1 ="))
      .map((l) =>
        l.replace(
          new RegExp(`\\b(${this.libSymbols.join("|")})\\.`),
          "GmailProcessorLib.$1.",
        ),
      )
      .reduce((out: string, l: string) => {
        if (l.startsWith("import ")) inImport = true
        if (!inImport) {
          out += `${l}\n`
        }
        if (l.match(' from "')) {
          inImport = false
        }
        return out
      }, "")
    this.enums.forEach((e) =>
      e.values.forEach((v) => {
        content = content.replace(`${e.name}.${v.key}`, `"${v.value}"`)
      }),
    )
    return content
  }

  public static extractExportedSymbolds(content: string) {
    return content
      .split("\n")
      .filter((l) => l.startsWith(";(globalThis as any)."))
      .map((l) => l.slice(21).split(" =")[0])
  }

  private getTemplate(example: Example | V1Example, spec: GenSpec): string {
    let template: string = spec.type
    if (example.info.variant) {
      const templateNameWithVariant = `${spec.type}-${example.info.variant}`
      if (existsSync(this.eta.resolvePath(templateNameWithVariant))) {
        template = templateNameWithVariant
      }
    }
    return template
  }

  public render(template: string, data: object): string {
    return this.eta.render(template, data)
  }

  public getDataFromExample(
    example: Example | V1Example,
    spec: GenSpec,
    template: string,
  ): object {
    const exampleSourcePath = `${this.examplesSourceDir}/${example.info.category}/${example.info.name}.ts`
    const examplesBasePath = "src/examples"
    const exampleConfigBaseUrl = `https://github.com/ahochsteger/gmail-processor/blob/main/${examplesBasePath}`
    const githubIssuesBaseUrl =
      "https://github.com/ahochsteger/gmail-processor/issues"
    const githubPRsBaseUrl =
      "https://github.com/ahochsteger/gmail-processor/pull"
    const relPath = `${example.info.category}/${example.info.name}`
    const data: object = {
      example,
      genCustomActionsCode: ExampleHandler.genCustomActionsCode,
      genE2eTestCode: (f: string) =>
        this.genE2eTestCode(readFileSync(f).toString()),
      indent: ExampleHandler.indent,
      baseDir: this.baseDir,
      templateFilePath: `${this.templatesDir}/${template}.eta`,
      exampleSourcePath,
      exampleRelPathName: `${example.info.category}/${example.info.name}`,
      exampleFileDirUp: exampleSourcePath.replace(/[^/]+/g, ".."),
      gitSourceUrl: `${exampleConfigBaseUrl}/${relPath}`,
      examplesBasePath,
      exampleConfigBaseUrl,
      githubIssuesBaseUrl,
      githubPRsBaseUrl,
      docs: this.exampleDocs.find((e) => e.name === example.info.name)
        ?.description,
      genSpec: spec,
    }
    return data
  }

  public renderToFile(template: string, data: object, file: string) {
    const content = this.render(template, data)
    console.log(`  Generating file '${file}' from template '${template}' ...`)
    mkdirSync(path.parse(file).dir, { recursive: true })
    writeFileSync(file, content)
  }

  public renderExampleToFile(example: Example | V1Example, spec: GenSpec) {
    const file = spec.file
      .replace("${category}", example.info.category)
      .replace("${name}", example.info.name)
    if (example.info?.skipGenerate?.find((e) => e === spec.type)) {
      console.log(`  Skipping generation of ${file} ...`)
      return
    }
    const template = this.getTemplate(example, spec)
    const data = this.getDataFromExample(example, spec, template)
    this.renderToFile(template, data, file)
  }

  public renderCategoryToFile(category: ExampleCategoryInfo, spec: GenSpec) {
    const file = spec.file.replace("${category}", category.name)
    const data = { category }
    this.renderToFile(spec.type, data, file)
  }

  public generateFromSpecs(
    specs: GenSpec[],
    examples: (Example | V1Example)[],
  ) {
    specs.forEach((spec) =>
      examples.forEach((example) => this.renderExampleToFile(example, spec)),
    )
  }

  public generateFromCategorySpecs(
    specs: GenSpec[],
    categories: ExampleCategoryInfo[],
  ) {
    specs.forEach((spec) =>
      categories.forEach((category) =>
        this.renderCategoryToFile(category, spec),
      ),
    )
  }
}
