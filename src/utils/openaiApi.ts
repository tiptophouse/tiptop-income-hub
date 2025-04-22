
const OPENAI_API_KEY = "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";

interface PropertyInsight {
  address: string;
  rooftopSolar: {
    potential: string;
    monthlySavings: string;
    sqFootage: string;
  };
  internetBandwidth: {
    potential: string;
    sharingCapacity: string;
    monthlyEarnings: string;
  };
  parkingSpace: {
    available: string;
    monthlyValue: string;
    details: string;
  };
  gardenSpace: {
    sqFootage: string;
    communityValue: string;
    monthlyPotential: string;
  };
  totalMonthlyPotential: string;
}

export const getPropertyInsightsFromAI = async (address: string): Promise<PropertyInsight> => {
  try {
    console.log("Fetching AI insights for address:", address);
    
    const prompt = `
      Analyze the property at "${address}" for monetization opportunities.
      Provide specific details about these assets:
      1. Rooftop Solar - Solar panel installation potential, monthly savings, and square footage
      2. Internet Bandwidth - Sharing potential, capacity that could be shared, estimated monthly earnings
      3. Parking Space - Number of spaces available, monthly rental value, and details
      4. Garden Space - Square footage, community garden potential, estimated monthly return
      
      Also calculate the total monthly passive income potential from all these combined assets.
      Format your response as a structured JSON object without any explanatory text.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using a capable model
        messages: [
          { 
            role: "system", 
            content: "You are a property analyzer specializing in identifying monetization opportunities. Return data in structured JSON format only."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more factual responses
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("OpenAI API error:", errorResponse);
      
      // Return fallback data when API fails
      return getDefaultPropertyInsights(address);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    return {
      address,
      ...aiResponse
    };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    
    // Return fallback data when an error occurs
    return getDefaultPropertyInsights(address);
  }
};

// Provides default values when the API call fails
const getDefaultPropertyInsights = (address: string): PropertyInsight => {
  return {
    address,
    rooftopSolar: {
      potential: "High",
      monthlySavings: "$100-150",
      sqFootage: "600 sq ft"
    },
    internetBandwidth: {
      potential: "Medium",
      sharingCapacity: "60-70%",
      monthlyEarnings: "$80-120"
    },
    parkingSpace: {
      available: "1-2 spaces",
      monthlyValue: "$70-200",
      details: "Available for hourly/daily rental"
    },
    gardenSpace: {
      sqFootage: "150 sq ft",
      communityValue: "Medium-High",
      monthlyPotential: "$50-100"
    },
    totalMonthlyPotential: "$300-570"
  };
};
