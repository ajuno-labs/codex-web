interface ErrorDisplayProps {
  error: string | null
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="p-3 rounded-md bg-red-50 border border-red-200">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  )
} 