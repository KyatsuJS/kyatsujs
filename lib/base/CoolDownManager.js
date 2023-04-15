"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolDownManager = void 0;
const discord_js_1 = require("discord.js");
/**
 * The main class that manages the active cool downs for commands.
 */
class CoolDownManager {
    /**
     * The KyaClient instance.
     */
    client;
    /**
     * The collection of the current cool downs.
     */
    _collection;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client) {
        if (!client)
            throw new Error('Invalid client provided.');
        this.client = client;
        this._collection = new discord_js_1.Collection();
    }
    /**
     * Register a cool down when a command is triggered.
     * @param userId The user ID of the command's author.
     * @param commandName The name of the command.
     * @param coolDown The cool down amount (waiting time before executing it again).
     * @returns Void.
     */
    registerCoolDown(userId, commandName, coolDown) {
        const endTime = Date.now() + coolDown * 1000;
        const currentCoolDowns = this.coolDowns(userId);
        currentCoolDowns.push([commandName, endTime, coolDown]);
        this._collection.set(userId, currentCoolDowns);
    }
    /**
     * Returns all the cool downs for a specified user.
     * @param userId The user ID to search for.
     * @param commandName The name of the command to filter by.
     * @returns The full list of the user's cool downs.
     */
    coolDowns(userId, commandName) {
        let currentCoolDowns = this._collection.get(userId) || [];
        const currentTime = Date.now();
        currentCoolDowns = currentCoolDowns.filter((queueElement) => {
            return currentTime < queueElement[1];
        });
        this._collection.set(userId, currentCoolDowns);
        if (commandName) {
            return currentCoolDowns.filter((queueElement) => {
                return queueElement[0] === commandName;
            });
        }
        return currentCoolDowns;
    }
}
exports.CoolDownManager = CoolDownManager;
