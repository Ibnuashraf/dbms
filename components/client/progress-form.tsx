"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { recordProgress } from "@/app/actions/client-actions"

interface ProgressFormProps {
  clientId: string
  onSuccess?: () => void
}

export function ProgressForm({ clientId, onSuccess }: ProgressFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      weight: Number.parseFloat(formData.get("weight") as string),
      body_fat_percentage: Number.parseFloat(formData.get("body_fat_percentage") as string),
      measurements_chest: Number.parseFloat(formData.get("measurements_chest") as string),
      measurements_waist: Number.parseFloat(formData.get("measurements_waist") as string),
      measurements_hips: Number.parseFloat(formData.get("measurements_hips") as string),
      notes: formData.get("notes") as string,
      client_id: clientId,
    }

    try {
      await recordProgress(data)
      e.currentTarget.reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record progress")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Progress</CardTitle>
        <CardDescription>Update your fitness measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" step="0.1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_fat_percentage">Body Fat (%)</Label>
              <Input id="body_fat_percentage" name="body_fat_percentage" type="number" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurements_chest">Chest (cm)</Label>
              <Input id="measurements_chest" name="measurements_chest" type="number" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurements_waist">Waist (cm)</Label>
              <Input id="measurements_waist" name="measurements_waist" type="number" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurements_hips">Hips (cm)</Label>
              <Input id="measurements_hips" name="measurements_hips" type="number" step="0.1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="How are you feeling? Any observations?" />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Recording..." : "Record Progress"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
