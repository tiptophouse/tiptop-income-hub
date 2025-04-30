
export async function callOpenAI(address, apiKey) {
  // System prompt for property monetization analysis
  const systemPrompt = `You are **Tiptop's Property Monetization Analyst**.  
**Respond with exactly one JSON object**, UTF-8 encoded, no comments, no extra text.  
It must strictly conform to the following JSON Schema (Draft-07):

\`\`\`json
{
  "type": "object",
  "required": ["property_address","property_size","monetization_opportunities","overall_assumptions"],
  "properties": {
    "property_address": { "type": "string" },
    "property_size": {
      "type": "object",
      "required": ["value","unit"],
      "properties": {
        "value": { "type": "number" },
        "unit": { "type": "string", "enum": ["sq_ft","acres"] }
      },
      "additionalProperties": false
    },
    "monetization_opportunities": {
      "type": "object",
      "required": ["rooftop_solar","internet_bandwidth","parking_space","garden_space"],
      "properties": {
        "rooftop_solar": {
          "type": "object",
          "required": ["usable_rooftop_sq_ft","max_kw_installed","est_monthly_savings_usd","notes"],
          "properties": {
            "usable_rooftop_sq_ft": { "type": "integer" },
            "max_kw_installed": { "type": "number" },
            "est_monthly_savings_usd": { "type": "integer" },
            "notes": { "type": "string" }
          },
          "additionalProperties": false
        },
        "internet_bandwidth": {
          "type": "object",
          "required": ["shareable_capacity_mbps","est_monthly_revenue_usd","deployment_notes"],
          "properties": {
            "shareable_capacity_mbps": { "type": "integer" },
            "est_monthly_revenue_usd": { "type": "integer" },
            "deployment_notes": { "type": "string" }
          },
          "additionalProperties": false
        },
        "parking_space": {
          "type": "object",
          "required": ["spaces_available","est_monthly_rent_usd","details"],
          "properties": {
            "spaces_available": { "type": "integer" },
            "est_monthly_rent_usd": { "type": "integer" },
            "details": { "type": "string" }
          },
          "additionalProperties": false
        },
        "garden_space": {
          "type": "object",
          "required": ["garden_sq_ft","community_garden_viable","est_monthly_revenue_usd","notes"],
          "properties": {
            "garden_sq_ft": { "type": "integer" },
            "community_garden_viable": { "type": "boolean" },
            "est_monthly_revenue_usd": { "type": "integer" },
            "notes": { "type": "string" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "overall_assumptions": {
      "type": "array",
      "maxItems": 5,
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false
}
\`\`\``;

  // User prompt with the address
  const userPrompt = `Analyze this property address for monetization opportunities: ${address}
Estimate the property size, solar potential, internet sharing capacity, parking spaces, and garden area.
Make realistic estimates based on typical properties at this address.`;

  console.log("Sending request to OpenAI API...");
        
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Using a more efficient model, adjust as needed
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API returned an error:", response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const openaiResponse = await response.json();
  
  if (!openaiResponse || !openaiResponse.choices || !openaiResponse.choices[0]) {
    console.error("Unexpected response format from OpenAI:", openaiResponse);
    throw new Error("Invalid response format from OpenAI");
  }

  const generatedContent = openaiResponse.choices[0].message.content;
  
  console.log("Generated content from OpenAI:", generatedContent.substring(0, 100) + "...");
  
  try {
    const parsedResponse = JSON.parse(generatedContent);
    console.log("Successfully parsed JSON response from OpenAI");
    return parsedResponse;
  } catch (parseError) {
    console.error("Failed to parse OpenAI response as JSON:", parseError, "Raw response:", generatedContent);
    throw new Error("Invalid JSON response from OpenAI");
  }
}
