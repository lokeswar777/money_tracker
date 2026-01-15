
import { GoogleGenAI } from "@google/genai";
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

export const generateEmailReport = async (expenses: Expense[], type: 'Daily' | 'Weekly' | 'Monthly', userName: string) => {
  const periodLabel = type === 'Daily' ? 'Today' : type === 'Weekly' ? 'this Week' : 'this Month';
  
  const summary = expenses.map(e => `${e.date}: $${e.amount} on ${e.category} (${e.description || 'No desc'})`).join('\n');

  const prompt = `
    You are a professional personal finance assistant. 
    Write a high-quality email report for ${userName} summarizing their spending for ${periodLabel}.
    
    The email should have:
    1. A catchy, professional subject line.
    2. A friendly greeting.
    3. A clear summary of total spending.
    4. A breakdown of the top 3 categories.
    5. One actionable tip based on the spending patterns.
    6. A professional sign-off.

    Data:
    ${summary || 'No expenses recorded for this period.'}

    Format as a clean email body. Use Markdown for bolding and lists.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "Failed to generate report content.";
  } catch (error) {
    console.error("Gemini Email Error:", error);
    return "Error generating email draft.";
  }
};
