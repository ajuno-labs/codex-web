import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface FormInputProps {
  id: string
  label: string
  type?: string
  placeholder: string
  error?: string
  disabled?: boolean
  className?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, type = "text", placeholder, error, disabled, className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const isPasswordField = type === "password"
    const inputType = isPasswordField && isPasswordVisible ? "text" : type

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            type={inputType}
            placeholder={placeholder}
            className={`h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${isPasswordField ? 'pr-12' : ''} ${className || ''}`}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {isPasswordField && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-slate-500" />
              ) : (
                <Eye className="h-4 w-4 text-slate-500" />
              )}
              <span className="sr-only">
                {isPasswordVisible ? "Hide password" : "Show password"}
              </span>
            </Button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput" 