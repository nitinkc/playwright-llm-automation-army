import fs from 'node:fs'
import path from 'node:path'

const target = process.argv[2] || 'v1'
const src = path.join(process.cwd(), 'locators', `locators.baseline.${target}.json`)
const dst = path.join(process.cwd(), 'locators', 'locators.json')

if (!fs.existsSync(src)) {
  console.error(`No baseline file: ${src}`)
  process.exit(1)
}

fs.copyFileSync(src, dst)
console.log(`reset: locators.json -> baseline ${target}`)
