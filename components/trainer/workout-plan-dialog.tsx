"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { WorkoutPlanForm } from "./workout-plan-form"
import { Plus } from "lucide-react"

interface Client {
  id: string
  user: {
    full_name: string
    email: string
  }
}

interface WorkoutPlanDialogProps {
  clients: Client[]
}

export function WorkoutPlanDialog({ clients }: WorkoutPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  const handleSuccess = () => {
    setOpen(false)
    setSelectedClientId("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Workout Plan</DialogTitle>
          <DialogDescription>
            Select a client and create a new workout plan for them.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedClientId ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select a Client</h3>
            <div className="grid gap-2">
              {clients.length === 0 ? (
                <p className="text-muted-foreground">No clients assigned to you yet.</p>
              ) : (
                clients.map((client) => (
                  <Button
                    key={client.id}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{client.user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{client.user.email}</div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Creating plan for: {clients.find(c => c.id === selectedClientId)?.user.full_name}
              </h3>
              <Button
                variant="outline"
                onClick={() => setSelectedClientId("")}
              >
                Back to Client Selection
              </Button>
            </div>
            <WorkoutPlanForm 
              clientId={selectedClientId} 
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
