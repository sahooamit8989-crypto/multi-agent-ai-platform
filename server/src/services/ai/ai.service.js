import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Get behavior instructions based on agent type
const getAgentTypeInstruction = (agentType) => {
  const instructions = {
    coding:
      "You are a coding specialist. Focus on programming, debugging, code quality, software architecture, APIs, databases, and technical explanations. Provide practical and accurate code examples when useful.",

    research:
      "You are a research specialist. Analyze information carefully, explain concepts clearly, compare relevant information, and distinguish facts from assumptions.",

    writing:
      "You are a writing specialist. Focus on clear, professional, well-structured writing. Adapt the tone and format to the user's request.",

    data:
      "You are a data specialist. Focus on data analysis, SQL, Python, statistics, data interpretation, and explaining insights from data.",

    general:
      "You are a general-purpose AI assistant. Help the user clearly and accurately with their request."
  };

  return instructions[agentType] || instructions.general;
};

const generateWithModel = async ({
  ai,
  model,
  systemPrompt,
  userMessage,
  agentType
}) => {
  const typeInstruction = getAgentTypeInstruction(agentType);

  const finalSystemPrompt = `
${typeInstruction}

Additional Agent Instructions:
${systemPrompt}
`;

  const response = await ai.models.generateContent({
    model,
    contents: userMessage,
    config: {
      systemInstruction: finalSystemPrompt
    }
  });

  return response;
};

export const generateAIResponse = async ({
  systemPrompt,
  userMessage,
  agentType
}) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const models = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash"
    ];

    for (const model of models) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await generateWithModel({
          ai,
          model,
          systemPrompt,
          userMessage,
          agentType
        });

        return {
          success: true,
          response: response.text,
          provider: "gemini",
          model,
          agentType
        };

      } catch (error) {
        console.error(
          `${model} failed:`,
          error.status,
          error.message
        );

        if (error.status === 503) {
          console.log("Trying next model...");
          await sleep(1000);
          continue;
        }

        throw error;
      }
    }

    throw new Error("All Gemini models are currently unavailable");

  } catch (error) {
    console.error("AI Service Error:", error);

    throw new Error("AI response generation failed");
  }
};