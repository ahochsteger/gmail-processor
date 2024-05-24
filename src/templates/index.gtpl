{{- $imports:=.|data.JSONArray|coll.Sort "path" -}}
{{- $examples:=.|data.JSONArray|coll.Sort "name" -}}
import { Example, V1Example } from "./Example"
{{- range $imports }}
import { example as {{ .name }}Example } from "./{{ .path }}"
{{- end }}

export const defaultExample = simpleExample
export const allExamples: (Example | V1Example)[] = [
{{- range $examples }}
  {{ .name }}Example,
{{- end }}
]
