import { type NextRequest, NextResponse } from "next/server"
import { getContentData, saveContentData } from "@/lib/content-utils"

export async function GET() {
  const data = await getContentData()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (simplificado para este ejemplo)
    const authHeader = request.headers.get("Authorization")
    if (authHeader !== "Bearer admin-token") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const success = await saveContentData(data)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Error al guardar los datos" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

