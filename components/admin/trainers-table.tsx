"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2 } from "lucide-react"

interface Trainer {
  id: string
  user: {
    full_name: string
    email: string
  }
  specialization: string | null
  hourly_rate: number | null
  salary: number | null
  is_active: boolean
}

interface TrainersTableProps {
  trainers: Trainer[]
  onDeleteTrainer: (trainerId: string) => Promise<void>
}

export function TrainersTable({ trainers, onDeleteTrainer }: TrainersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainers Management</CardTitle>
        <CardDescription>Manage trainers and their salaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell className="font-medium">{trainer.user.full_name}</TableCell>
                  <TableCell>{trainer.user.email}</TableCell>
                  <TableCell>{trainer.specialization || "N/A"}</TableCell>
                  <TableCell>${trainer.hourly_rate || "N/A"}</TableCell>
                  <TableCell>${trainer.salary || "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trainer.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {trainer.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteTrainer(trainer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
