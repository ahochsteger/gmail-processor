/* global GMail2GDrive */
function run() {
  console.log(
    JSON.stringify(GMail2GDrive.Lib.getEffectiveConfig(config), null, 2),
  )
}
