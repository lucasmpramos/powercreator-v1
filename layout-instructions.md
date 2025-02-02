

## Layout & UI Structure Requirements

**Overview of the Application Layout**  
- **Left Sidebar**: For navigation (`AppSidebar`).  
- **Main Content Area**: Contains a top header/bar (with breadcrumb) and the main content below.  
- **Provider Wrapping**: Use `<SidebarProvider>` at the top level to manage sidebar state.  

**Detailed Instructions**  

1. **Sidebar**  
   - Import and include `<AppSidebar>` on the left side of every main page/layout.  
   - Use `<SidebarInset>` (or relevant wrapper) for the main content area.  

2. **Breadcrumb & Top Bar**  
   - Insert a top header section (often a `<header>` tag) that includes a breadcrumb component for navigation context.  
   - Example:
     ```tsx
     <SidebarInset>
       <header className="flex h-16 items-center px-4">
         {/* Breadcrumb component here */}
       </header>
       <div className="p-4">
         {/* Page content */}
       </div>
     </SidebarInset>
     ```

3. **Main Content**  
   - Wrap all page-specific UI within a `<div>` or `<main>` in the “content area” (the right-hand portion).  
   - Example:
     ```tsx
     <main className="flex-1 p-4">
       {/* My feature’s content */}
     </main>
     ```

4. **Provider Usage**  
   - Wrap your application in `<SidebarProvider>` (see `RootLayout` or `App.tsx` as an example) so the sidebar state (expanded/collapsed) is accessible throughout.  

5. **Reuse Existing UI Components**  
   - Rely on existing elements (e.g., `<Sidebar>`, `<Breadcrumb>`, `<SidebarMenuItem>`) for styling consistency.  
   - Avoid creating new, duplicate components unless absolutely necessary.

### Example Layout Snippet

```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function MyFeatureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-16 items-center gap-2 px-4">
          {/* Breadcrumb or other top bar components */}
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </div>
  )
}
```

By providing these instructions in Markdown format (as shown above), you can direct the AI to use (and respect) your layout structure and UI standards.