"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createWorkoutPlan } from "@/app/actions/trainer-actions"

interface WorkoutPlanFormProps {
  clientId: string
  onSuccess?: () => void
}

export function WorkoutPlanForm({ clientId, onSuccess }: WorkoutPlanFormProps) {
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
      client_id: clientId,
    }

    try {
      await createWorkoutPlan(data)
      e.currentTarget.reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workout plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Workout Plan</CardTitle>
        <CardDescription>Design a new workout plan for your client</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan_name">Plan Name</Label>
            <Input id="plan_name" name="plan_name" placeholder="e.g., Strength Training" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the workout plan..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_weeks">Duration (weeks)</Label>
              <Input id="duration_weeks" name="duration_weeks" type="number" min="1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select name="difficulty_level" defaultValue="intermediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Workout Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
