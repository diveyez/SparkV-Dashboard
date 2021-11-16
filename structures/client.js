const { Client, Collection, Intents } = require("discord.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const util = require("util")
const fs = require("fs")
const path = require("path")

class bot extends Client {
    constructor(settings) {
        super(settings)

        // Utils
        this.logger = require("../modules/logger")
        this.functions = require("../modules/functions")
        this.wait = util.promisify(setTimeout)

        // Collections
        this.commands = new Collection();
        this.events = new Collection();
        this.cooldowns = new Collection();

        return this
    }

    async LoadModules(settings){
        this.functions.setBot(this)
    }

    async LoadEvents(MainPath){
        fs.readdir(path.join(`${MainPath}/events`), (err, files) => {
            if (err) {
              return this.logger(`EVENT LOADING ERROR - ${err}`, "error")
            }
          
            files.forEach(file => {
              let EventName = file.split(".")[0]
              let FileEvent = require(`../events/${EventName}`)
   
              this.on(EventName, (...args) => FileEvent.run(this, ...args))
            })
          })
    }

      async LoadCommands(MainPath) {
        const commandFiles = fs.readdirSync(path.join(`${MainPath}/commands`)).filter(file => file.endsWith('.js'));
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        const commands = [];

        for (const file of commandFiles) {
	        const command = require(path.resolve(`${MainPath}/commands/${file}`));

	        this.commands.set(command.data.name, command);
	        commands.push(command.data.toJSON());
        }
        
        (async () => {
	        try {
            // For global: applicationCommands(CLIENTID) (takes a while to cache | recommended for full production)
            // for only one server: applicationGuildCommands(CLIENTID, GUILDID)

            const AppCmds = Routes.applicationGuildCommands("763126208149585961", "763803059876397056")

		        await rest.put(AppCmds, {
              body: commands
            });
		        
            console.log("Successfully registered application commands.");
	        } catch (error) {
             console.error(error);
	        }
        })();
  }
}

module.exports = bot