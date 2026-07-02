import { auth } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { sign } = await req.json();

    const VALID_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    if (!sign || !VALID_SIGNS.includes(sign)) {
      return new Response("Invalid zodiac sign", { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const prompt = `You are a Vedic Astrologer. Generate a detailed daily horoscope for the zodiac sign ${sign}. 
    Use the following format strictly:
    
    ## ❤️ Love & Relationships
    [Your prediction here]
    
    ## 💼 Career & Business
    [Your prediction here]
    
    ## 💰 Finance
    [Your prediction here]
    
    ## 🌿 Health & Wellness
    [Your prediction here]
    
    Do not include any introductory or concluding text. Just output the sections exactly as requested.`;

    const stream = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
            }
          }
        } catch {
          // Stream interrupted
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
