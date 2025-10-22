"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressData {
  date: string
  weight: number
  bodyFat: number
}

interface ProgressChartProps {
  data: ProgressData[]
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight & Body Fat Progress</CardTitle>
        <CardDescription>Track your fitness journey over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" />
            <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#ef4444" name="Body Fat (%)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
