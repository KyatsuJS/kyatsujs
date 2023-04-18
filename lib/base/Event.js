"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEventsCb = exports.Event = exports.callbackDefault = void 0;
const discord_js_1 = require("discord.js");
const KyaClient_1 = require("./KyaClient");
const tools_1 = require("../tools");
/**
 * A default callback function used when nothing is set.
 * @param args The command args.
 * @returns Void.
 */
async function callbackDefault(...args) {
    return;
}
exports.callbackDefault = callbackDefault;
/**
 * Represents an Event on Kyatsu service.
 */
class Event {
    /**
     * The KyaClient instance.
     */
    client;
    /**
     * The event name.
     */
    name;
    /**
     * The callback function.
     */
    _callback;
    /**
     * @param client The KyaClient instance.
     * @param name The event name.
     */
    constructor(client, name) {
        if (!client || !(client instanceof KyaClient_1.KyaClient))
            throw new Error('Invalid client provided.');
        if (!name || typeof name !== 'string')
            throw new Error('Invalid event name provided.');
        this.client = client;
        this.name = name;
        this._callback = callbackDefault;
    }
    /**
     * Call the callback function of an event.
     * @returns Void.
     */
    async call() {
        // @ts-ignore
        await this._callback(...args);
    }
    /**
     * Set the call back function for the event. This function is called when the event is triggered.
     * @param callback The function to set.
     */
    set setCallback(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Invalid callback provided.');
        }
        this._callback = callback;
    }
    /**
     * Returns the callback defined for the current event instance.
     * @returns The function associated with the command.
     */
    get callback() {
        return this._callback;
    }
}
exports.Event = Event;
/**
 * The collection that includes the default callback functions for basic events.
 */
exports.defaultEventsCb = new discord_js_1.Collection();
exports.defaultEventsCb.set('ready', (client) => {
    (0, tools_1.log)(`Logged in as ${client.resolved.user.tag}.`);
});
exports.defaultEventsCb.set('interactionCreate', async (client, interaction) => {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = client.Commands.getCommand(interaction.commandName);
        if (!command)
            return;
        await command.run(interaction);
    }
});
