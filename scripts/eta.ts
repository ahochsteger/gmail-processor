import { Eta } from "eta"
import { readFileSync, writeSync } from "fs"
import path from "path"
import { argv, stdout } from "process"

if (argv.length < 3) {
  console.error(`Missing arguments!`)
  process.exit(1)
}
const template = argv[2]
const data = JSON.parse(readFileSync(0, "utf-8"))
const eta = new Eta({ views: path.join("src", "templates") })
writeSync(stdout.fd, eta.render(template, data))
