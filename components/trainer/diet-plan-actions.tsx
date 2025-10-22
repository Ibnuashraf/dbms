"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DietPlanForm } from "./diet-plan-form"
import { updateDietPlan, deleteDietPlan } from "@/app/actions/trainer-actions"
import { useRouter } from "next/navigation"

interface DietPlanActionsProps {
  planId: string
  planName: string
  planData: {
    plan_name: string
    description: string
    daily_calories: number
    protein_grams: number
    carbs_grams: number
    fat_grams: number
    client_id: string
    membership_plan_id?: string
  }
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

export function DietPlanActions({ planId, planName, planData, clients, membershipPlans }: DietPlanActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteDietPlan(planId)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete diet plan:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSuccess = () => {
    setEditOpen(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Diet Plan</DialogTitle>
            <DialogDescription>
              Update the nutrition plan details
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <DietPlanForm 
              clients={clients}
              membershipPlans={membershipPlans}
              initialData={planData}
              planId={planId}
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={loading}>
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Diet Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{planName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
