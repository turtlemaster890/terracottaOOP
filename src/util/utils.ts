import * as fs from "node:fs/promises"
import { fileURLToPath, URL } from "node:url";

export async function getAllFilesInFolder(folderUrl: URL): Promise<string[]> {
    const files: string[] = []
    async function getFiles(path: URL) {
        try {
            let stat = await fs.stat(path)
            if (stat.isDirectory()) {
                let files = [...await fs.readdir(path, { recursive: false })]
                for (const file of files) {
                    let newUrl = new URL(path)
                    newUrl.pathname += (!newUrl.pathname.endsWith("/") ? "/" : "") + file
                    await getFiles(newUrl)
                }
            } else {
                files.push(fileURLToPath(path))
            }
        } catch (e) {
            process.stderr.write(`Error while reading file ${fileURLToPath(path)}: ${e}\n`)
            return
        }
    }
    
    await getFiles(folderUrl)
    return files
}
