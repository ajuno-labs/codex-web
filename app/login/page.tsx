import { Suspense } from "react"
import LoginForm from "@/components/auth/login-form"

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const redirectTo = params.redirectTo

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm redirectTo={redirectTo} />
    </Suspense>
  )
}

export const metadata = {
  title: "Login - Codex",
  description: "Sign in to your Codex account",
} 