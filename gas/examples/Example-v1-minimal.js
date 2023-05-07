/* global GMail2GDrive */
function run() {
  console.log(
    JSON.stringify(GMail2GDrive.Lib.getEffectiveConfigV1(config), null, 2),
  )
}
