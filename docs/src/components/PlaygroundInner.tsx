import BrowserOnly from "@docusaurus/BrowserOnly";
import { useColorMode } from "@docusaurus/theme-common";
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from "react";

import JSONSchemaEditor from "@theme/JSONSchemaEditor";

import { essentialConfig } from "../../../src/lib/config/Config";
import ConfigSchemaV2 from "../../../src/lib/config/config-schema-v2.json";
import { V1ToV2Converter } from "../../../src/lib/config/v1/V1ToV2Converter";
import ConfigSchemaV1 from "../../../src/lib/config/v1/config-schema-v1.json";

import JSONSchemaViewer from "@theme/JSONSchemaViewer";

import {
  PlaygroundContextProvider,
  usePlaygroundContext,
} from "@site/src/contexts/PlaygroundContext";

// Type I need for useRef
import type { State as PlaygroundState } from "@site/src/contexts/PlaygroundContext";

import ConfigToolbar from "@site/src/components/ConfigToolbar";

import { toast } from "react-toastify";
import { allExamples, defaultExample } from "../../../src/examples";

import Actions from "@site/docs/reference/actions.mdx";
import EnumTypes from "@site/docs/reference/enum-types.mdx";
import Placeholder from "@site/docs/reference/placeholder.mdx";
import { jsonrepair } from "jsonrepair";
import { Example, ExampleVariant } from "../../../src/examples/Example";

const DEBUG = false

function dbg(msg: string) {
  if (DEBUG) {
    console.log(msg)
  }
}

function detectSchema(configString: string) {
  dbg(`detectSchema()`)
  const config = JSON.parse(configString)
  let schema 
  if (config['rules']) {
    schema = ConfigSchemaV1
    schema.title = "GMail2GDrive (v1)"
  } else {
    schema = ConfigSchemaV2
    schema.title = "Gmail Processor (v2)"
  }
  return schema
}

function getExampleFromName(exampleName: string) {
  dbg(`getExampleFromName(${exampleName})`)
  return allExamples.find(e => e.info.name === exampleName) ?? defaultExample
}

function getActiveExampleName() {
  dbg(`getActiveExampleName()`)
  const queryParameters = new URLSearchParams(window.location.search)
  const exampleName = queryParameters.get("example")
  dbg(`getActiveExampleName(): -> ${exampleName}`)
  return exampleName
}

function getActiveExample() {
  dbg(`getActiveExample()`)
  const exampleName = getActiveExampleName()
  const example = getExampleFromName(exampleName)
  dbg(`getActiveExample(): -> ${exampleName}`)
  return example
}

function getConfigJsonFromExample(example: Example): string {
  dbg(`getConfigJsonFromExample(${example.info.name})`)
  const config = example.config
  return JSON.stringify(config, null, 2)
}

function getSchemaFromExample(example: Example): object {
  dbg(`getSchemaFromExample(${example.info.name})`)
  return example.info.variant===ExampleVariant.MIGRATION_V1 ? ConfigSchemaV1 : ConfigSchemaV2
}

