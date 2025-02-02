"use client"

import * as React from "react"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface FormStepperProps {
  steps: { title: string; description?: string }[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export function FormStepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: FormStepperProps) {
  return (
    <nav
      aria-label="Progress"
      className={cn("w-full", className)}
    >
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <li key={step.title} className="md:flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  isCompleted
                    ? "border-primary hover:border-primary/80"
                    : isCurrent
                    ? "border-primary"
                    : "border-border hover:border-border/80",
                  onStepClick && "cursor-pointer"
                )}
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
              >
                <span className="flex items-center text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-2 border-primary"
                        : "border-2 border-border"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span className="ml-4 text-sm font-medium">
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight
                      className="ml-4 h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </span>
                {step.description && (
                  <span className="mt-0.5 ml-12 flex items-center text-sm text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </Button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 