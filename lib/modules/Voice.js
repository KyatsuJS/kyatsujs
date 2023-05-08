"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voice = void 0;
const discord_js_1 = require("discord.js");
const base_1 = require("../base");
const tools_1 = require("../tools");
/**
 * Represents the class that contains different statistics about voice channels.
 */
class Voice {
    /**
     * The Discord Client instance.
     */
    client;
    /**
     * The guild to look on.
     */
    _contextGuild;
    /**
     * The voice channel to look on.
     */
    _contextChannel;
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
        return this.client.guilds.resolve(this._contextGuild);
    }
    /**
     * The voice channel to look on.
     * @returns The voice channel instance.
     */
    get channel() {
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
        if (!this._contextGuild) {
            if (!this.client.guilds.cache.size)
                throw new Error('The client is not in any guild, or the guild is not cached.');
            this._contextGuild = this.client.guilds.cache.first().id;
        }
        let resolved = this.guild.channels.resolve(this._contextChannel);
        if (!resolved)
            resolved = this.guild.channels.cache.find((c) => c.name.toLowerCase() === this._contextChannel.toLowerCase());
        return resolved;
    }
    /**
     * Set the guild to look on.
     */
    set setGuild(guild) {
        if (typeof guild !== 'string')
            throw new Error('Invalid guild was provided.');
        this._contextGuild = guild;
    }
    /**
     * Set the voice channel to look on.
     */
    set setChannel(channel) {
        if (typeof channel !== 'string')
            throw new Error('Invalid channel was provided.');
        this._contextChannel = channel;
    }
    /**
     * Returns the full list of members connected in the voice channel.
     * @param channel The voice channel to look on.
     * @param guild The guild to look on. It's recommended to set it before calling this method for performance issues.
     * @returns The list of members.
     */
    members(channel, guild) {
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
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
        if (!this._contextChannel)
            throw new Error('The channel is not set.');
        const channelInstance = this.channel;
        if (!channelInstance)
            throw new Error('The channel was not found.');
        const members = [];
        for (const member of channelInstance.members.values()) {
            members.push(member);
        }
        return members;
    }
    /**
     * Moves a member to another voice channel.
     * @param member The member to move.
     * @param channel The channel to move the member to.
     * @returns The promised member.
     */
    async move(member, channel) {
        const [memberInstance, channelInstance] = await this.contextualize(member, channel);
        return await memberInstance.voice.setChannel(channelInstance);
    }
    /**
     * Disconnects a member from the voice channel.
     * @param member The member to disconnect.
     * @param channel The channel to disconnect the member to.
     * @returns The promised member.
     */
    async disconnect(member, channel) {
        const memberInstance = (await this.contextualize(member, channel || this._contextChannel))[0];
        return await memberInstance.voice.setChannel(null);
    }
    /**
     * Contextualizes the voice channel.
     * @param member The voice channel to contextualize.
     * @param channel The contextualized voice channel.
     * @returns The contextualized voice channel.
     */
    async contextualize(member, channel) {
        if (!this.client.isReady())
            throw new Error('The client is not ready yet.');
        if (!member)
            throw new Error('Invalid member was provided.');
        if (!channel)
            throw new Error('Invalid channel was provided.');
        if (typeof channel !== 'string')
            throw new Error('Invalid channel was provided.');
        this.setChannel = channel;
        const channelInstance = this.channel;
        if (typeof member === 'string')
            member = await (0, tools_1.SFToMember)(this.client, this._contextGuild, member);
        if (!(member instanceof discord_js_1.GuildMember))
            throw new Error('Invalid member was provided.');
        if (!channelInstance)
            throw new Error('The channel was not found.');
        return [member, channelInstance];
    }
}
exports.Voice = Voice;
