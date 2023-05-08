"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStatistics = void 0;
const discord_js_1 = require("discord.js");
const base_1 = require("../../base");
/**
 * Represents the class that contains different statistics about voice channels.
 */
class VoiceStatistics {
    /**
     * The Discord Client instance.
     */
    client;
    /**
     * The guild to look on.
     */
    _guild;
    /**
     * The voice channel to look on.
     */
    _channel;
    /**
     * @param client The Discord Client instance.
     */
    constructor(client) {
        if (!client)
            throw new Error('Invalid client was provided.');
        if (client instanceof base_1.KyaClient)
            this.client = client.resolved;
        else if (client instanceof discord_js_1.Client)
            this.client = client;
        else
            throw new Error('Invalid client was provided.');
    }
    /**
     * The guild to look on.
     * @returns The guild instance.
     */
    get guild() {
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
        return this.client.guilds.resolve(this._guild);
    }
    /**
     * The voice channel to look on.
     * @returns The voice channel instance.
     */
    get channel() {
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
        return this.guild.channels.resolve(this._channel);
    }
    /**
     * Set the guild to look on.
     */
    set setGuild(guild) {
        if (typeof guild !== 'string')
            throw new Error('Invalid guild was provided.');
        this._guild = guild;
    }
    /**
     * Set the voice channel to look on.
     */
    set setChannel(channel) {
        if (typeof channel !== 'string')
            throw new Error('Invalid channel was provided.');
        this._channel = channel;
    }
    /**
     * Returns the full list of members connected in the voice channel.
     * @param guild The guild to look on.
     * @param channel The voice channel to look on.
     * @returns The list of members.
     */
    members(guild, channel) {
        if (guild) {
            if (typeof guild !== 'string')
                throw new Error('Invalid guild was provided.');
            this.setGuild = guild;
        }
        if (channel) {
            if (typeof channel !== 'string')
                throw new Error('Invalid channel was provided.');
            this.setChannel = channel;
        }
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
        if (!this._guild)
            throw new Error('The guild is not set.');
        if (!this._channel)
            throw new Error('The channel is not set.');
        const guildInstance = this.guild;
        const channelInstance = this.channel;
        if (!guildInstance)
            throw new Error('The guild was not found.');
        if (!channelInstance)
            throw new Error('The channel was not found.');
        const members = [];
        for (const member of channelInstance.members.values()) {
            members.push(member);
        }
        return members;
    }
}
exports.VoiceStatistics = VoiceStatistics;
