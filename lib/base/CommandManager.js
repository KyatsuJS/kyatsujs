"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("./Command");
const CoolDownManager_1 = require("./CoolDownManager");
const InterferingManager_1 = require("./InterferingManager");
/**
 * Represents the command manager of Kyatsu.
 */
class CommandManager {
    /**
     * The client instance.
     */
    client;
    /**
     * The cool down manager instance, to have access to the different delays of the current commands.
     */
    CoolDowns;
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    Interfering;
    /**
     * The collection of the commands.
     */
    _commands;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client) {
        if (!client)
            throw new Error('Invalid client provided.');
        this.client = client;
        this.CoolDowns = new CoolDownManager_1.CoolDownManager(this.client);
        this.Interfering = new InterferingManager_1.InterferingManager(this.client);
        this._commands = new discord_js_1.Collection();
    }
    /**
     * Create a command based on the name and/or some options, and returns it.
     * @param data The name and/or the options.
     * @returns The command instance.
     */
    create(data) {
        if (!data)
            throw new Error('Invalid command data provided.');
        if (typeof data === 'string') {
            data = {
                options: {
                    name: data,
                    description: 'No description provided.',
                },
            };
        }
        else if (typeof data !== 'object') {
            throw new Error('Invalid command data provided. It must be a string or an object.');
        }
        if (!data.options.type)
            data.options.type = 1;
        if (!data.options.name) {
            throw new Error('Invalid command name provided.');
        }
        // @ts-ignore
        const desc = data.options?.description;
        if (!desc) {
            throw new Error('Invalid command description provided.');
        }
        return new Command_1.Command(this.client, data.options.name, data.options, data.metaData, data.additional);
    }
    /**
     * Add a command to the KyaClient (the bot) using the name, options or the command itself.
     * If no command is passed, the function creates one based on the data passed.
     * @param data The options passed (name, command options, command instance).
     * @param callback? The callback function if the data passed are not a command instance. If nothing passed, use default.
     * @returns The command manager instance (this).
     */
    add(data, callback) {
        if (data instanceof Command_1.Command) {
            this._commands.set(data.options.name, data);
            return this;
        }
        const command = this.create(data);
        if (callback)
            command.setRun = callback;
        this._commands.set(command.options.name, command);
        return this;
    }
    /**
     * Remove a command from the bot.
     * @param name The command name.
     * @returns The command manager instance (this).
     */
    remove(name) {
        if (!name) {
            throw new Error('Invalid command name provided.');
        }
        this._commands.delete(name);
        return this;
    }
    /**
     * Load the command of the bot (those in the cache) and send it to the API.
     * Use it only when you finished to add all the commands you want to.
     * @returns Void.
     */
    load() {
        this.client._load = true;
    }
    /**
     * Get a command from the cache with the name.
     * @param name The command name.
     * @returns The found command instance, or undefined.
     */
    getCommand(name) {
        if (!name) {
            throw new Error('Invalid command name provided.');
        }
        return this.commands.get(name);
    }
    /**
     * Get the client commands. The client commands are the commands hosted on the API, not from the cache.
     * @returns The bot API commands list, or undefined.
     */
    get clientCommands() {
        return this.client.application?.commands.fetch();
    }
    /**
     * Return the list of cache commands.
     * @returns The list of cache commands.
     */
    get commands() {
        return this._commands;
    }
}
exports.CommandManager = CommandManager;
