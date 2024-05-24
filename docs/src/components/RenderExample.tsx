import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import { ExampleInfo, ExampleVariant } from '../../../src/examples/Example';

const examplesBasePath = "src/examples"
const examplesBaseUrl = `https://github.com/ahochsteger/gmail-processor/blob/main/${examplesBasePath}`
const githubIssuesBaseUrl = "https://github.com/ahochsteger/gmail-processor/issues"
const githubPRsBaseUrl = "https://github.com/ahochsteger/gmail-processor/pull"

type ExampleConfigProps = {
  info: ExampleInfo
  config: string
  script: string
}

export function getIssueLinks(title: string, baseUrl: string, issues?: number[]): React.JSX.Element[] {
  let elements: React.JSX.Element[] = []
  if (issues && issues.length > 0) {
    elements = [
      <span key={`${title}-0`}> | {title}: </span>,
    ].concat(
      issues?.map((nr, i, arr) => (
        <span key={nr}>
          <a href={`${baseUrl}/${nr}`}>#{nr}</a>{(i < arr.length - 1) ? " " : ""}
        </span>
      ))
    )
    elements.push(<span></span>)
  }
  return elements
}

export default function RenderExample({ info, config, script }: ExampleConfigProps) {
  return (
    <>
      <p>👉 Edit this example in the <Link href={`/playground?example=${info.name}`}>playground</Link>{info.variant===ExampleVariant.MIGRATION_V1 ? " and automatically migrate it to the v2 format using the convert button" : ""}.</p>
      <Tabs>
        <TabItem value="config" label="Config" default>
          <CodeBlock language="js" showLineNumbers>{config}</CodeBlock>
        </TabItem>
        <TabItem value="script" label="Script">
          <CodeBlock language="js" showLineNumbers>{script}</CodeBlock>
        </TabItem>
      </Tabs>
      <p>
        <span>Source: <a href={`${examplesBaseUrl}/${info.category}/${info.name}`}>{info.name}.ts</a></span>
        {getIssueLinks("Issues", githubIssuesBaseUrl, info.issues)}
        {getIssueLinks("PRs", githubPRsBaseUrl, info.pullRequests)}
      </p>
    </>
  )
}
