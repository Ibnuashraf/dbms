"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2 } from "lucide-react"

interface Member {
  id: string
  user: {
    full_name: string
    email: string
  }
  assigned_trainer_id: string | null
  membership_status: string
  join_date: string
}

interface MembersTableProps {
  members: Member[]
  trainers: Array<{ id: string; user: { full_name: string } }>
  onAssignTrainer: (memberId: string, trainerId: string) => Promise<void>
  onDeleteMember: (memberId: string) => Promise<void>
}

export function MembersTable({ members, trainers, onAssignTrainer, onDeleteMember }: MembersTableProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleAssignTrainer = async (memberId: string) => {
    if (!selectedTrainer[memberId]) return

    setLoading((prev) => ({ ...prev, [memberId]: true }))
    try {
      await onAssignTrainer(memberId, selectedTrainer[memberId])
      setSelectedTrainer((prev) => ({ ...prev, [memberId]: "" }))
    } finally {
      setLoading((prev) => ({ ...prev, [memberId]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Management</CardTitle>
        <CardDescription>Manage gym members and assign trainers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Trainer</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.user.full_name}</TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        member.membership_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.membership_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={selectedTrainer[member.id] || ""}
                        onValueChange={(value) => setSelectedTrainer((prev) => ({ ...prev, [member.id]: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select trainer" />
                        </SelectTrigger>
                        <SelectContent>
                          {trainers.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.id}>
                              {trainer.user.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleAssignTrainer(member.id)}
                        disabled={!selectedTrainer[member.id] || loading[member.id]}
                      >
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(member.join_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteMember(member.id)}>
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
