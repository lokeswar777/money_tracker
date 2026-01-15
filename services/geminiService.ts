
import { GoogleGenAI, Type } from "@google/genai";
import { Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (expenses: Expense[]) => {
  if (expenses.length === 0) return "Add some expenses to get AI-powered insights!";

  const summary = expenses.map(e => ({
    amount: e.amount,
    category: e.category,
    date: e.date,
    desc: e.description
  }));

  const prompt = `
    Analyze these personal expenses and provide a concise 3-paragraph financial advice report.
    Focus on:
    1. Where the most money is going.
    2. Potential saving opportunities.
    3. A realistic goal for the next month.
    
    Data: ${JSON.stringify(summary)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "I couldn't generate insights at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating insights. Please check your connection and try again.";
  }
};
