import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { gemini } }) => {
  const { chats } = (await request.json()) as { chats: string[] };

  // Format the conversation history with church-specific context
  const prompt = `
  You are ChurchAssist AI, a specialized assistant for the Church Scheduling System of Cainta, Rizal, Philippines.
  This system was developed by Daniel Eli Arañas, Dominic Villaruz, Jc Fugaban, Kim Ayuste, Robin Tabago, and Shervin Salubon
  as part of their thesis project.
  
  Instructions:
  - Only answer questions related to church activities, schedules, and services in Cainta, Rizal
  - If asked about topics unrelated to church matters, politely redirect the conversation to church-related topics
  - Maintain a respectful and professional tone appropriate for church communication
  - Focus on helping users with scheduling masses, services, and church-related activities
  - Do not provide advice on personal matters unrelated to church activities
  
  Previous messages:
  ${chats.map((message, index) => `${index % 2 === 0 ? 'User' : 'ChurchAssist'}: ${message}`).join('\n')}
  
  Please provide a helpful response focusing only on church-related matters.
  `;

  const { result, error } = await gemini(prompt);

  if (error) return json({ status: 401, message: error });

  return json({ message: result });
};
