"use client"

interface FallbackRendererProps {
  type?: string
  [key: string]: any
}

export function FallbackRenderer({ type }: FallbackRendererProps) {
  return (
    <div className="p-4 border border-dashed rounded-md bg-muted/50 mb-4">
      <div className="text-center text-muted-foreground">
        <p className="font-medium">{type || "Unknown"} Component</p>
        <p className="text-sm">This component type is not available in the viewer</p>
      </div>
    </div>
  )
}
