import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Connexion · Espace client",
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}
