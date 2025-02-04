import PageTemplate from "@/components/page-template"
import { PageHeader } from "@/components/page-header"
import FlowEditor from "./components/flow-editor"

export default function FlowPage() {
  return (
    <div className="h-[100vh] flex flex-col">
      <PageTemplate
        breadcrumbItems={[{ title: "Flow Builder" }]}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex flex-col space-y-8 flex-1 min-h-0">
          <PageHeader 
            heading="Flow Builder" 
            description="Create and manage your flows"
          />
          <div className="flex-1 min-h-0">
            <FlowEditor />
          </div>
        </div>
      </PageTemplate>
    </div>
  )
} 