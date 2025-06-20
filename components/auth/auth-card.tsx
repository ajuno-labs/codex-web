import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-2xl">C</div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-slate-900">{title}</CardTitle>
            <CardDescription className="text-slate-600 text-base leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
} 