import { readFileSync } from "fs"
import path from "path"
import {
  EnumTypeInfo,
  ExampleCategory,
  ExampleCategoryInfo,
  ExampleDoc,
  ExampleTemplateType,
  GenSpec,
} from "../src/examples/Example"
import { allExamples } from "../src/examples/index"
import { ExampleHandler } from "./update-examples-generator"

export const allExampleCategories: ExampleCategoryInfo[] = [
  {
    name: ExampleCategory.ACTIONS,
    title: "Actions",
    description: "These examples demonstrate the use of certain actions.",
  },
  {
    name: ExampleCategory.ADVANCED,
    title: "Advanced",
    description:
      "These examples demonstrate advanced features of Gmail Processor.",
  },
  {
    name: ExampleCategory.BASICS,
    title: "Basics",
    description:
      "These examples demonstrate basic functionality of Gmail Processor.",
  },
  {
    name: ExampleCategory.FEATURES,
    title: "Features",
    description:
      "These examples demonstrate different features of Gmail Processor.",
  },
  {
    name: ExampleCategory.MIGRATIONS,
    title: "GMail2GDrive Migration",
    description:
      "These examples demonstrate how migrate from the old GMail2GDrive (v1) configuration to the new Gmail Processor (v2) configuration.",
  },
  {
    name: ExampleCategory.REGRESSIONS,
    title: "Regressions",
    description:
      "These examples demonstrate regression tests as part of bug fixes.",
  },
]

const categoryGenSpecs: GenSpec[] = [
  {
    file: "docs/docs/examples/${category}/index.mdx",
    type: ExampleTemplateType.DOCS_INDEX,
  },
]
const exampleGenSpecs: GenSpec[] = [
  {
    file: "src/examples/${category}/${name}.json",
    type: ExampleTemplateType.CONFIG,
  },
  {
    file: "src/examples/${category}/${name}.spec.ts",
    type: ExampleTemplateType.TEST_SPEC,
  },
  {
    file: "docs/docs/examples/${category}/${name}.mdx",
    type: ExampleTemplateType.DOCS,
  },
  {
    file: "src/gas/examples/${category}/${name}.js",
    type: ExampleTemplateType.GAS_CODE,
  },
  {
    file: "src/gas/examples/${category}/${name}-test.js",
    type: ExampleTemplateType.GAS_TEST,
  },
]

if (process.argv.length < 3) {
  console.error(
    `Usage: ${process.argv[0]} ${process.argv[1]} <clean|generate> [args...]`,
  )
}

switch (process.argv[2]) {
  case "clean":
    console.log("Removing generated files for examples ...")
    ExampleHandler.removeGeneratedFiles(categoryGenSpecs, "/${category}")
    ExampleHandler.removeGeneratedFiles(exampleGenSpecs, "/${category}/${name}")
    break
  case "ls-generated":
    console.log(
      [
        ...ExampleHandler.getGeneratedFiles(categoryGenSpecs, "/${category}"),
        ...ExampleHandler.getGeneratedFiles(
          exampleGenSpecs,
          "/${category}/${name}",
        ),
      ].join("\n"),
    )
    break
  case "generate":
    {
      console.log("Generating all files for examples ...")
      const libSymbols = ExampleHandler.extractExportedSymbols(
        readFileSync("src/lib/index.ts").toString(),
      )
      const eh = new ExampleHandler(
        path.join(__dirname, ".."),
        "src/templates",
        "src/examples",
        JSON.parse(
          readFileSync("build/typedoc/examples.json").toString(),
        ) as ExampleDoc[],
        JSON.parse(
          readFileSync("build/typedoc/example-enums.json").toString(),
        ) as EnumTypeInfo[],
        libSymbols,
      )
      eh.generateFromCategorySpecs(categoryGenSpecs, allExampleCategories)
      eh.generateFromSpecs(exampleGenSpecs, allExamples)
    }
    break
}
