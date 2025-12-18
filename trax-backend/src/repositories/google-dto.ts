import { GoogleGenAI } from "@google/genai";

const googleChat = async ({
  brandName,
  modelName,
  ram,
  rom,
  expectedPrice,
}: {
  brandName: string;
  modelName: string;
  ram: number;
  rom: number;
  expectedPrice: number;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_KEY! });

  const prompt = `
You are a price research assistant.

Task:
Find the current online price of the following product on:
1. Amazon India
2. Flipkart India

Product details:
- Brand: ${brandName}
- Model: ${modelName}
- RAM: ${ram} GB
- Storage: ${rom} GB
- Target Price: ₹${expectedPrice}

Rules:
- Search for the closest exact variant (same RAM & storage).
- Prefer Indian listings (amazon.in, flipkart.com).
- If multiple prices exist, return the lowest one.
- If price is not confidently known, return null.

Output format (STRICT JSON, no explanation, no markdown):

{
  "amazon": {
    "price": number | null,
    "link": string | null
  },
  "flipkart": {
    "price": number | null,
    "link": string | null
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log("Google GenAI response:", response.text);
  return response.text;
};
export { googleChat };
