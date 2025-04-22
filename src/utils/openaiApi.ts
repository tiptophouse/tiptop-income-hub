
const OPENAI_API_KEY = "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";
const ASSISTANT_ID = "asst_qzFnLVnn9KCzmfdFssW1qcTj";

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
    
    // Create a thread
    const threadResponse = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v1"
      }
    });

    if (!threadResponse.ok) {
      console.error("Failed to create thread");
      return getDefaultPropertyInsights(address);
    }

    const thread = await threadResponse.json();

    // Add a message to the thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        role: "user",
        content: `Analyze the property at "${address}" for monetization opportunities.
          Provide specific details about:
          1. Rooftop Solar - Solar panel installation potential, monthly savings, and square footage
          2. Internet Bandwidth - Sharing potential, capacity that could be shared, estimated monthly earnings
          3. Parking Space - Number of spaces available, monthly rental value, and details
          4. Garden Space - Square footage, community garden potential, estimated monthly return
          
          Also calculate the total monthly passive income potential from all these combined assets.`
      })
    });

    if (!messageResponse.ok) {
      console.error("Failed to create message");
      return getDefaultPropertyInsights(address);
    }

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      console.error("Failed to create run");
      return getDefaultPropertyInsights(address);
    }

    const run = await runResponse.json();

    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    while (attempts < maxAttempts) {
      const runStatusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1"
        }
      });

      if (!runStatusResponse.ok) {
        console.error("Failed to check run status");
        break;
      }

      const runStatus = await runStatusResponse.json();
      if (runStatus.status === "completed") {
        // Get the messages
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1"
          }
        });

        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();
          const lastMessage = messages.data[0];
          
          try {
            // Extract JSON from the assistant's response
            const jsonMatch = lastMessage.content[0].text.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsedResponse = JSON.parse(jsonMatch[0]);
              return {
                address,
                ...parsedResponse
              };
            }
          } catch (error) {
            console.error("Error parsing assistant response:", error);
          }
        }
        break;
      } else if (runStatus.status === "failed") {
        console.error("Run failed:", runStatus.error);
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    return getDefaultPropertyInsights(address);
  } catch (error) {
    console.error("Error getting AI insights:", error);
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
