/* global GMail2GDrive */
function run() {
  console.log("Processing config started ...")
  GMail2GDrive.Lib.run(config, true)
  console.log("Processing config finished ...")
}
