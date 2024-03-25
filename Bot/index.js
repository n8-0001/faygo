const { Client, IntentsBitField } = require("discord.js");
require("dotenv/config");

// gets intents and client
const client = new client({
  intents: [
    IntentsBitField.Flags.GUILDS,
    IntentsBitField.Flags.GUILD_MESSAGES,
    IntentsBitField.Flags.GUILD_VOICE_STATES,
    IntentsBitField.Flags.GUILD_MEMBERS,
    IntentsBitField.Flags.GUILD_BANS,
    IntentsBitField.Flags.GUILD_EMOJIS_AND_STICKERS,
    IntentsBitField.Flags.GUILD_WEBHOOKS,
    IntentsBitField.Flags.GUILD_INVITES,
    IntentsBitField.Flags.GUILD_VOICE_STATES,
    IntentsBitField.Flags.GUILD_PRESENCES,
    IntentsBitField.Flags.GUILD_MESSAGES,
    IntentsBitField.Flags.GUILD_MESSAGE_REACTIONS,
    IntentsBitField.Flags.GUILD_MESSAGE_TYPING,
    IntentsBitField.Flags.DIRECT_MESSAGES,
    IntentsBitField.Flags.DIRECT_MESSAGE_REACTIONS,
  ],
});

//console log bot online + get commands
client.on("ready", () => {
  log.bot("Discord.js Bot is online");
  let commands = client.application.commands;
  FileSystem.readdirSync("./Bot/commands/").forEach((fileName) => {
    const command = require(`./commands/${fileName}`);
    commands.create(command.commandInfo);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (fs.existsSync(`./Bot/commands/${interaction.commandName}.js`)) {
    require(`./Bot/commands/${interaction.commandName}.js`).execute(
      interaction
    );
  }
});

// login
client.login(process.env.TOKEN);
