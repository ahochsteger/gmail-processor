import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import { Example } from '../../../src/examples/Example';

const examplesBasePath = "src/examples"
const exampleConfigBaseUrl = `https://github.com/ahochsteger/gmail-processor/blob/main/${examplesBasePath}`
const githubIssuesBaseUrl = "https://github.com/ahochsteger/gmail-processor/issues"
const githubPRsBaseUrl = "https://github.com/ahochsteger/gmail-processor/pull"

type ExampleConfigProps = {
  example: Example
}

function getIssueLinks(title: string, baseUrl: string, issues?: number[]): React.JSX.Element[] {
  let elements: React.JSX.Element[] = []
  if (issues && issues.length>0) {
    elements = [
      <span key={`${title}-0`}> ({title}: </span>,
    ].concat(
      issues?.map((nr,i,arr) => (
        <span key={nr}>
          <a href={`${baseUrl}/${nr}`}>#{nr}</a>{(i<arr.length-1) ? "," : ""}
        </span>
      ))
    )
    elements.push(<span>)</span>)
  }
  return elements
  // const issueLinks = issues.map(nr => <a key={nr} href={`${baseUrl}/${nr}`}>#{nr}</a>).join(", ")
  // return <span>, {title}: {issueLinks}</span>
}

export default function RenderExample({example}: ExampleConfigProps) {
  const info = example.info
  const relPath = `${example.info.category}/${example.info.name}.ts`
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
      <p>
        Source: <a href={`${exampleConfigBaseUrl}/${relPath}`}>{sourceFile}</a>
        {getIssueLinks("Issues", githubIssuesBaseUrl, example.info.issues)}
        {getIssueLinks("PRs", githubPRsBaseUrl, example.info.pullRequests)}
      </p>
    </>
  )
}
