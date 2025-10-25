import { GoogleGenAI, Type } from "@google/genai";
import { AiSummary, AnswerVersion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Summarizes the semantic difference between two texts using the Gemini API,
 * classifying the type of change and returning a structured response.
 * @param previousText The original version of the text.
 * @param currentText The updated version of the text.
 * @returns A promise that resolves to an AiSummary object.
 */
export async function summarizeChange(previousText: string, currentText: string): Promise<AiSummary> {
  const prompt = `
    You are an expert text analyst. Your task is to analyze the semantic evolution between two versions of an answer on a Q&A platform.

    **Previous Version:**
    """
    ${previousText}
    """

    **New Version:**
    """
    ${currentText}
    """

    Based on the changes, you must perform two tasks:
    1.  **Classify the Change Type:** Choose the single best category that describes the nature of the edit from the list below.
        *   **Expansion:** The new version adds significant new information, examples, or details that build upon the original point.
        *   **Clarification:** The new version rephrases or restructures existing points to make them clearer, more precise, or easier to understand without adding substantial new information.
        *   **Refutation:** The new version introduces a counter-argument, challenges, or directly disagrees with a point made in the previous version.
        *   **Correction:** The new version fixes factual errors, typos, or grammatical mistakes from the previous version.
        *   **Addition:** The new version adds a new, distinct point or perspective that is related but doesn't directly expand on the previous version's core argument.
        *   **Foundation:** This is the initial version of the answer. (Use this only if the 'Previous Version' is empty or placeholder text).

    2.  **Summarize the Meaning Drift:** Write a concise, one-sentence summary explaining the core evolution in meaning. What is the most important semantic shift?

    You MUST return your analysis as a single, valid JSON object, and nothing else. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: 'The category of the change, e.g., "Expansion", "Clarification", "Refutation".'
            },
            text: {
              type: Type.STRING,
              description: 'The one-sentence summary of the semantic shift.'
            }
          },
          required: ['type', 'text']
        }
      }
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API call or JSON parsing failed:", error);
    throw new Error("Failed to generate AI summary from Gemini.");
  }
}

/**
 * Synthesizes a final, authoritative answer from a series of evolving versions.
 * @param versions An array of all answer versions for a question.
 * @returns A promise that resolves to a single, synthesized string.
 */
export async function synthesizeFinalAnswer(versions: AnswerVersion[]): Promise<string> {
  if (!versions || versions.length === 0) {
    return "This question has not yet been answered.";
  }

  const joinedAnswers = versions
    .map((v, i) => `--- Contribution ${i + 1} (by author ${v.authorId}) ---\n${v.content}`)
    .join("\n\n");

  const prompt = `
You are an expert editor tasked with synthesizing multiple community-contributed answers into a single, comprehensive, and well-structured "final answer".

**Your Task:**
Merge the most valuable points from each contribution below into a definitive final answer.

**Guidelines:**
- Identify the core concepts and combine them logically.
- Eliminate repetition and reconcile conflicting points where possible.
- Maintain a neutral, professional, and authoritative tone.
- Ensure the final answer is clear, factual, and easy to read.
- **Crucially, do not mention the AI, the synthesis process, or the individual contributions/authors.** The output should read as a standalone, expert-written answer.
- Aim for a length of 2-4 concise paragraphs.

**Contributions to Synthesize:**
${joinedAnswers}

**Final Answer:**
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for better synthesis
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini synthesis error:", error);
    return "There was an error while synthesizing the final answer. The community's contributions are available in the timeline.";
  }
}