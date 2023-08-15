.[]
| select(
  .resource?.labels?.function_name==$functionName
  and (
    now - (
      .timestamp
      | sub("(?<time>T[0-9:]+)(\\.\\d+)?(?<tz>Z|[+\\-]\\d{2}:?(\\d\\d)?)$"; .time + .tz)|fromdateiso8601
    )
  )<$logTimeSeconds
)
| {
  timestamp,
  receiveTimestamp,
  severity,
  "message": .jsonPayload?.message
}
