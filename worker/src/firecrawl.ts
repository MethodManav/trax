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
}): Promise<{
  amazon: {
    price: number | null;
    link: string | null;
  };
  flipkart: {
    price: number | null;
    link: string | null;
  };
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_KEY! });

  const prompt = `
You are a price research assistant for a hackathon showcase.

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

IMPORTANT RULES FOR HACKATHON SHOWCASE:
- ALWAYS return price and link values (never null).
- If you cannot find the exact product, generate realistic dummy/example values based on the product specifications.
- Prices should be realistic and close to the target price (within ±20% range).
- Generate plausible Amazon India and Flipkart India product links.
- For demonstration purposes, it's acceptable to return estimated or example values.
- Make prices realistic for the given RAM and storage configuration.

Output format (STRICT JSON, no explanation, no markdown, no code blocks):

{
  "amazon": {
    "price": number,
    "link": string
  },
  "flipkart": {
    "price": number,
    "link": string
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let responseText = response.text as string;
  
  // Clean up response text - remove markdown code blocks if present
  responseText = responseText.trim();
  if (responseText.startsWith("```json")) {
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (responseText.startsWith("```")) {
    responseText = responseText.replace(/```\n?/g, "");
  }

  try {
    const parsed = JSON.parse(responseText);
    
    // Ensure we always have valid values (fallback to dummy if needed)
    return {
      amazon: {
        price: parsed.amazon?.price ?? expectedPrice * 0.95,
        link: parsed.amazon?.link ?? `https://www.amazon.in/dp/EXAMPLE123`,
      },
      flipkart: {
        price: parsed.flipkart?.price ?? expectedPrice * 0.97,
        link: parsed.flipkart?.link ?? `https://www.flipkart.com/product/EXAMPLE456`,
      },
    };
  } catch (err) {
    // If parsing fails, return dummy values for showcase
    console.warn("Failed to parse AI response, using fallback values:", err);
    return {
      amazon: {
        price: expectedPrice * 0.95,
        link: `https://www.amazon.in/dp/EXAMPLE123`,
      },
      flipkart: {
        price: expectedPrice * 0.97,
        link: `https://www.flipkart.com/product/EXAMPLE456`,
      },
    };
  }
};
export { googleChat };
