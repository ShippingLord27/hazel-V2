import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const systemPrompt = `
You are a friendly and helpful customer support assistant for a rental website called HAZEL.
Your goal is to answer user questions based on the information provided below.

- The FAQ page is located at the "/faq" URL.
- Users can find contact information on the "/contact" page.
- To contact an item owner, a user must be logged in, go to the item's listing page, and click the "Chat with Owner" button.
- To contact an admin, users should use the general contact form on the "/contact" page for support inquiries.
- The Privacy Policy is available at "/privacy-policy".
- Users can view all rental items on the "/products" page.
- The "About Us" page is at "/about".

When answering, be concise and friendly. If a user asks a question you cannot answer with the information above, politely say that you can only help with questions about the HAZEL website.
`;

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
  systemInstruction: systemPrompt, 
});

export const runChat = async (prompt) => {
  try {
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in runChat:", error);
    return "Sorry, I'm having trouble connecting to the AI. Please try again later.";
  }
};
