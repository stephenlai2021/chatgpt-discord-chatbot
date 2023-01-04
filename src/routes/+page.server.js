import { DISCORD_TOKEN, OPENAI_KEY } from "$env/static/private";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

// let gptRes = null

export const load = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  
  const configuration = new Configuration({
    organization: "org-CNyAxWDWmtUylw5fFDP3pLmc",
    apiKey: OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  client.on("messageCreate", async (message) => {
    try {
      // Don't respond to yourself or other bots
      if (message.author.bot) return;

      const gptRes = await openai.createCompletion({
        model: "davinci",
        prompt: `ChatGPT is a friendly chatbot.\n\
  ChatGPT: Hello, how are you?\n\
  ${message.author.username}: ${message.content}\n\
  ChatGPT:`,
        temperature: 0.5,
        max_tokens: 300,
        stop: ["ChatGPT:", "Stephen Lai:"],
      });

      // console.log("reply: ", gptRes.data.choices[0].text);
      message.reply(gptRes.data.choices[0].text);
      return { msg: gptRes.data.choices[0].text };
    } catch (error) {
      console.log(error);
    }
  });

  client.login(DISCORD_TOKEN);
  console.log("ChatGPT Bot is online on Discord");
};
