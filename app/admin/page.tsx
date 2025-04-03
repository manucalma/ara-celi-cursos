import { LoginForm } from "@/components/admin/login-form"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Administración de Cursos</h1>
      <LoginForm />
    </div>
  )
}

