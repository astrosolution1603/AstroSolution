import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildAstroSystemPrompt } from "@/lib/astro-prompt";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, sessionId, language, astrologerId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Bad Request", { status: 400 });
    }

    // Guard: reject oversized payloads (prevent abuse)
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.content || lastMsg.content.length > 4000) {
      return new Response("Message too long", { status: 400 });
    }

    const systemPromptPromise = buildAstroSystemPrompt(session.user.id, language, astrologerId, messages.length);
    const chatSessionPromise = sessionId ? prisma.chatSession.findUnique({ where: { id: sessionId } }) : Promise.resolve(null);
    
    const [systemPrompt, chatSession] = await Promise.all([systemPromptPromise, chatSessionPromise]);
    const lastMessage = messages[messages.length - 1];

    if (sessionId && lastMessage.role === "user") {
      // Save user message to DB first
      await Promise.all([
        prisma.chatMessage.create({
          data: { sessionId, role: "user", content: lastMessage.content, senderRole: "USER" },
        }),
        prisma.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() },
        })
      ]).catch(console.error);

      // AI Fallback: If an astrologer claimed this chat, or replied recently, let them handle it (skip AI)
      if (chatSession?.astrologerUserId || chatSession?.lastHumanReplyAt) {
        const timeSinceHumanReply = chatSession.lastHumanReplyAt 
          ? Date.now() - new Date(chatSession.lastHumanReplyAt).getTime()
          : 0;
        const TWO_MINUTES = 2 * 60 * 1000;
        
        // If chat is explicitly claimed by an astrologer, NEVER use AI.
        // If it's just a general chat but a human replied recently, wait for human.
        if (chatSession?.astrologerUserId || timeSinceHumanReply < TWO_MINUTES) {
          return new Response(
            new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('')); c.close(); } }),
            { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Vercel-AI-Data-Stream": "v1", "Cache-Control": "no-cache" } }
          );
        }
      }
    }

    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    const stream = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: openaiMessages as any,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullText = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
            }
          }

          // Save assistant message to DB after stream completes
          if (sessionId && fullText) {
            await prisma.chatMessage.create({
              data: { sessionId, role: "assistant", content: fullText },
            });
            const chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
            if (chatSession?.title === "New Chat") {
              const newTitle = fullText.length > 40 ? fullText.substring(0, 37) + "..." : fullText;
              await prisma.chatSession.update({
                where: { id: sessionId },
                data: { title: newTitle },
              });
            }
          }

          controller.close();
        } catch {
          controller.error(new Error("Stream failed"));
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
