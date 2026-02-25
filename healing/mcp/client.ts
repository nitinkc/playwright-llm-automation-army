import path from 'node:path'
import { spawn } from 'node:child_process'

type RpcReq = { id: string; method: string; params?: any }
type RpcRes = { id: string; result?: any; error?: any }

export async function callMcp(method: string, params: any) {
  const serverPath = path.join(process.cwd(), 'healing', 'mcp', 'server.js')

  // Spawn per call for simplicity. In a real worker you would keep it alive.
  const child = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'pipe'] })

  const id = Math.random().toString(16).slice(2)
  const req: RpcReq = { id, method, params }

  const res = await new Promise<RpcRes>((resolve, reject) => {
    let buf = ''
    child.stdout.on('data', (d) => {
      buf += d.toString('utf-8')
      const lines = buf.split('\n')
      buf = lines.pop() || ''
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const parsed = JSON.parse(line) as RpcRes
          if (parsed.id === id) resolve(parsed)
        } catch (e) {
          // ignore
        }
      }
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      // if we did not resolve by now, reject
      // but keep it gentle
      setTimeout(() => reject(new Error(`mcp server exited code=${code}`)), 30)
    })
  }).finally(() => {
    child.kill()
  })

  if (res.error) throw new Error(String(res.error))
  return res.result
}
