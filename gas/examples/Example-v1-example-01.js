/* global GMail2GDrive */
function runWithV1Config() {
  console.log("Processing v1 config started ...")
  GMail2GDrive.Lib.runWithV1Config(config, true)
  console.log("Processing v1 config finished ...")
}
