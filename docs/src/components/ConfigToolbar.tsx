import { Icon } from '@iconify/react';
import React from "react";
import { Example } from '../../../src/examples/Example';

type Params = {
  examples: Example[]
  selectedExample: string
  onConvert: () => void
  onCopyConfig: () => void
  onCopyCode: () => void
  onExampleSelected: (string) => void
  onPaste: () => void
  onDetectSchema: () => void
  onRepairJson: () => void
}

const ConfigToolbar = ({ examples, selectedExample, onConvert, onCopyConfig, onCopyCode, onDetectSchema, onExampleSelected, onPaste, onRepairJson }: Params) => {
  const styles = {
    toolbar: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "8px",
      backgroundColor: "inherit",
      fontSize: "20px"
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
      <h2>Config Editor</h2>
      &nbsp;
      <div style={{ flex: 1 }} />
      <select name='example' style={{fontSize:"20px"}} onChange={e => onExampleSelected(e.target.value)} value={selectedExample}>
        <option style={{fontWeight:"bold", textAlign: 'center'}} key="" value="">Select an example</option>
        <option disabled style={{fontWeight:"bold", textAlign: 'center'}}>⎼⎼⎼⎼ Gmail Processor ⎼⎼⎼⎼</option>
        {examples.filter(e=>e.info.schemaVersion!=="v1").map(ex => <option  key={ex.info.name} value={ex.info.name}>{ex.info.name}</option>)}
        <option disabled style={{fontWeight:"bold", textAlign: 'center'}}>⎼⎼⎼⎼ GMail2GDrive (Migration) ⎼⎼⎼⎼</option>
        {examples.filter(e=>e.info.schemaVersion==="v1").map(ex => <option  key={ex.info.name} value={ex.info.name}>{ex.info.name}</option>)}
      </select>
      &nbsp;<span title={examples.find(e=>e.info.name===selectedExample)?.info?.description}><Icon icon="mdi:info" /></span>
      <div style={{ flex: 1 }} />
      <button
        style={styles.icon}
        onClick={onDetectSchema}
        title="Detect config schema (Gmail Processor vs. GMail2GDrive)"
      ><Icon icon="mdi:help" /></button>
      <button
        style={styles.icon}
        onClick={onPaste}
        title="Paste config from clipboard"
      ><Icon icon="mdi:content-paste" /></button>
      <button
        style={styles.icon}
        onClick={onRepairJson}
        title="Repair JSON config"
      ><Icon icon="mdi:auto-fix" /></button>
      <button
        style={styles.icon}
        onClick={onConvert}
        title="Convert config (Gmail2GDrive -> GmailProcessor)"
      ><Icon icon="mdi:autorenew" /></button>
      <button
        style={styles.icon}
        onClick={onCopyConfig}
        title="Copy just the config to clipboard"
      ><Icon icon="mdi:content-copy" /></button>
      <button
        style={styles.icon}
        onClick={onCopyCode}
        title="Copy as executable JavaScript code to clipboard"
      ><Icon icon="fluent:code-js-16-filled" /></button>
    </div>
  )
}

export default ConfigToolbar
