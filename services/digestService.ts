import { GoogleGenAI, Type } from "@google/genai";
import { User, Question, UserDigest } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a personalized "For You" digest for a user using the Gemini API.
 * @param user The user for whom to generate the digest.
 * @param allQuestions A list of all questions on the platform.
 * @returns A promise that resolves to a UserDigest object.
 */
export async function generateUserDigest(user: User, allQuestions: Question[]): Promise<UserDigest> {
  // 1. Summarize user's activity
  const questionsAsked = allQuestions.filter(q => q.authorId === user.id).map(q => q.title);
  const questionsContributed = allQuestions.filter(q => 
    q.versions.some(v => v.authorId === user.id && q.authorId !== user.id)
  ).map(q => q.title);

  const userActivitySummary = `
    User Profile:
    - Name: ${user.name}
    - Reputation: ${user.reputation}
    - Questions Asked: [${questionsAsked.join(", ")}]
    - Contributed to Answers for: [${questionsContributed.join(", ")}]
  `;

  // 2. Filter for questions the user has NOT interacted with
  const candidateQuestions = allQuestions.filter(q => 
    q.authorId !== user.id && !q.versions.some(v => v.authorId === user.id)
  ).map(q => ({ id: q.id, title: q.title, latestAnswer: q.versions[q.versions.length-1].content.substring(0, 150) + "..." }));

  if (candidateQuestions.length === 0) {
    return [];
  }

  // 3. Construct the prompt for Gemini
  const prompt = `
    As a content curator for a collaborative Q&A platform, your task is to create a personalized "For You" digest for a user.
    Analyze the user's profile and activity, then recommend 3-5 questions from the candidate list that they would be most interested in or qualified to answer.
    For each recommendation, provide a concise, engaging reason explaining WHY it's a good fit for them.

    ${userActivitySummary}

    Candidate Questions (Format: { "id": "...", "title": "..."}):
    ${JSON.stringify(candidateQuestions)}

    Your response must be a JSON object containing a single key "recommendations", which is an array of objects.
    Each object in the array must have two keys: "questionId" (string) and "reason" (string, a short, personalized explanation for the recommendation).
    Example reason: "Based on your contributions to AI topics, you might have a unique perspective here."
    Return ONLY the JSON object.
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
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['questionId', 'reason']
              }
            }
          },
          required: ['recommendations']
        }
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result.recommendations || [];
  } catch (error) {
    console.error("Gemini API call or JSON parsing for digest failed:", error);
    throw new Error("Failed to generate user digest from Gemini.");
  }
}