import fs from 'node:fs'
import path from 'node:path'

const p = path.join(process.cwd(), 'locators', 'locators.json')
const raw = fs.readFileSync(p, 'utf-8')
console.log(raw)
