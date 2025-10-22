"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { WorkoutPlanForm } from "./workout-plan-form"
import { updateWorkoutPlan, deleteWorkoutPlan } from "@/app/actions/trainer-actions"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WorkoutPlanActionsProps {
  plan: {
    id: string
    plan_name: string
    description: string
    duration_weeks: number
    difficulty_level: string
    client: {
      user: {
        full_name: string
      }
    }
  }
}

export function WorkoutPlanActions({ plan }: WorkoutPlanActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteWorkoutPlan(plan.id)
      toast({
        title: "Success",
        description: "Workout plan deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete workout plan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditSuccess = () => {
    setEditOpen(false)
    toast({
      title: "Success",
      description: "Workout plan updated successfully",
    })
  }

  return (
    <div className="flex gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workout Plan</DialogTitle>
            <DialogDescription>
              Update the workout plan for {plan.client.user.full_name}
            </DialogDescription>
          </DialogHeader>
          <EditWorkoutPlanForm 
            plan={plan} 
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={loading}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workout plan
              "{plan.plan_name}" for {plan.client.user.full_name}.
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

interface EditWorkoutPlanFormProps {
  plan: {
    id: string
    plan_name: string
    description: string
    duration_weeks: number
    difficulty_level: string
  }
  onSuccess?: () => void
}

function EditWorkoutPlanForm({ plan, onSuccess }: EditWorkoutPlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      plan_name: formData.get("plan_name") as string,
      description: formData.get("description") as string,
      duration_weeks: Number.parseInt(formData.get("duration_weeks") as string),
      difficulty_level: formData.get("difficulty_level") as string,
    }

    try {
      await updateWorkoutPlan(plan.id, data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update workout plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="plan_name" className="text-sm font-medium">Plan Name</label>
        <input 
          id="plan_name" 
          name="plan_name" 
          defaultValue={plan.plan_name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={plan.description}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="duration_weeks" className="text-sm font-medium">Duration (weeks)</label>
          <input 
            id="duration_weeks" 
            name="duration_weeks" 
            type="number" 
            min="1" 
            defaultValue={plan.duration_weeks}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty_level" className="text-sm font-medium">Difficulty Level</label>
          <select 
            id="difficulty_level" 
            name="difficulty_level" 
            defaultValue={plan.difficulty_level}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update Workout Plan"}
      </Button>
    </form>
  )
}
