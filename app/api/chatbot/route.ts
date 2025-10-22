import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `You are a helpful fitness assistant for a gym management system. You help clients with:
- Workout advice and exercise form tips
- Nutrition and diet recommendations
- General fitness guidance
- Motivation and goal setting
- Answering questions about gym equipment and exercises

Keep your responses helpful, encouraging, and focused on fitness and health. If asked about medical advice, recommend consulting a healthcare professional.

Format your responses using markdown when appropriate (use **bold** for emphasis, *italics* for tips, bullet points with -, and numbered lists). Keep responses concise but informative.

User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chatbot API:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
