var config = {
  "processedLabel": "gmail2gdrive/client-test",
  "sleepTime": 100,
  "maxRuntime": 280,
  "timezone": "GMT",
  "rules": [
    {
      "filter": "to:my.name+scans@gmail.com",
      "folder": "'Scans'-yyyy-MM-dd"
    }
  ]
}

/* global GMail2GDrive */
function run() {
  console.log(
    JSON.stringify(GMail2GDrive.Lib.getEffectiveConfigV1(config), null, 2),
  )
}
