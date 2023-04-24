import send from "@fastify/send"
import { createRequestHandler } from "@mcansh/remix-raw-http"
import type { PathLike } from "node:fs"
import { stat } from "node:fs/promises"
import type { IncomingMessage } from "node:http"
import { createServer } from "node:http"
import { join } from "node:path"

import type { ServerBuild } from "@remix-run/node"
import * as serverBuild from "./build/index.js"

const MODE = process.env.NODE_ENV

async function checkFileExists(path: PathLike) {
    try {
        const stats = await stat(path)
        return stats.isFile()
    } catch {
        return false
    }
}

async function serveFile(request: IncomingMessage) {
    let fileURL = request.url!

    // Workaround for HMR
    if (fileURL.includes("?")) {
        // Remove query params when checking for files
        fileURL = fileURL.split("?")[0]
    }

    const filePath = join(process.cwd(), "public", fileURL)
    const fileExists = await checkFileExists(filePath)

    if (!fileExists) {
        return undefined
    }

    const isBuildAsset = request.url!.startsWith("/build")

    return send(request, filePath, {
        immutable: MODE === "production" && isBuildAsset,
        maxAge: MODE === "production" && isBuildAsset ? "1y" : 0,
    })
}

const server = createServer(async (request, response) => {
    try {
        const fileStream = await serveFile(request)
        if (fileStream) {
            return fileStream.pipe(response)
        }
        createRequestHandler({ build: serverBuild as any as ServerBuild, mode: MODE })(
            request,
            response
        )
    } catch (error) {
        console.error(error)
    }
})

const port = Number(process.env.PORT) || 3000

server.listen(port, () => {
    console.log(`✅ app ready: http://localhost:${port}`)
})
