export type ComponentCategory = "content" | "interactive" | "gamified"

export interface ComponentDefinition {
  type: string
  label: string
  category: ComponentCategory
  description: string
  icon: string
  defaultProps: Record<string, any>
  propDefinitions: PropDefinition[]
}

export interface PropDefinition {
  name: string
  label: string
  type: "string" | "number" | "boolean" | "select" | "richText" | "image" | "componentArray"
  required: boolean
  defaultValue: any
  placeholder?: string
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
}
