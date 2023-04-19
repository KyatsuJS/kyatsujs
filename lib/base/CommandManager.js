"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("./index");
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
        if (!client || !(client instanceof index_1.KyaClient))
            throw new Error('Invalid client provided.');
        this.client = client;
        this.CoolDowns = new index_1.CoolDownManager(this.client);
        this.Interfering = new index_1.InterferingManager(this.client);
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
        if (typeof data !== 'string' && typeof data !== 'object') {
            throw new Error('Invalid command data provided. It must be a string or an object.');
        }
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
        const desc = data.options?.description;
        if (!desc) {
            data.options.description = 'No description provided.';
        }
        return new index_1.Command(this.client, data.options.name, data.options, data.metaData, data.additional);
    }
    /**
     * Add a command to the KyaClient (the bot) using the name, options or the command itself.
     * If no command is passed, the function creates one based on the data passed.
     * @param data The options passed (name, command options, command instance).
     * @param callback? The callback function if the data passed are not a command instance. If nothing passed, use default.
     * @returns The command manager instance (this).
     */
    add(data, callback) {
        if (data instanceof index_1.Command) {
            this._commands.set(data.options.name, data);
            return this;
        }
        const command = this.create(data);
        if (callback) {
            if (typeof callback !== 'function')
                throw new Error('Invalid callback provided. It must be a function.');
            command.setRun = callback;
        }
        this._commands.set(command.options.name, command);
        return this;
    }
    /**
     * Remove a command from the bot.
     * @param name The command name.
     * @returns The command manager instance (this).
     */
    remove(name) {
        if (!name || typeof name !== 'string')
            throw new Error('Invalid command name provided.');
        this._commands.delete(name);
        return this;
    }
    /**
     * Load the command of the bot (those in the cache) and send it to the API.
     * Use it only when you finished to add all the commands you want to.
     * @returns Void.
     */
    load() {
        this.client.setLoad = true;
    }
    /**
     * Get a command from the cache with the name.
     * @param name The command name.
     * @returns The found command instance, or undefined.
     */
    getCommand(name) {
        if (!name || typeof name !== 'string')
            throw new Error('Invalid command name provided.');
        return this.commands.get(name);
    }
    /**
     * Get the client commands. The client commands are the commands hosted on the API, not from the cache.
     * @returns The bot API commands list, or undefined.
     */
    get clientCommands() {
        return this.client.resolved.application?.commands.fetch();
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
