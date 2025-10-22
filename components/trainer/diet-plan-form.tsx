"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDietPlan } from "@/app/actions/trainer-actions"

interface DietPlanFormProps {
  clientId: string
  onSuccess?: () => void
}

export function DietPlanForm({ clientId, onSuccess }: DietPlanFormProps) {
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
      daily_calories: Number.parseInt(formData.get("daily_calories") as string),
      protein_grams: Number.parseFloat(formData.get("protein_grams") as string),
      carbs_grams: Number.parseFloat(formData.get("carbs_grams") as string),
      fat_grams: Number.parseFloat(formData.get("fat_grams") as string),
      client_id: clientId,
    }

    try {
      await createDietPlan(data)
      e.currentTarget.reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create diet plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Diet Plan</CardTitle>
        <CardDescription>Design a nutrition plan for your client</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan_name">Plan Name</Label>
            <Input id="plan_name" name="plan_name" placeholder="e.g., High Protein Diet" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the diet plan..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_calories">Daily Calories</Label>
              <Input id="daily_calories" name="daily_calories" type="number" min="1000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein_grams">Protein (g)</Label>
              <Input id="protein_grams" name="protein_grams" type="number" step="0.1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs_grams">Carbs (g)</Label>
              <Input id="carbs_grams" name="carbs_grams" type="number" step="0.1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat_grams">Fat (g)</Label>
              <Input id="fat_grams" name="fat_grams" type="number" step="0.1" required />
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Diet Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
