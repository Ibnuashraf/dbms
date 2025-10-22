# Chatbot Setup Instructions

## Environment Variables

To use the Gemini chatbot feature, you need to add the following environment variable to your `.env.local` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## How to get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key and add it to your `.env.local` file

## Features

The chatbot provides:
- Fitness advice and workout tips
- Nutrition and diet recommendations
- General fitness guidance
- Motivation and goal setting
- Answers to gym equipment and exercise questions

## Usage

1. Navigate to the client dashboard
2. Click on "Chatbot" in the sidebar
3. Start chatting with your AI fitness assistant

## Security Note

Make sure to keep your API key secure and never commit it to version control. The `.env.local` file should be in your `.gitignore`.
