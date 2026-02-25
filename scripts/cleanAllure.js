import fs from 'node:fs'
import path from 'node:path'

const dirs = ['allure-results', 'allure-report']
for (const d of dirs) {
  const p = path.join(process.cwd(), d)
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true })
    console.log(`cleaned: ${d}`)
  }
}
