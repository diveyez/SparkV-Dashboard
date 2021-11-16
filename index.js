// KingCh1ll //
// Last Edited: 8/9/2021 //
// Index.js //

// Librarys //
const { Intents } = require("discord.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const DBD = require("discord-dashboard");
const DarkTheme = require("dbd-dark-dashboard");

const database = require("./database/handler");
const Logger = require("./modules/logger");

// Load //
console.log(require("chalk").blue("   ____ _     _ _ _ ____  _           "));
console.log(require("chalk").blue("  / ___| |__ / | | | __ )| | _____  __"));
console.log(require("chalk").blue(" | |   | '_ | | | |  _ | |/ _  / /"));
console.log(require("chalk").blue(" | |___| | | | | | | |_) | | (_) >  < "));
console.log(require("chalk").blue("  ____|_| |_|_|_|_|____/|_|___/_/_ "));

// Start //
async function Start() {
  dotenv.config({
    path: `${__dirname}/.env`
  });

  await mongoose.connect(
    process.env.MONGOOSEURL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  mongoose.connection.on(
    "error",
    console.error.bind(console, "Database connection error!")
  );

  process.on("uncaughtException", err => Logger(err.stack, "error"));

  process.on("unhandledRejection", err => Logger(err.stack, "error"));

  const Client = require("./structures/client");
  const bot = new Client({ intents: ["GUILDS"] });

  bot.on("ready", () => bot.user.setPresence({ status: "invisible" }));

  bot.login(process.env.token);

  const Dashboard = new DBD.Dashboard({
    bot,
    port: 80,
    client: {
      id: "884525761694933073",
      secret: process.env.clientSecret
    },
    redirectUri: "https://dashboard.sparkv.tk/discord/callback",
    domain: "https://dashboard.sparkv.tk",
    invite: {
      redirectUri: "https://dashboard.sparkv.tk/discord/callback",
      permissions: "4231916662",
      clientId: "884525761694933073",
      scopes: ["bot", "applications.commands", "guilds", "guilds.join"]
    },
    guildAfterAuthorization: {
      use: true,
      guildId: "763803059876397056"
    },
    underMaintenanceAccessKey: process.env.admin_access_token,
    underMaintenanceAccessPage: "/admin_access",
    useUnderMaintenance: false,
    underMaintenance: {
      title: "Under Maintenance",
      contentTitle: "Under Maintenance",
      texts: [
        "<br>",
        "We're working on new, better technology.",
        "<br>",
        'Join our <a href="https://discord.gg/PPtzT8Mu3h">Discord  Server</a> to get notified when maintance turns off.'
      ],
      bodyBackgroundColors: ["#ffa191", "#ffc247"],
      buildingsColor: "#ff6347",
      craneDivBorderColor: "#ff6347",
      craneArmColor: "#f88f7c",
      craneWeightColor: "#f88f7c",
      outerCraneColor: "#ff6347",
      craneLineColor: "#ff6347",
      craneCabinColor: "#f88f7c",
      craneStandColors: ["#ff6347", , "#f29b8b"]
    },
    theme: DarkTheme({
      information: {
        createdBy: "KingCh1ll & package: dbd-dark-dashboard",
        websiteTitle: "SparkV",
        websiteName: "SparkV",
        websiteUrl: "https://www.ch1ll.tk/",
        supporteMail: "support@ch1ll.dev", //Currently Unused
        imageFavicon: "https://sparkv.tk/assets/images/SparkV.png",
        iconURL: "https://sparkv.tk/assets/images/SparkV.png",
        pagestylebg:
          "linear-gradient(to right, #0c2646 0%, #e8e523 60%, #2a5788 100%)",
        main_color: "#a29f0e",
        sub_color: "#ebdbdb"
      },
      guilds: {
        cardTitle: "Guilds",
        cardDescription:
          "Here are all of the guilds you have permission to edit in."
      },
      guildInfo: {
        cardTitle: "Server Information",
        cardDescription:
          "An overview about your server and it's settings for SparkV."
      },
      errorMsg: {
        savedSettings: "Successfully saved settings!",
        noPerms: ""
      },
      popupMsg: {
        savedSettings: "Successfully saved settings!",
        noPerms: "Uh oh! Looks like we encountered a INVALID_PERMISSIONS error."
      },
      invite: {
        client_id: "884525761694933073",
        redirectUri: "https://dashboard.sparkv.tk/discord/callback",
        permissions: "4231916662",
        scopes: ["bot", "applications.commands", "guilds", "guilds.join"]
      },
      index: {
        card: {
          category: "Welcome",
          title: `Welcome to SparkV's Dashboard!`,
          image: "https://i.imgur.com/axnP93g.png",
          footer: "SparkV"
        },
        information: {
          category: "Category",
          title: "Information",
          description:
            "Need support? <a href='https://discord.gg/PPtzT8Mu3h'>Click here</a> to join our Discord server.",
          footer: "Footer"
        },
        feeds: {
          category: "Category",
          title: "Information",
          description: `Welcome to SparkV's dashboard!`,
          footer: "Footer"
        }
      },
      guilds: {
        cardTitle: "Guilds",
        cardDescription:
          "Here are all the guilds you have permission from to edit SparkV."
      },
      guildSettings: {
        cardTitle: "Guilds",
        cardDescription: "Here you can manage all the settings for your guild:"
      },
      privacyPolicy: {
        pp: `<p>Custom Privacy Policy</p>`
      },
      commands: {
        categoryOne: {
          category: "Fun",
          subTitle: "All of SparkV's fun commands.",
          list: [
            {
              commandName: "Stats",
              commandUsage: "^stats",
              commandDescription: "Provides statistics about SparkV.",
              commandAlias: "ping"
            }
          ]
        }
      }
    }),
    settings: [
      {
        categoryId: "Bot",
        categoryName: "Bot Settings",
        categoryDescription: "Bot settings for SparkV.",
        categoryOptionsList: [
          {
            optionId: "prefix",
            optionName: "Prefix",
            optionDescription: "The prefix used to trigger SparkV.",
            optionType: DBD.formTypes.input("Prefix", 1, 5, false, true),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.prefix;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.prefix = newData;
              data.markModified("prefix");

              await data.save();
            }
          },
          {
            optionId: "language",
            optionName: "Language",
            optionDescription: "The language SparkV will speak.",
            optionType: DBD.formTypes.select(
              {
                "🇺🇸 English": "en",
                "🇪🇸 Spanish": "es",
                "🇫🇷 French": "fr",
                "🇩🇪 German": "de",
                "🇮🇳 Hindi": "hi",
                "🇦🇪 Arabic": "ar",
                "🇧🇩 Bengali": "bn",
                "🇷🇺 Russian": "ru",
                "🇵🇹 Portuguese": "pt",
                "🇮🇩 Indonesian": "id"
              },
              false
            ),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.language;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.language = newData;
              data.markModified("language");

              await data.save();
            }
          },
          {
            optionId: "chatbot",
            optionName: "ChatBot",
            optionDescription: "Change the timezone of SparkV in your server.",
            optionType: DBD.formTypes.select(
              {
                Mention: "mention",
                Message: "message",
                Off: false
              },
              false
            ),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.chatbot;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.chatbot = newData;
              data.markModified("plugins.chatbot");

              await data.save();
            }
          }
        ]
      },
      {
        categoryId: "autoModSettings",
        categoryName: "Auto Mod Settings",
        categoryDescription:
          "Start moderating your server with one of Discord's most POWERFUL bot automod filters.",
        categoryOptionsList: [
          {
            optionId: "removeLinks",
            optionName: "Delete Links",
            optionDescription:
              "When enabled, SparkV will remove all links sent UNLESS that user has the MANAGE_MESSAGES permission.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.automod.removeLinks;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.automod.removeLinks = Boolean(newData);
              data.markModified("plugins.automod.removeLinks");

              await data.save();
            }
          },
          {
            optionId: "removeProfanity",
            optionName: "Delete Text Profanity",
            optionDescription:
              "When enabled, SparkV will remove bad words sent UNLESS that user has the MANAGE_MESSAGES permission.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.automod.removeProfanity;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.automod.removeProfanity = Boolean(newData);
              data.markModified("plugins.automod.removeProfanity");

              await data.save();
            }
          },
          {
            optionId: "removeDuplicateText",
            optionName: "Delete Duplicated Text (Spam)",
            optionDescription:
              "When enabled, SparkV will remove remove duplicated text (Spam) UNLESS that user has the MANAGE_MESSAGES permission.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.automod.removeDuplicateText;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.automod.removeDuplicateText = Boolean(newData);
              data.markModified("plugins.automod.removeDuplicateText");

              await data.save();
            }
          }
        ]
      },
      {
        categoryId: "leveling",
        categoryName: "Leveling Settings",
        categoryDescription: "DESC",
        categoryOptionsList: [
          {
            optionId: "levelingEnabled",
            optionName: "Leveling Enabled",
            optionDescription:
              "When enabled, SparkV give users that talk a random amount of XP. Specified in the fields bellow.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.leveling.enabled;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.leveling.enabled = Boolean(newData);
              data.markModified("plugins.leveling.enabled");

              await data.save();
            }
          },
          {
            optionId: "levelingMax",
            optionName: "Leveling Max",
            optionDescription: "Maximum",
            optionType: DBD.formTypes.input("25", 1, 5, false, true),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.leveling.max;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.leveling.max = newData;
              data.markModified("plugins.leveling.max");

              await data.save();
            }
          },
          {
            optionId: "levelingMin",
            optionName: "Leveling Min",
            optionDescription: "Minimum",
            optionType: DBD.formTypes.input("5", 1, 5, false, true),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.leveling.min;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.leveling.min = newData;
              data.markModified("plugins.leveling.min");

              await data.save();
            }
          }
        ]
      },
      {
        categoryId: "Welcome",
        categoryName: "Welcome Settings",
        categoryDescription:
          "Give new users a hello, and leaving users a goodbye.",
        categoryOptionsList: [
          {
            optionId: "welcomeEnabled",
            optionName: "Welcome Enabled",
            optionDescription:
              "When enabled, SparkV will send the message below in the channel in the fields below to new users.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.welcome.enabled;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.welcome.enabled = Boolean(newData);
              data.markModified("plugins.welcome.enabled");

              await data.save();
            }
          },
          {
            optionId: "welcomeMessage",
            optionName: "Welcome Message",
            optionDescription:
              "The message that will send.\n\nVariables: {mention}, {member}, {tag}, {username}, {server}, {members}",
            optionType: DBD.formTypes.textarea(
              "Welcome {mention} to **{server}**! You're our **{members}th member**.",
              1,
              2000,
              false,
              true
            ),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.welcome.message;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.welcome.message = newData;
              data.markModified("plugins.welcome.message");

              await data.save();
            }
          },
          {
            optionId: "welcomeChannelSelect",
            optionName: "Welcome Message Channel",
            optionDescription: "The channel for the hello messages to send.",
            optionType: DBD.formTypes.channelsSelect(false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.welcome.channel || null;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.welcome.channel = newData;
              data.markModified("plugins.welcome.channel");

              await data.save();
            }
          }
        ]
      },
      {
        categoryId: "Goodbye",
        categoryName: "Goodbye Settings",
        categoryDescription: "Give leaving users a goodbye.",
        categoryOptionsList: [
          {
            optionId: "GoodbyeEnabled",
            optionName: "Goodbye Enabled",
            optionDescription:
              "When enabled, SparkV will send the message below in the channel in the fields below to leaving members.",
            optionType: DBD.formTypes.switch(false, false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.goodbye.enabled;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.goodbye.enabled = Boolean(newData);
              data.markModified("plugins.goodbye.enabled");

              await data.save();
            }
          },
          {
            optionId: "GoodbyeMessage",
            optionName: "Goodbye Message",
            optionDescription:
              "The message that will send when a user leaves.\n\nVariables: {mention}, {member}, {tag}, {username}, {server}, {members}",
            optionType: DBD.formTypes.textarea(
              "Bye {mention}. We\"re really sad to see you go. Without you, we're now {members} members.",
              1,
              2000,
              false,
              true
            ),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.goodbye.message;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.goodbye.message = newData;
              data.markModified("plugins.goodbye.message");

              await data.save();
            }
          },
          {
            optionId: "GoodbyeChannelSelect",
            optionName: "Goodbye Message Channel",
            optionDescription: "The channel for the hello messages to send.",
            optionType: DBD.formTypes.channelsSelect(false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.goodbye.channel || null;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              data.plugins.goodbye.channel = newData;
              data.markModified("plugins.goodbye.channel");

              await data.save();
            }
          }
        ]
      }
      /*
      {
        categoryId: "other",
        categoryName: "Other",
        categoryDescription: "Other settings. Includes welcome/goodbye settings",
        categoryOptionsList: [
          {
            optionId: "channelSelect",
            optionName: "channelSelect",
            optionDescription: "channelSelect test",
            optionType: DBD.formTypes.channelsSelect(false),
            getActualSet: async ({ guild }) => {
              const data = await database.getGuild(guild.id);

              return data.plugins.welcome.channel || null;
            },
            setNew: async ({ guild, newData }) => {
              const data = await database.getGuild(guild.id);

              
              data.prefix = newData;
              data.markModified("prefix");

              await data.save();
            },
          },
          
        ],
      },
*/
    ]
  });

  Dashboard.init();
}

Start().catch(err => console.error(err));
