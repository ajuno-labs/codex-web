'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface CallbackPageProps {
  params: Promise<{ provider: string }>
}

export default function CallbackPage({ params }: CallbackPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const resolvedParams = await params
        const { provider } = resolvedParams
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (!code) {
          throw new Error('Authorization code not found')
        }

        // Make a request to the backend OAuth callback endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'}/oauth/${provider}/callback?code=${code}&state=${state}`, {
          method: 'GET',
          credentials: 'include', // Include cookies for refresh token
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'OAuth authentication failed')
        }

        // Store access token
        localStorage.setItem('access_token', data.access_token)

        // Redirect to dashboard or intended page
        const redirectTo = localStorage.getItem('oauth_redirect_to') || '/'
        localStorage.removeItem('oauth_redirect_to')
        
        router.push(redirectTo)
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setIsLoading(false)
      }
    }

    handleCallback()
  }, [params, searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">Authentication Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              Return to Login
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <CardTitle className="text-xl text-slate-900">Completing Sign In</CardTitle>
          <CardDescription>Please wait while we authenticate you...</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
} 