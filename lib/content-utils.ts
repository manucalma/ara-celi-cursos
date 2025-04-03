import type { ContentData, ContenidoItem, Curso } from "@/types"
import fs from "fs"
import path from "path"

const contentFilePath = path.join(process.cwd(), "app/api/content.json")

export async function getContentData(): Promise<ContentData> {
  try {
    const fileContents = fs.readFileSync(contentFilePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading content file:", error)
    return { cursos: [] }
  }
}

export async function saveContentData(data: ContentData): Promise<boolean> {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error writing content file:", error)
    return false
  }
}

export function findCursoById(data: ContentData, cursoId: string): Curso | undefined {
  return data.cursos.find((curso) => curso.id === cursoId)
}

export function normalizeParam(param: string): string {
  // Normaliza los parámetros reemplazando guiones bajos por guiones medios
  return param.replace(/_/g, "-").toLowerCase()
}

export function findContenidoByParam(items: ContenidoItem[], param: string): ContenidoItem | undefined {
  const normalizedParam = normalizeParam(param)

  for (const item of items) {
    if (normalizeParam(item.urlParam) === normalizedParam) {
      return item
    }

    if (item.hijos && item.hijos.length > 0) {
      const found = findContenidoByParam(item.hijos, normalizedParam)
      if (found) return found
    }
  }

  return undefined
}

export function getAllActiveVisibleItems(items: ContenidoItem[]): ContenidoItem[] {
  let result: ContenidoItem[] = []

  for (const item of items) {
    if (item.activo && item.visible) {
      const itemCopy = { ...item, hijos: [] }
      result.push(itemCopy)

      if (item.hijos && item.hijos.length > 0) {
        const activeChildren = getAllActiveVisibleItems(item.hijos)
        result = [...result, ...activeChildren]
      }
    }
  }

  return result
}

export function getChildrenByParentParam(items: ContenidoItem[], parentParam: string): ContenidoItem[] {
  const normalizedParam = normalizeParam(parentParam)

  for (const item of items) {
    if (normalizeParam(item.urlParam) === normalizedParam && item.hijos && item.hijos.length > 0) {
      return item.hijos.filter((child) => child.activo && child.visible)
    }

    if (item.hijos && item.hijos.length > 0) {
      const found = getChildrenByParentParam(item.hijos, normalizedParam)
      if (found.length > 0) return found
    }
  }

  return []
}

export function flattenContenido(items: ContenidoItem[]): ContenidoItem[] {
  let result: ContenidoItem[] = []

  for (const item of items) {
    result.push({ ...item, hijos: [] })

    if (item.hijos && item.hijos.length > 0) {
      const flattenedChildren = flattenContenido(item.hijos)
      result = [...result, ...flattenedChildren]
    }
  }

  return result
}

