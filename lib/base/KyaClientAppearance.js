"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyaClientAppearance = exports.PresenceStatusList = void 0;
const KyaClient_1 = require("./KyaClient");
/**
 * The full list of presence statuses.
 */
exports.PresenceStatusList = ['online', 'idle', 'dnd', 'invisible'];
/**
 * Represents the appearance manager for the client.
 */
class KyaClientAppearance {
    /**
     * The client instance.
     */
    client;
    /**
     * @param client The client instance.
     */
    constructor(client) {
        if (!client || !(client instanceof KyaClient_1.KyaClient))
            throw new Error('Invalid client provided.');
        this.client = client;
    }
    /**
     * Set the client's avatar.
     * @param path The path to the image.
     * @returns Void.
     */
    async setAvatar(path) {
        if (!path || (typeof path !== 'string' && typeof path !== 'object')) {
            throw new Error('Invalid path provided.');
        }
        if (!this.client.resolved.user)
            throw new Error('The client is not ready yet.');
        void (await this.client.resolved.user.setAvatar(path));
    }
    /**
     * Change the bot username.
     * @param username The new username.
     * @returns Void.
     */
    async setUsername(username) {
        if (!username || typeof username !== 'string')
            throw new Error('Invalid username provided.');
        if (!this.client.resolved.user)
            throw new Error('The client is not ready yet.');
        void (await this.client.resolved.user.setUsername(username));
    }
    /**
     * Change the bot presence.
     * @param status The new status.
     * @param activity The new activity.
     * @param shardId The shard id.
     * @returns Void.
     */
    async setPresence(status, activity, shardId) {
        if (!status || !exports.PresenceStatusList.includes(status))
            throw new Error('Invalid status provided.');
        if (!activity || (typeof activity !== 'string' && typeof activity !== 'object'))
            throw new Error('Invalid activity provided.');
        if (typeof activity === 'string') {
            activity = {
                name: activity,
            };
        }
        else {
            const tempActivity = {};
            if (activity.name)
                tempActivity.name = activity.name;
            if (activity.type)
                tempActivity.type = activity.type;
            if (activity.url)
                tempActivity.url = activity.url;
            activity = tempActivity;
        }
        void (await this.client.resolved.user?.setPresence({
            status,
            activities: [activity],
            shardId: shardId ?? 0,
        }));
    }
}
exports.KyaClientAppearance = KyaClientAppearance;
