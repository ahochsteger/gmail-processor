import BrowserOnly from "@docusaurus/BrowserOnly"
import { useColorMode } from "@docusaurus/theme-common"
import React from "react"

import JSONSchemaEditor from "@theme/JSONSchemaEditor"

import { essentialConfig } from "../../../src/lib/config/Config"
import ConfigSchemaV2 from "../../../src/lib/config/config-schema-v2.json"
import { V1ToV2Converter } from "../../../src/lib/config/v1/V1ToV2Converter"
import ConfigSchemaV1 from "../../../src/lib/config/v1/config-schema-v1.json"

import JSONSchemaViewer from "@theme/JSONSchemaViewer"

import {
  PlaygroundContextProvider,
  usePlaygroundContext,
} from "@site/src/contexts/PlaygroundContext"

// Type I need for useRef
import type { State as PlaygroundState } from "@site/src/contexts/PlaygroundContext"

import ConfigToolbar from "@site/src/components/ConfigToolbar"
import SchemaToolbar from "@site/src/components/SchemaToolbar"

import { toast } from "react-toastify"
import config from "../../../src/gas/examples/gettingStarted.json"

function PlaygroundInner(): JSX.Element {
  const {
    state: { fullSchema, editorRef, data: value },
    updateState,
  } = usePlaygroundContext()
  const { colorMode } = useColorMode()

  async function handleCopyConfig() {
    // Get the text to copy
    const config: string = editorRef.getModel().getValue() || ("" as string)
    await navigator.clipboard.writeText(config)
    toast.success("Config copied")
  }

  async function handleCopyCode() {
    // Get the text to copy
    const config: string = editorRef.getModel().getValue() || ("" as string)
    const code = `const config = ${config.trim()}
    
function run() {
  GmailProcessorLib.run(config, "dry-run")
}
`
    await navigator.clipboard.writeText(code)
    toast.success("Code copied")
  }

  // For paste
  async function handlePaste() {
    const clipboardText = await navigator.clipboard.readText()
    handleUpdateConfig(clipboardText)
    toast.success("Config pasted")
  }

  async function handleUpdateConfig(configString: string) {
    const config = JSON.parse(configString)
    const schema = config['rules'] ? ConfigSchemaV1 : ConfigSchemaV2
    updateState({ fullSchema: schema, data: configString })
  }

  async function handleConvertConfig() {
    const code = editorRef.getModel().getValue()
    try {
      const v1config = JSON.parse(code)
      console.log(`Keys: ${Object.keys(v1config)}`)
      if (!Object.keys(v1config).includes('rules')) {
        toast.success("Not a Gmail2GDrive config!")
        return   
      } 
      // console.log(`Converting v1 config: ${v1config}`)
      const v2config = essentialConfig(V1ToV2Converter.v1ConfigToV2ConfigJson(v1config))
      handleUpdateConfig(JSON.stringify(v2config, null, 2))
      // console.log(`Converted config: ${state.config}`)
    } catch(e) {
      toast.success(`Conversion error: ${e}`)
      return
    }
  }

  async function handleToggleSchema() {
    const schema = fullSchema === ConfigSchemaV2 ? ConfigSchemaV1 : ConfigSchemaV2
    updateState({ fullSchema: schema, userSchema: schema })
  }
  
  return (
    <div style={{display:"flex"}}>
      <div style={{ flex: "50%", height: "800px" }}>
        <div style={{ boxSizing: "border-box", width: "100%" }}>
          <ConfigToolbar
            onConvert={handleConvertConfig}
            onCopyConfig={handleCopyConfig}
            onCopyCode={handleCopyCode}
            onPaste={handlePaste}
          />
          <JSONSchemaEditor
            value={value}
            schema={fullSchema}
            theme={colorMode === "dark" ? "vs-dark" : "vs"}
            editorDidMount={(editor) => {
              updateState({ editorRef: editor })
            }}
            height={"70vh"}
            key={JSON.stringify(fullSchema)}
          />
        </div>
      </div>
      <div style={{ flex: "50%", height: "800px" }}>
        <SchemaToolbar
          onToggleSchema={handleToggleSchema}
        />
        <div
          style={{overflow: "auto", height: "800px"}}
        >
          <JSONSchemaViewer
            schema={fullSchema}
            key={JSON.stringify(fullSchema)}
          />
        </div>
      </div>
    </div>
  )
}

function StateProvider(): JSX.Element {
  const defaultSchema = ConfigSchemaV2
  const [state, setState] = React.useState({
    jsonPointer: "",
    data: JSON.stringify(config,null,2),
    userSchema: defaultSchema,
    fullSchema: defaultSchema,
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
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        return <StateProvider />
      }}
    </BrowserOnly>
  )
}
