import OpenAI from "openai";

async function main() {
  const openai = new OpenAI({
    apiKey: "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",
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  try {
    console.log("Calling Nvidia API...");
    const stream = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: "Hello" }],
      stream: true,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    console.log("\nSuccess!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
