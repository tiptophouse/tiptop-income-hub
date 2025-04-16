
import { toast } from "@/components/ui/use-toast";

// Using the provided OpenAI API key
const OPENAI_API_KEY = "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";

/**
 * Get property insights from GPT based on address
 */
export const getPropertyInsights = async (address: string): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides insights about properties and neighborhoods."
          },
          {
            role: "user", 
            content: `Provide a brief market analysis and investment potential for a property at ${address}. Include information about the neighborhood, potential rental income, and any emerging market trends. Format your response with clear sections and bullet points where appropriate.`
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching property insights:", error);
    toast({
      title: "Error",
      description: "Failed to fetch property insights. Please try again later.",
      variant: "destructive",
    });
    return "Unable to fetch property insights at this time.";
  }
};
