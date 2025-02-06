import PageTemplate from "@/components/page-template"
import { PageHeader } from "@/components/page-header"
import FlowEditor from "./components/flow-editor"

export default function FlowPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageTemplate
        breadcrumbItems={[{ title: "Flow Builder" }]}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-none">
            <PageHeader 
              heading="Flow Builder" 
              description="Create and manage your flows"
            />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden pt-8">
            <FlowEditor />
          </div>
        </div>
      </PageTemplate>
    </div>
  )
} 