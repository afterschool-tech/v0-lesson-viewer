"use client"

interface ImageRendererProps {
  src: string
  alt: string
  caption?: string
  width?: string
}

export function ImageRenderer({ src, alt, caption, width = "100%" }: ImageRendererProps) {
  return (
    <figure className="my-6">
      <div className="relative mx-auto" style={{ width }}>
        <img src={src || "/placeholder.svg"} alt={alt} className="rounded-md w-full h-auto" />
      </div>

      {caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{caption}</figcaption>}
    </figure>
  )
}
