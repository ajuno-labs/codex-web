'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { authApi, ApiError } from "@/lib/api"

// Reusable components
import { AuthCard } from "./auth-card"
import { ErrorDisplay } from "./error-display"
import { OAuthButtons } from "./oauth-buttons"
import { FormDivider } from "./form-divider"
import { FormInput } from "./form-input"
import { useOAuth } from "./use-oauth"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isOAuthLoading, handleOAuthLogin } = useOAuth(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(data)
      
      // Store access token (in a real app, you might want to use a more secure storage)
      localStorage.setItem('access_token', response.access_token)
      
      // Redirect to the intended page
      router.push(redirectTo)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.response && 'messages' in err.response) {
          // Handle validation errors from backend
          const validationError = err.response as { error: string; messages: Record<string, string[]> }
          Object.entries(validationError.messages).forEach(([field, messages]) => {
            setFormError(field as keyof LoginFormData, {
              type: 'server',
              message: (messages as string[])[0],
            })
          })
          setError(validationError.error)
        } else if (err.status === 401) {
          setError("Invalid email or password")
        } else {
          setError(err.response?.error || "An error occurred during login")
        }
      } else {
        setError("Network error. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthWithError = async (provider: 'google' | 'github') => {
    try {
      await handleOAuthLogin(provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth login failed")
    }
  }

  const isFormLoading = isLoading || isSubmitting
  const isAnyLoading = isFormLoading || !!isOAuthLoading

  return (
    <AuthCard
      title="Welcome to Codex"
      description="Turn the web into a map you can walk."
    >
      <ErrorDisplay error={error} />

      <OAuthButtons
        onOAuthLogin={handleOAuthWithError}
        isOAuthLoading={isOAuthLoading}
        disabled={isAnyLoading}
      />

      <FormDivider />

      {/* Credential Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          disabled={isAnyLoading}
          {...register("email")}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isAnyLoading}
          {...register("password")}
        />

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isAnyLoading}
        >
          {isFormLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in to Codex"
          )}
        </Button>
      </form>

      {/* Sign up link */}
      <div className="text-center pt-4">
        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  )
} 