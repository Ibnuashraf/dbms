"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDietPlan, updateDietPlan } from "@/app/actions/trainer-actions"

interface DietPlanFormProps {
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
  initialData?: {
    plan_name: string
    description: string
    daily_calories: number
    protein_grams: number
    carbs_grams: number
    fat_grams: number
    client_id: string
    membership_plan_id?: string
  }
  planId?: string
  onSuccess?: () => void
}

export function DietPlanForm({ clients, membershipPlans, initialData, planId, onSuccess }: DietPlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedClientId, setSelectedClientId] = useState(initialData?.client_id || "")
  const [selectedMembershipPlanId, setSelectedMembershipPlanId] = useState(initialData?.membership_plan_id || "")

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
      client_id: selectedClientId,
      membership_plan_id: selectedMembershipPlanId || null,
    }

    try {
      if (planId) {
        await updateDietPlan(planId, data)
      } else {
        await createDietPlan(data)
        // Safely reset the form
        if (e.currentTarget) {
          e.currentTarget.reset()
        }
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${planId ? 'update' : 'create'} diet plan`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Select Client</Label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId} required>
            <SelectTrigger>
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="membership_plan">Select Membership Plan (Optional)</Label>
          <Select value={selectedMembershipPlanId} onValueChange={setSelectedMembershipPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a membership plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No membership plan</SelectItem>
              {membershipPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.plan_name} - ${plan.price} ({plan.duration_days} days)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan_name">Plan Name</Label>
          <Input 
            id="plan_name" 
            name="plan_name" 
            placeholder="e.g., High Protein Diet" 
            defaultValue={initialData?.plan_name}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Describe the diet plan..." 
            defaultValue={initialData?.description}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="daily_calories">Daily Calories</Label>
            <Input 
              id="daily_calories" 
              name="daily_calories" 
              type="number" 
              min="1000" 
              defaultValue={initialData?.daily_calories}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="protein_grams">Protein (g)</Label>
            <Input 
              id="protein_grams" 
              name="protein_grams" 
              type="number" 
              step="0.1" 
              defaultValue={initialData?.protein_grams}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carbs_grams">Carbs (g)</Label>
            <Input 
              id="carbs_grams" 
              name="carbs_grams" 
              type="number" 
              step="0.1" 
              defaultValue={initialData?.carbs_grams}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fat_grams">Fat (g)</Label>
            <Input 
              id="fat_grams" 
              name="fat_grams" 
              type="number" 
              step="0.1" 
              defaultValue={initialData?.fat_grams}
              required 
            />
          </div>
        </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

        <Button type="submit" disabled={loading || !selectedClientId} className="w-full">
          {loading ? (planId ? "Updating..." : "Creating...") : (planId ? "Update Diet Plan" : "Create Diet Plan")}
        </Button>
      </form>
    </div>
  )
}
