import { getCurrentUserWithRole } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { Chatbot } from "@/components/client/chatbot"

export default async function ChatbotPage() {
  const { user, role } = await getCurrentUserWithRole()

  // Middleware already checks authentication, just verify role
  if (role !== "client") {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Fitness Assistant</h1>
            <p className="text-muted-foreground">
              Get instant help with your fitness questions and goals
            </p>
          </div>
          <div className="h-[calc(100vh-12rem)]">
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  )
}
