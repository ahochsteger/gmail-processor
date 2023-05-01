/* global GMail2GDrive */
function run() {
  console.log("Processing config started ...")
  GMail2GDrive.Lib.run(config, RunMode.DRY_RUN)
  console.log("Processing config finished ...")
}
