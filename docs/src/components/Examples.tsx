import CodeBlock from '@theme/CodeBlock';
import React from 'react';

const examplesPath = "../../static/examples"
const ExamplesList = []
const FetchExamples = async () => {
  Promise.all(
    [
      // "example01",
      "example02",
      // "exampleActionError",
      // "exampleMin",
      // "gettingStarted",
      // "migrationExample01",
      // "migrationExampleMin",
    ].map(async (name) => {
      const file = name + ".js"
      const code = await import(`!!raw-loader!${examplesPath}/${file}`)
      // const code = `\n\n\n${path}/${file}`
      ExamplesList.push({
        title: name,
        description: "",
        file: name + ".js",
        code: code
          .split("\n")
          //.slice(3)
          .map(l=>l.replace(/^export /,""))
          .join("\n"),
        source: `https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/${file}`,
      })
    })
  )
}

// Promise.all(
//   [
//     "example01",
//     // "example02",
//     // "exampleActionError",
//     // "exampleMin",
//     // "gettingStarted",
//     // "migrationExample01",
//     // "migrationExampleMin",
//   ].map(e => {
//     const path = "../../../src/gas/examples"
//     const file = e + ".js"
//     const code = await import(`raw-loader!${path}/${file}`)
//     return {
//       title: e,
//       description: "",
//       file: e + ".js",
//       code: code.split("\n").slice(3).map(l=>l.replace(/^export /,"")).join("\n"),
//       source: `https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/${e + ".js"}`,
//     }
//   })  
// )
// const ExamplesList1 = [
//   "example01",
//   // "example02",
//   // "exampleActionError",
//   // "exampleMin",
//   // "gettingStarted",
//   // "migrationExample01",
//   // "migrationExampleMin",
// ].map(e => {
//   const path = "../../../src/gas/examples"
//   const file = e + ".js"
//   import(`raw-loader!${path}/${file}`).then((code)=>{
//     return {
//       title: e,
//       description: "",
//       file: e + ".js",
//       code: code.split("\n").slice(3).map(l=>l.replace(/^export /,"")).join("\n"),
//       source: `https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/${e + ".js"}`,
//     }
//   })
// })

export function Example({title, description, file, code, source}) {
  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
      <CodeBlock
        language="jsx"
        showLineNumbers
        title={title}
      >{code}</CodeBlock>
      <p>Source file: <a href={source}>{file}</a></p>
    </>
  )
}

FetchExamples()
export default function Examples() {
  return (
    <>
      {ExamplesList.map((example) => (
        <Example key={example.file} {...example} />
      ))}
    </>
  );
}
