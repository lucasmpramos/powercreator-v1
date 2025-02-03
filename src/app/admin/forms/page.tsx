import PageTemplate from "@/components/page-template"
import { FormBuilder } from "@/components/form-builder"
import { PageHeader } from "@/components/page-header"

export default function FormsPage() {
  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[{ title: "Form Builder" }]}
    >
      <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Form Builder"
            description="Create and manage your multi-step forms"
          />
        </div>
        <div className="min-h-[calc(100vh-12rem)]">
          <FormBuilder />
        </div>
      </div>
    </PageTemplate>
  )
} 