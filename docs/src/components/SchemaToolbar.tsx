import React from "react"


type Params = {
  onToggleSchema: () => void
}

const SchemaToolbar = ({ onToggleSchema, }: Params) => {
  const styles = {
    toolbar: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "8px",
      backgroundColor: "inherit",
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      marginRight: "8px",
      backgroundColor: "transparent",
      cursor: "pointer",
      border: "1px solid",
      fontWeight: "bold",
    },
  }

  return (
    <div style={styles.toolbar}>
      <h1>Schema</h1>
      &nbsp;
      <div style={{ flex: 1 }} />
      <button
        style={styles.icon}
        onClick={onToggleSchema}
        title="Toggle config schema version"
      >
        🌀
      </button>
    </div>
  )
}

export default SchemaToolbar
