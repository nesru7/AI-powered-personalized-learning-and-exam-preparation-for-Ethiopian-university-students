import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const MAX_MATERIAL_SIZE = 20 * 1024 * 1024

export function getMaterialStoragePath(storageKey: string) {
  if (!/^[a-f0-9-]+\.(pdf|pptx)$/.test(storageKey)) {
    throw new Error('Invalid material storage key.')
  }

  const directory = process.env.MATERIALS_STORAGE_DIR
    ? path.resolve(process.env.MATERIALS_STORAGE_DIR)
    : path.join(process.cwd(), 'storage', 'materials')

  return path.join(directory, storageKey)
}

export function getMaterialContentType(fileName: string) {
  return fileName.toLowerCase().endsWith('.pptx')
    ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    : 'application/pdf'
}

export function getPdfWorkerUrl() {
  return pathToFileURL(path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs')).href
}
