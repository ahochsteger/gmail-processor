import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';

const exampleConfigBaseUrl = "https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/"

export default function ExampleConfig({name,config,title=name}) {
  const configFile = name+".json"
  const jsFile = name+".js"
  return (
    <>
      <p>{config?.description}</p>
      <p>NOTE: Copy the example and paste it into the <Link href='/playground'>playground</Link> to modify it.</p>
      <CodeBlock
        language="jsx"
        showLineNumbers
        title={configFile}
      >{JSON.stringify(config,null,2)}</CodeBlock>
      <p>Source files: <a href={`${exampleConfigBaseUrl}/${configFile}`}>{configFile}</a>, <a href={`${exampleConfigBaseUrl}/${jsFile}`}>{jsFile}</a></p>
    </>
  )
}
