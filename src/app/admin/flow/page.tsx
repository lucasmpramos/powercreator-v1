import PageTemplate from "@/components/page-template"
import { VisualFormBuilder } from "@/components/visual-form-builder"
import { PageHeader } from "@/components/page-header"

export default function FlowPage() {
  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[{ title: "Visual Form Builder" }]}
    >
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Visual Form Builder"
            description="Create and edit your form layouts visually"
          />
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <VisualFormBuilder />
        </div>
      </div>
    </PageTemplate>
  )
} 