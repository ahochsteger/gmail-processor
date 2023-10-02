import BrowserOnly from "@docusaurus/BrowserOnly"
import ErrorBoundary from "@docusaurus/ErrorBoundary"
import Layout from "@theme/Layout"
import React from "react"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

function PlaygroundComponent(): JSX.Element {
  // No SSR for the live preview
  // See https://github.com/facebook/docusaurus/issues/5747
  return (
    <ErrorBoundary
      fallback={({ error, tryAgain }) => (
        <div>
          <p>Playground component crashed because of error: {error.message}.</p>
          <button onClick={tryAgain}>Try Again!</button>
        </div>
      )}
    >
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => {
          const PlaygroundInnerComponent =
            require("@site/src/components/PlaygroundInner").default
          return <PlaygroundInnerComponent />
        }}
      </BrowserOnly>
    </ErrorBoundary>
  )
}

export default function Playground(): JSX.Element {
  return (
    <Layout
      title={`Playground`}
      description="Playground of docusaurus-json-schema-plugin"
    >
      <PlaygroundComponent />
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} autoClose={3000} />
    </Layout>
  )
}
