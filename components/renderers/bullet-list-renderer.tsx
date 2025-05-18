"use client"

interface BulletListRendererProps {
  items: string[]
  type?: "ordered" | "unordered"
}

export function BulletListRenderer({ items, type = "unordered" }: BulletListRendererProps) {
  if (type === "ordered") {
    return (
      <ol className="list-decimal pl-5 space-y-1 mb-4">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="list-disc pl-5 space-y-1 mb-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}
