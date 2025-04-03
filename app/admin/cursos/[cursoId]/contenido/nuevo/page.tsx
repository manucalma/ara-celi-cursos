"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AuthCheck } from "@/components/admin/auth-check"
import { ContenidoForm } from "@/components/admin/contenido-form"
import type { ContenidoItem } from "@/types"

interface NuevoContenidoPageProps {
  params: {
    cursoId: string
  }
}

export default function NuevoContenidoPage({ params }: NuevoContenidoPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const parentId = searchParams.get("parentId")

  const handleSubmit = async (contenidoData: Omit<ContenidoItem, "hijos">) => {
    try {
      const response = await fetch("/api/content")
      const data = await response.json()

      const curso = data.cursos.find((c) => c.id === params.cursoId)
      if (!curso) {
        throw new Error("Curso no encontrado")
      }

      // Crear el nuevo item de contenido
      const newItem: ContenidoItem = {
        ...contenidoData,
        hijos: [],
      }

      // Si hay un parentId, añadir como hijo
      if (parentId) {
        const addToParent = (items: ContenidoItem[]): boolean => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === parentId) {
              items[i].hijos.push(newItem)
              return true
            }

            if (items[i].hijos && items[i].hijos.length > 0) {
              if (addToParent(items[i].hijos)) {
                return true
              }
            }
          }

          return false
        }

        if (!addToParent(curso.contenido)) {
          throw new Error("Padre no encontrado")
        }
      } else {
        // Añadir al nivel principal
        curso.contenido.push(newItem)
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
      console.error("Error al crear el contenido:", error)
      alert("Error al crear el contenido: " + error.message)
    }
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuevo Contenido</h1>
        <ContenidoForm cursoId={params.cursoId} parentId={parentId || undefined} onSubmit={handleSubmit} />
      </div>
    </AuthCheck>
  )
}

