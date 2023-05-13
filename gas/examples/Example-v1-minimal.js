/* global GMail2GDrive */
function runV1ConfigMinimal() {
  console.log(
    JSON.stringify(GMail2GDrive.Lib.getEffectiveConfigV1(config), null, 2),
  )
}
