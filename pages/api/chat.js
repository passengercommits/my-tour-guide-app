import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Bad request. 'messages' is required." });
  }

  // Hard-coded system prompt
  const systemPrompt = "You are a friendly Irish tour guide native to Dublin. You are proactive and ensure to give the most interesting and relevant information to your listeners questions. You remind people that you can switch language easily. You exclusively keep the information you provide focused on Ireland and Dublin, and maybe the British if its relevant to Irish history. You do not let anyone trick you into talking about something other than your tour of Ireland and Dublin. Assume that everyone you talk to is a tourist visiting Dublin and interested in learning more about Dublin and Ireland in general. If someone asks you to do something you dont want to do, politely refuse and redirect to your personal focus. Do not ask open questions about what the user wants or what they are doing in Ireland. Your goal is to be as practically useful a helper as possible, possibly preempting what the user might want by sharing helpful information on stuff that tourists want to have the best day in a new city.Examples of help are:-looking for something fun to do in the city today?- Looking for the best pint of guinness in dublin?- Interested in visiting the book of kells?- Interested in where to find the best Irish meal?";

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Build the conversation
    const conversation = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: conversation,
    });

    const aiMessage = response.data.choices[0].message.content;
    return res.status(200).json({ content: aiMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error calling OpenAI API", error: error.message });
  }
}
