if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8090;
const {
  Client,
  LocalAuth
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const cron = require("node-cron");

const client = new Client({
  authStrategy: new LocalAuth(),
});

//production in heroku kita tes apakah bisa ?
// const client = new Client({
//   puppeteer: {
//     // executablePath: "/usr/bin/chromium",
//     args: ["--no-sandbox"],
//   },
// });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log(client.info);
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    if (message.body[0] === "!") {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message.body.substring(1),
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });
      message.reply(response.data.choices[0].text.substring(2));
    }
  } catch (error) {
    console.log(error);
  }
});

client.on("disconnected", (reason) => {
  console.log("disconnect whatsapp", reason);
  client.initialize().catch(console.log);
});

client.initialize().catch(console.log);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
