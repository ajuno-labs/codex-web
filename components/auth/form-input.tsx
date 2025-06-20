import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </Label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${className || ''}`}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput" 