import PageTemplate from "@/components/page-template"
import { FlowEditor } from "@/components/flow-editor"
import { PageHeader } from "@/components/page-header"

export default function FlowPage() {
  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[{ title: "Flow Editor" }]}
    >
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Flow Editor"
            description="Create and edit your workflow diagrams"
          />
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <FlowEditor />
        </div>
      </div>
    </PageTemplate>
  )
} 