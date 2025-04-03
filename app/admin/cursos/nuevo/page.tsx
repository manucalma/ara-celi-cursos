"use client"

import { useRouter } from "next/navigation"
import { AuthCheck } from "@/components/admin/auth-check"
import { CursoForm } from "@/components/admin/curso-form"
import type { Curso } from "@/types"

export default function NuevoCursoPage() {
  const router = useRouter()

  const handleSubmit = async (cursoData: Omit<Curso, "contenido">) => {
    try {
      const response = await fetch("/api/content")
      const data = await response.json()

      // Verificar si ya existe un curso con el mismo ID
      if (data.cursos.some((c) => c.id === cursoData.id)) {
        throw new Error("Ya existe un curso con este ID")
      }

      // Añadir el nuevo curso
      const newCurso: Curso = {
        ...cursoData,
        contenido: [],
      }

      data.cursos.push(newCurso)

      // Guardar los cambios
      await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin-token",
        },
        body: JSON.stringify(data),
      })

      router.push("/admin/cursos")
    } catch (error) {
      console.error("Error al crear el curso:", error)
      alert("Error al crear el curso: " + error.message)
    }
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuevo Curso</h1>
        <CursoForm onSubmit={handleSubmit} />
      </div>
    </AuthCheck>
  )
}

