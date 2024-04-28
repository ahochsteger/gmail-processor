{{- $imports:=.|data.JSONArray|coll.Sort "path" -}}
{{- $examples:=.|data.JSONArray|coll.Sort "name" -}}
import { Example } from "./Example"
{{- range $imports }}
import { {{ .name }}Example } from "./{{ .path }}"
{{- end }}

export const defaultExample = simpleExample
export const allExamples: Example[] = [
{{- range $examples }}
  {{ .name }}Example,
{{- end }}
]
