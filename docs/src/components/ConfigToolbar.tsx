import React from "react"

type Params = {
  onConvert: () => void
  onCopyConfig: () => void
  onCopyCode: () => void
  onPaste: () => void
}

const ConfigToolbar = ({ onConvert, onCopyConfig, onCopyCode, onPaste }: Params) => {
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
      fontSize: "16px"
    },
  }

  return (
    <div style={styles.toolbar}>
      <h1>Config JSON</h1>
      &nbsp;
      <div style={{ flex: 1 }} />
      <button
        style={styles.icon}
        onClick={onPaste}
        title="Paste config from clipboard"
      >📋</button>
      <button
        style={styles.icon}
        onClick={onConvert}
        title="Convert config (Gmail2GDrive -> GmailProcessor)"
      >🔄</button>
      <button
        style={styles.icon}
        onClick={onCopyConfig}
        title="Copy just the config to clipboard"
      >🗐</button>
      <button
        style={styles.icon}
        onClick={onCopyCode}
        title="Copy the full executable code to clipboard"
      >🚀</button>
    </div>
  )
}

export default ConfigToolbar
