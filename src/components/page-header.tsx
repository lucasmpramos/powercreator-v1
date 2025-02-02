interface PageHeaderProps {
  heading: string
  description?: string
}

export function PageHeader({ heading, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{heading}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  )
} 