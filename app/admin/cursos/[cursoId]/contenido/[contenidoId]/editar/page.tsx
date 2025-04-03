"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthCheck } from "@/components/admin/auth-check"
import { ContenidoForm } from "@/components/admin/contenido-form"
import type { ContenidoItem } from "@/types"

interface EditarContenidoPageProps {
  params: {
    cursoId: string
    contenidoId: string
  }
}

export default function EditarContenidoPage({ params }: EditarContenidoPageProps) {
  const [contenido, setContenido] = useState<ContenidoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const response = await fetch("/api/content")
        const data = await response.json()

        const curso = data.cursos.find((c) => c.id === params.cursoId)
        if (!curso) {
          router.push("/admin/cursos")
          return
        }

        const findContenidoById = (items: ContenidoItem[]): ContenidoItem | null => {
          for (const item of items) {
            if (item.id === params.contenidoId) {
              return item
            }

            if (item.hijos && item.hijos.length > 0) {
              const found = findContenidoById(item.hijos)
              if (found) return found
            }
          }

          return null
        }

        const contenidoEncontrado = findContenidoById(curso.contenido)
        if (contenidoEncontrado) {
          setContenido(contenidoEncontrado)
        } else {
          router.push(`/admin/cursos/${params.cursoId}/contenido`)
        }
      } catch (error) {
        console.error("Error al obtener el contenido:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContenido()
  }, [params.cursoId, params.contenidoId, router])

  const handleSubmit = async (contenidoData: Omit<ContenidoItem, "hijos">) => {
    try {
      const response = await fetch("/api/content")
      const data = await response.json()

      const curso = data.cursos.find((c) => c.id === params.cursoId)
      if (!curso) {
        throw new Error("Curso no encontrado")
      }

      const updateContenido = (items: ContenidoItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === params.contenidoId) {
            // Mantener los hijos existentes
            items[i] = {
              ...contenidoData,
              hijos: items[i].hijos,
            }
            return true
          }

          if (items[i].hijos && items[i].hijos.length > 0) {
            if (updateContenido(items[i].hijos)) {
              return true
            }
          }
        }

        return false
      }

      if (!updateContenido(curso.contenido)) {
        throw new Error("Contenido no encontrado")
      }

      // Guardar los cambios
      await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin-token",
        },
        body: JSON.stringify(data),
      })

      router.push(`/admin/cursos/${params.cursoId}/contenido`)
    } catch (error) {
      console.error("Error al actualizar el contenido:", error)
      alert("Error al actualizar el contenido: " + error.message)
    }
  }

  if (loading) {
    return (
      <AuthCheck>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </AuthCheck>
    )
  }

  if (!contenido) {
    return (
      <AuthCheck>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Contenido no encontrado</h1>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Editar Contenido</h1>
        <ContenidoForm cursoId={params.cursoId} item={contenido} onSubmit={handleSubmit} />
      </div>
    </AuthCheck>
  )
}

