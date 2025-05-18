"use client"

interface HeadingRendererProps {
  content: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: "left" | "center" | "right"
}

export function HeadingRenderer({ content, level = 2, align = "left" }: HeadingRendererProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const sizeClasses = {
    1: "text-4xl font-extrabold mb-6",
    2: "text-3xl font-bold mb-5",
    3: "text-2xl font-bold mb-4",
    4: "text-xl font-semibold mb-3",
    5: "text-lg font-semibold mb-2",
    6: "text-base font-semibold mb-2",
  }

  return <HeadingTag className={`${sizeClasses[level]} ${alignmentClasses[align]}`}>{content}</HeadingTag>
}
