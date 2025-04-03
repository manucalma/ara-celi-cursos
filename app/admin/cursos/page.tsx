import Link from "next/link"
import { AuthCheck } from "@/components/admin/auth-check"
import { getContentData } from "@/lib/content-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Video } from "lucide-react"

export default async function CursosPage() {
  const data = await getContentData()

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/cursos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.cursos.map((curso) => (
            <Card key={curso.id}>
              <CardHeader>
                <CardTitle>{curso.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{curso.descripcion}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      curso.publico ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {curso.publico ? "Público" : "Privado"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/cursos/${curso.id}/editar`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/admin/cursos/${curso.id}/contenido`}>
                      <Video className="mr-2 h-4 w-4" />
                      Contenido
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthCheck>
  )
}

