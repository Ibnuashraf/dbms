"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DietPlanForm } from "./diet-plan-form"

interface DietPlanDialogProps {
  clients: Array<{
    id: string
    user: {
      full_name: string
    }
  }>
  membershipPlans: Array<{
    id: string
    plan_name: string
    description: string
    price: number
    duration_days: number
    features: string[]
  }>
}

export function DietPlanDialog({ clients, membershipPlans }: DietPlanDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Plan</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Diet Plan</DialogTitle>
          <DialogDescription>
            Design a nutrition plan for your client
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <DietPlanForm 
            clients={clients}
            membershipPlans={membershipPlans}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
