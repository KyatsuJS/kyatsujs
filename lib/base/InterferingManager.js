"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterferingManager = void 0;
const discord_js_1 = require("discord.js");
/**
 * The main class that manages the active cool downs for commands.
 */
class InterferingManager {
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
     * Register an interfering command when this command is triggered.
     * @param userId The user ID of the command's author.
     * @param commandName The name of the command.
     * @param interactionId The ID of the interaction.
     * @returns Void.
     */
    registerInterfering(userId, commandName, interactionId) {
        const startTime = Date.now();
        const currentCoolDowns = this.interfering(userId);
        currentCoolDowns.push([commandName, startTime, interactionId]);
        this._collection.set(userId, currentCoolDowns);
    }
    /**
     * Returns all the interfering commands for a specified user.
     * @param userId The user ID to search for.
     * @param commands The names of the commands to filter by.
     * @returns The full list of the user's cool downs.
     */
    interfering(userId, ...commands) {
        const currentInterfering = this._collection.get(userId) || [];
        if (commands.length > 0) {
            return currentInterfering.filter((queueElement) => {
                return commands.includes(queueElement[0]);
            });
        }
        return currentInterfering;
    }
    /**
     * Removes an interfering commands. If a name is passed, remove all the commands with that name.
     * If an ID is passed, remove the command with the same interaction ID.
     * @param userId The user ID to search for.
     * @param key The value to search for; either the name of the command or the interaction ID.
     * @returns Void.
     */
    removeInterfering(userId, key) {
        if (!key)
            throw new Error('Invalid key provided.');
        const currentInterfering = this.interfering(userId);
        const interferingNames = currentInterfering.map((queueElement) => {
            return queueElement[0];
        });
        const interferingIds = currentInterfering.map((queueElement) => {
            return queueElement[2];
        });
        if (interferingNames.includes(key)) {
            this._collection.set(userId, currentInterfering.filter((queueElement) => {
                return queueElement[0] !== key;
            }));
        }
        else {
            this._collection.set(userId, currentInterfering.filter((queueElement) => {
                return queueElement[2] !== key;
            }));
        }
    }
}
exports.InterferingManager = InterferingManager;
