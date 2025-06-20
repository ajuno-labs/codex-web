'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Chrome, Loader2 } from "lucide-react"
import { authApi, ApiError, type ValidationError } from "@/lib/api"

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const response = await authApi.login(formData)
      
      // Store access token (in a real app, you might want to use a more secure storage)
      localStorage.setItem('access_token', response.access_token)
      
      // Redirect to the intended page
      router.push(redirectTo)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.response && 'messages' in err.response) {
          // Handle validation errors
          const validationError = err.response as ValidationError
          setValidationErrors(validationError.messages)
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

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      
      // Store redirect destination for after OAuth callback
      localStorage.setItem('oauth_redirect_to', redirectTo)
      
      const response = await authApi.getOAuthUrl(provider)
      
      // Redirect to OAuth provider
      window.location.href = response.redirect_url
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.response?.error || `Failed to initiate ${provider} login`)
      } else {
        setError("Network error. Please try again.")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-2xl">C</div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-slate-900">Welcome to Codex</CardTitle>
            <CardDescription className="text-slate-600 text-base leading-relaxed">
              Turn the web into a map you can walk.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-3 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-3 h-4 w-4" />
              )}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-3 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-3 h-4 w-4" />
              )}
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-slate-200" />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500 font-medium">or</span>
            </div>
          </div>

          {/* Credential Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                  validationErrors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600">{validationErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                  validationErrors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600">{validationErrors.password[0]}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
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
        </CardContent>
      </Card>
    </div>
  )
} 