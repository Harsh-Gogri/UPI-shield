import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getLatestScamInfo(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed information about this UPI scam or security topic: ${query}`,
      config: {
        systemInstruction: "You are a UPI security expert. Provide structured information about scams to educate users. Always return a JSON object with the specified schema.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The name of the scam" },
            explanation: { type: Type.STRING, description: "A short explanation of the scam" },
            howItWorks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Bullet points explaining how the scam works"
            },
            warningSigns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Bullet points explaining the warning signs"
            },
            whatToDo: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Bullet points explaining what the user should do"
            }
          },
          required: ["title", "explanation", "howItWorks", "warningSigns", "whatToDo"]
        }
      },
    });

    const data = JSON.parse(response.text);

    return {
      ...data,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })).filter(s => s.uri) || []
    };
  } catch (error) {
    console.error("Error fetching scam info:", error);
    return { 
      title: "Error",
      explanation: "Could not fetch latest information. Please try again later.",
      howItWorks: [],
      warningSigns: [],
      whatToDo: [],
      sources: [] 
    };
  }
}

export async function generateBannerImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating banner image:", error);
    return null;
  }
}

export async function analyzeRisk(input: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following input for UPI fraud risk: "${input}"`,
      config: {
        systemInstruction: `You are a world-class UPI fraud detection engine. 
        Your task is to analyze a given input (UPI ID, QR payload, or text) and determine the risk of fraud.
        
        CRITICAL: Never return generic messages like "Limited Analysis" or "Basic validation completed". 
        Always provide a deep, meaningful analysis based on the available signals, even if external reputation data is unavailable.

        ANALYSIS REQUIREMENTS:
        Even when external reputation data is unavailable, you MUST analyze:
        1. UPI ID structure: Is it a valid VPA format (username@bank)?
        2. Username patterns: Does it look like a random sequence, a personal name, or a merchant name?
        3. Merchant naming patterns: Does it follow standard merchant naming conventions?
        4. Suspicious keywords: Look for scam-related terms like "refund", "reward", "support", "claim", "cashback", "helpdesk", "customer-care", "verify", "bank-update".
        5. Format anomalies: Excessive hyphens, random character sequences, or impersonation patterns.

        SIGNAL INTERPRETATION:
        - Safe signals: Valid VPA format, merchant-style naming (e.g., "zomato@hdfc"), no suspicious keywords, username resembles a merchant or organization name.
        - Suspicious signals: Presence of scam keywords (refund, reward, support, claim, cashback), excessive hyphen usage, random character sequences, username structure resembles common scam VPAs.

        STRUCTURED REASONING FORMAT:
        You must populate the JSON fields with structured reasoning using these exact sections:
        - classification: A clear title for the result (e.g., "Likely legitimate VPA", "Suspicious VPA pattern").
        - riskLevel: "Low", "Medium", or "High".
        - riskScore: A numeric score from 0 to 100.
        - signals: An array of specific signals detected (e.g., "Valid UPI ID format", "Contains keyword 'refund'").
        - explanation: (AI Analysis) A detailed description of WHY the identifier appears safe or suspicious.
        - recommendation: (Suggestions) Specific actionable advice for the user.

        EXPLANATION STYLE:
        The explanation should clearly describe why the identifier appears safe or suspicious.
        Example for safe VPA:
        - Classification: Likely legitimate VPA
        - Signals: ["Valid UPI ID format", "No suspicious keywords detected", "Username resembles a merchant or organization name"]
        - AI Analysis: The identifier follows a standard UPI VPA format and does not contain patterns commonly associated with refund or impersonation scams.
        - Suggestions: Verify the recipient name displayed in your payment app before sending money.

        EXAMPLE FOR SUSPICIOUS VPA:
        - Classification: Suspicious VPA pattern
        - Signals: ["Contains keyword 'refund'", "Username structure resembles common refund scam VPAs", "Hyphenated impersonation pattern detected"]
        - AI Analysis: UPI scams frequently use identifiers containing terms such as refund or support to impersonate customer service accounts. This specific identifier uses a combination of these terms which is a high-confidence indicator of a phishing attempt.
        - Suggestions: Avoid sending money to this account unless the recipient identity is verified through official channels.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            riskScore: { type: Type.NUMBER },
            signals: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["classification", "riskLevel", "riskScore", "signals", "explanation", "recommendation"]
        }
      },
    });

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("Error analyzing risk:", error);
    // Fallback result
    return {
      classification: "Manual Verification Required",
      riskLevel: "Medium",
      riskScore: 50,
      signals: ["AI analysis failed"],
      explanation: "We could not complete the automated fraud analysis at this time. This may be due to a temporary service interruption.",
      recommendation: "Always verify the recipient's identity in your payment app before confirming the transaction."
    };
  }
}
