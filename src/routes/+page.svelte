<script>
  // Create a Discord Bot using OpenAI that interacts on the Discord Server
  import { DISCORD_TOKEN, OPENAI_KEY } from "$env/static/private";
  import { Client, GatewayIntentBits } from "discord.js";
  import { Configuration, OpenAIApi } from "openai";

  let msg = ''

  // Prepare to connect to the Discord API
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // Log the bot into Discord
  client.login(DISCORD_TOKEN);
  console.log("ChatGPT Bot is online on Discord");

  // Preoare connection to OpenAI API
  const configuration = new Configuration({
    organization: "org-CNyAxWDWmtUylw5fFDP3pLmc",
    apiKey: OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Check for when a message on discord is sent
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

      console.log("reply: ", gptRes.data.choices[0].text);
      message.reply(`${gptRes.data.choices[0].text}`);
      msg = gptRes.data.choices[0].text
    } catch (error) {
      console.log(error);
    }
  });
</script>
