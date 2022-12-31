if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8090;
const {
  Client,
  // LocalAuth
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

// client.on('message', message => {
// 	if(/iloveyou/.test(message.body)) {
// 		client.sendMessage(message.from, 'iloveyouutoo❤❤');
// 	}
// });

client.on("disconnected", (reason) => {
  console.log("disconnect whatsapp", reason);
  client.initialize().catch(console.log);
});

client.initialize().catch(console.log);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));

const morning = (message) => {
  //  * * * * * => 1 minute
  // 0 10 * * * => every 10 am/pagi
  cron.schedule("* 1 * * *", async () => {
    try {
      // const day = new Date().getDay();
      client.sendMessage("6282247044713@c.us", message);
      console.log("Morning", new Date().toLocaleString());
    } catch (e) {
      console.log(e);
    }
  });
};

// const night = (message) => {
//   //  * * * * * => 1 minute
//   // 0 10 * * * => every 10 am/pagi
//   cron.schedule("58 23 * * *", async () => {
//     try {
//       // const day = new Date().getDay();
//       client.sendMessage("6282144345988@c.us", message);
//       console.log("night");
//     } catch (e) {
//       console.log(e);
//     }
//   });
// };

const textMorning =
  "Selamat Pagi kikiii💕❤😘 have a good day. Selamat menjalani hariii🔥";
morning(textMorning);

// const textNight =
//   "Good Night bebs💕😘\nSelamat Bobooooo. Iloveyouuu muahh😘😘😘";
// night(textNight);

// HBD("HBD KIKI dan kawan2 yang HBD hari ini");