function PlaygroundInner(): JSX.Element {
  dbg(`PlaygroundInner()`)
  const {
    state: { exampleName, fullSchema, editorRef, data: value },
    updateState,
  } = usePlaygroundContext()
  const { colorMode } = useColorMode()

  async function handleCopyConfig() {
    dbg(`handleCopyConfig()`)
    // Get the text to copy
    const config: string = editorRef.getModel().getValue() || ("" as string)
    await navigator.clipboard.writeText(config)
    toast.success("Config copied.")
  }

  async function handleCopyCode() {
    dbg(`handleCopyCode()`)
    // Get the text to copy
    const config: string = editorRef.getModel().getValue() || ("" as string)
    const code = `const config = ${config.trim()}
    
function run() {
  GmailProcessorLib.run(config, "dry-run")
}
`
    await navigator.clipboard.writeText(code)
    toast.success("Code copied.")
  }

  // For paste
  async function handlePaste() {
    dbg(`handlePaste()`)
    const clipboardText = await navigator.clipboard.readText()
    handleUpdateConfig(clipboardText)
    toast.success("Config pasted.")
  }

  async function handleUpdateConfig(configString: string) {
    dbg(`handleUpdateConfig()`)
    try {
      const schema = detectSchema(configString)
      updateState({
        fullSchema: schema,
        data: configString,
        // selectedExample: exampleName,
      })
    } catch {
      toast.error("Config contains syntax errors!")
    }
  }

  // async function handleContentChanged(content: string) {
  //   dbg(`handleContentChanged()`)
  //   updateState({
  //     data: content,
  //     exampleName: "",
  //     exampleDirty: true,
  //   })
  // }
  
  async function handleConvertConfig() {
    dbg(`handleConvertConfig()`)
    const code = editorRef.getModel().getValue()
    try {
      const v1config = JSON.parse(code)
      if (!Object.keys(v1config).includes('rules')) {
        toast.error("Not a Gmail2GDrive config!")
        return   
      } 
      // dbg(`Converting v1 config: ${v1config}`)
      const v2config = essentialConfig(V1ToV2Converter.v1ConfigToV2ConfigJson(v1config))
      handleUpdateConfig(JSON.stringify(v2config, null, 2))
      // dbg(`Converted config: ${v2config}`)
      toast.success(`Config converted.`)
    } catch(e) {
      toast.error(`Error converting config: ${e}`)
      return
    }
  }

  async function handleDetectSchema() {
    dbg(`handleDetectSchema()`)
    const code = editorRef.getModel().getValue()
    const schema = detectSchema(code)
    dbg(`handleDetectSchema(): Schema detected`)
    updateState({fullSchema: schema})
    toast.success(`Schema detected: ${schema.title}`)
  }

  async function handleExampleSelected(exampleName: string) {
    dbg(`handleExampleSelected(${exampleName})`)
    // Update state
    const example = getExampleFromName(exampleName)
    const configString = getConfigJsonFromExample(example)
    const schema = detectSchema(configString)
    updateState({
      fullSchema: schema,
      data: configString,
      example: example,
      exampleName: exampleName,
      exampleDirty: false,
    })

    // Put selected example into address bar
    const params = new URLSearchParams(window.location.search)
    if (exampleName && exampleName!=="") {
      params.set("example", exampleName)
    } else {
      params.delete("example")
    }
    const queryParams = params.toString() !== "" ? `?${params.toString()}` : ""
    const url = `${location.protocol}//${location.host}${location.pathname}${queryParams}`
    window.history.replaceState(null, window.document.title, url)
  }

  function handleTidyJson() {
    dbg(`handleCleanJson()`)
    const json = editorRef.getModel().getValue()
    const cleanedJson = JSON.stringify(JSON.parse(jsonrepair(json)), null, 2)
    handleUpdateConfig(cleanedJson)
    toast.success(`Config tidied.`)
  }

  return (
    <div style={{display:"flex"}}>
      <div style={{ flex: "50%" }}>
        <div style={{ boxSizing: "border-box", width: "100%" }}>
          <ConfigToolbar
            examples={allExamples}
            selectedExample={exampleName ?? ""}
            onConvert={handleConvertConfig}
            onCopyConfig={handleCopyConfig}
            onCopyCode={handleCopyCode}
            onDetectSchema={handleDetectSchema}
            onExampleSelected={handleExampleSelected}
            onPaste={handlePaste}
            onTidyJson={handleTidyJson}
          />
          <JSONSchemaEditor
            // See https://github.com/react-monaco-editor/react-monaco-editor
            value={value}
            schema={fullSchema}
            theme={colorMode === "dark" ? "vs-dark" : "vs"}
            editorDidMount={(editor) => {updateState({ editorRef: editor })}}
            onChange={undefined} // NOTE: {handleContentChanged} causes massive editor lagging - dirty detection disabled
            height={"80vh"}
            key={JSON.stringify(fullSchema)}
          />
        </div>
      </div>
      <div style={{ flex: "50%", height: "85vh" }}>
        <div
          style={{overflow: "auto", height: "100%"}}
        >
          <Tabs>
            <TabItem value="schema" label="Schema" default>
              <JSONSchemaViewer
                schema={fullSchema}
                key={JSON.stringify(fullSchema)}
              />
            </TabItem>
            <TabItem value="actions" label="Actions">
              <Actions />
            </TabItem>
            <TabItem value="enum-types" label="Enum Types">
              <EnumTypes />
            </TabItem>
            <TabItem value="placeholder" label="Placeholder">
              <Placeholder />
            </TabItem>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function StateProvider(): JSX.Element {
  dbg(`StateProvider()`)
  const example = getActiveExample()
  const [state, setState] = React.useState({
    jsonPointer: "",
    data: getConfigJsonFromExample(example),
    example: example,
    exampleDirty: false,
    exampleName: getActiveExampleName(),
    fullSchema: getSchemaFromExample(example),
  } as PlaygroundState)

  // define a function to update the state
  function updateState(newState: Partial<PlaygroundState>) {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  return (
    <PlaygroundContextProvider value={{ state, updateState }}>
      <PlaygroundInner />
    </PlaygroundContextProvider>
  )
}

export default function PlaygroundComponent(): JSX.Element {
  dbg(`PlaygroundComponent()`)
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        return <StateProvider />
      }}
    </BrowserOnly>
  )
}
