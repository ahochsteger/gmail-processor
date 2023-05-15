/* global GMail2GDrive */
function runConfigMinimal() {
  console.log(
    JSON.stringify(GMail2GDrive.Lib.getEffectiveConfig(config), null, 2),
  )
}
