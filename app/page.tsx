import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Users, Apple, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">GymPro</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Manage Your Gym Like a Pro</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Complete gym management system for admins, trainers, and clients
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage members, track progress, and assign trainers</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Dumbbell className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Workout Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create and customize workout plans for each client</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Apple className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Diet Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Design nutrition plans with macro tracking</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Monitor client progress with detailed analytics</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Built for Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Admins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">✓ Manage members and trainers</p>
                <p className="text-sm">✓ Handle payments and salaries</p>
                <p className="text-sm">✓ View comprehensive analytics</p>
                <p className="text-sm">✓ Assign trainers to clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Trainers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">✓ Create workout plans</p>
                <p className="text-sm">✓ Design diet plans</p>
                <p className="text-sm">✓ Track client progress</p>
                <p className="text-sm">✓ Communicate with clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Clients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">✓ View assigned plans</p>
                <p className="text-sm">✓ Track progress</p>
                <p className="text-sm">✓ Contact trainer</p>
                <p className="text-sm">✓ Monitor fitness goals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Gym?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join hundreds of gyms using GymPro to manage their operations
        </p>
        <Link href="/auth/signup">
          <Button size="lg">Get Started Now</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 GymPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
