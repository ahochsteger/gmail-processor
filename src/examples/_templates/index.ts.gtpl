{{- $examples:=.|data.JSONArray -}}
import { Example } from "./Example"
{{- range $examples }}
import { {{ .name }}Example } from "./{{ .path }}"
{{- end }}

export const defaultExample = simpleExample
export const allExamples: Example[] = [
{{- range $examples }}
  {{ .name }}Example,
{{- end }}
]
