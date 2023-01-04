<script>
  // Create a Discord Bot using OpenAI that interacts on the Discord Server
  // import { DISCORD_TOKEN, OPENAI_KEY } from "$env/static/private";
  import { Client, GatewayIntentBits } from "discord.js";
  import { Configuration, OpenAIApi } from "openai";
  import { onMount } from "svelte";

  let msg = "";

  onMount(() => {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    client.login(import.meta.env.VITE_DISCORD_TOKEN);
    console.log("ChatGPT Bot is online on Discord");

    const configuration = new Configuration({
      organization: "org-CNyAxWDWmtUylw5fFDP3pLmc",
      apiKey: import.meta.env.VITE_OPENAI_KEY,
    });
    const openai = new OpenAIApi(configuration);

    client.on("messageCreate", async (message) => {
      try {
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
        msg = gptRes.data.choices[0].text;
      } catch (error) {
        console.log(error);
      }
    });
  });
</script>

<p>ChatGPT Discord Chatbot:</p>
<p>{msg}</p>
