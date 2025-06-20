import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google-icon"

interface OAuthButtonsProps {
  onOAuthLogin: (provider: 'google' | 'github') => Promise<void>
  isOAuthLoading: string | null
  disabled?: boolean
}

export function OAuthButtons({ onOAuthLogin, isOAuthLoading, disabled }: OAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        onClick={() => onOAuthLogin('google')}
        disabled={disabled}
      >
        {isOAuthLoading === 'google' ? (
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-3 h-4 w-4" />
        )}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        onClick={() => onOAuthLogin('github')}
        disabled={disabled}
      >
        {isOAuthLoading === 'github' ? (
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-3 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
    </div>
  )
} 