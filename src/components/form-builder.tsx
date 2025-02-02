"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormStepper } from "@/components/ui/form-stepper"
import { 
  FormBuilderData,
  formBuilderSchema, 
  fieldTypes,
  FormStep
} from "@/lib/types/form-builder"

export function FormBuilder() {
  const form = useForm<FormBuilderData>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      steps: [
        {
          id: uuidv4(),
          title: "Step 1",
          fields: []
        }
      ]
    }
  })

  const { fields: steps, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps"
  })

  const [currentStep, setCurrentStep] = React.useState(0)

  function onSubmit(data: FormBuilderData) {
    console.log(data)
  }

  return (
    <div className="space-y-8">
      <FormStepper
        steps={steps.map((step) => ({ title: step.title }))}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter form name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter form description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {steps.map((step, stepIndex) => (
            <Card
              key={step.id}
              className={stepIndex === currentStep ? "" : "hidden"}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Step {stepIndex + 1}</CardTitle>
                {steps.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    onClick={() => removeStep(stepIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`steps.${stepIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`steps.${stepIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fields will be added here */}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendStep({
                  id: uuidv4(),
                  title: `Step ${steps.length + 1}`,
                  fields: []
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>

            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
              <Button type="submit">Save Form</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 