"use client"

interface ParagraphRendererProps {
  content: string
  align?: "left" | "center" | "right" | "justify"
}

export function ParagraphRenderer({ content, align = "left" }: ParagraphRendererProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }

  return <div className={`${alignmentClasses[align]} mb-4`} dangerouslySetInnerHTML={{ __html: content }} />
}
