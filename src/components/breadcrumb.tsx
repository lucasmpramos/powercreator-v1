import * as React from "react"
import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbNavProps {
  items: Array<{ title: string; href?: string }>;
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/admin/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
        </BreadcrumbItem>
        {items.map((item) => (
          <React.Fragment key={item.title}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <Link to={item.href} className="text-sm font-medium">
                  {item.title}
                </Link>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 