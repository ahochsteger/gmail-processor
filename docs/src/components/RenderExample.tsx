import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import { Example } from '../../../src/examples/Example';

const exampleConfigBaseUrl = "https://github.com/ahochsteger/gmail-processor/blob/main/src/examples/"

type ExampleConfigProps = {
  example: Example
}
export default function RenderExample({example}: ExampleConfigProps) {
  const info = example.info
  const config = example.config
  const sourceFile = `${info.name}.ts`
  return (
    <>
      <p>{info.description}</p>
      <p>👉 Edit this example in the <Link href={`/playground?example=${info.name}`}>playground</Link>{ info.schemaVersion === "v1" ? " and automatically migrate it to the v2 format using the convert button" : ""}.</p>
      <Tabs>
        <TabItem value="config" label="Config" default>
          <CodeBlock
            language="jsx"
            showLineNumbers
          >{JSON.stringify(config,null,2)}</CodeBlock>
        </TabItem>
        <TabItem value="script" label="Script">
          <CodeBlock
            language="jsx"
            showLineNumbers
          >{ (info.schemaVersion === "v1") ?
`function migrateConfig() {"{"}
  const oldConfig = {JSON.stringify(config,null,2)}
  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)
  console.log(JSON.stringify(migratedConfig, null, 2))
}`
:
`function run() {
  const config = ${JSON.stringify(config,null,2).split("\n").map(l=>`  ${l}`).join("\n").trim()}
  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)
}`
}
</CodeBlock>
        </TabItem>
      </Tabs>
      <p>Source: <a href={`${exampleConfigBaseUrl}/${sourceFile}`}>{sourceFile}</a></p>
      <p>Issues: {example.info.issues?.map(nr => <a key={nr} href={`https://github.com/ahochsteger/gmail-processor/issues/${nr}`}>#{nr}</a>).join(", ")}</p>
      <p>PRs: {example.info.pullRequests?.map(nr => <a key={nr} href={`https://github.com/ahochsteger/gmail-processor/pull/${nr}`}>#{nr}</a>).join(", ")}</p>
    </>
  )
}
