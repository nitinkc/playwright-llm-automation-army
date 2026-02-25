import fs from 'node:fs'
import path from 'node:path'

export type LocatorMap = Record<string, string>

const locatorsPath = path.join(process.cwd(), 'locators', 'locators.json')

export function readLocators(): LocatorMap {
  const raw = fs.readFileSync(locatorsPath, 'utf-8')
  return JSON.parse(raw) as LocatorMap
}

export function writeLocators(next: LocatorMap) {
  fs.writeFileSync(locatorsPath, JSON.stringify(next, null, 2), 'utf-8')
}

export function setLocator(key: string, selector: string) {
  const locs = readLocators()
  locs[key] = selector
  writeLocators(locs)
}
