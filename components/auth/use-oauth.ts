import { useState } from "react"
import { authApi, ApiError } from "@/lib/api"

export function useOAuth(redirectTo: string = "/") {
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setIsOAuthLoading(provider)
      
      // Store redirect destination for after OAuth callback
      localStorage.setItem('oauth_redirect_to', redirectTo)
      
      const response = await authApi.getOAuthUrl(provider)
      
      // Redirect to OAuth provider
      window.location.href = response.redirect_url
    } catch (err) {
      let errorMessage = "Network error. Please try again."
      
      if (err instanceof ApiError) {
        errorMessage = err.response?.error || `Failed to initiate ${provider} login`
      }
      
      setIsOAuthLoading(null)
      throw new Error(errorMessage)
    }
  }

  return {
    isOAuthLoading,
    handleOAuthLogin
  }
} 