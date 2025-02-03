import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface PageTemplateProps {
  children: React.ReactNode;
  // layout type: "fullLeft" (left aligned, full width) or "centered" (centered content)
  layout?: "fullLeft" | "centered";
  breadcrumbItems: Array<{ title: string; href?: string }>;
}

export default function PageTemplate({
  children,
  layout = "fullLeft",
  breadcrumbItems,
}: PageTemplateProps) {
  // If "centered", we can use a container class to center content.
  const containerClass =
    layout === "centered" 
      ? "mx-auto max-w-4xl p-4 lg:px-8 pt-0" 
      : "p-4 lg:px-8 pt-0";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header Top Bar */}
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 lg:px-8">
            <SidebarTrigger className="-ml-1" /> {/* Sidebar collapse button */}
            <Separator orientation="vertical" className="mr-2 h-4" /> {/* Separator between sidebar trigger and breadcrumb */}
            {/* Breadcrumb */}
            <BreadcrumbNav items={[ 
              { title: "Platform", href: "#" },
              ...breadcrumbItems
            ]} />
          </div>
        </header>
        {/* Page content container */}
        <div className={containerClass}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 