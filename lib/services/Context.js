"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_js_1 = require("discord.js");
const base_1 = require("../base");
const tools_1 = require("../tools");
/**
 * Represents a context. Includes a channel, an interaction, users.
 */
class Context {
    /**
     * The channel where the action occurs.
     */
    _channel;
    /**
     * The command associated with the context.
     */
    command;
    /**
     * The interaction, if there is one.
     */
    interaction;
    /**
     * The users implicated in the context/action.
     */
    users;
    /**
     * The Kyatsu client instance.
     */
    _client;
    /**
     * @param channel The channel where the action occurs.
     * @param command The command associated with the context.
     * @param interaction The interaction, if there is one.
     * @param users The users implicated in the context/action.
     */
    constructor(channel, command, interaction, ...users) {
        if (!channel)
            throw new Error('No channel provided.');
        if (interaction && !(interaction instanceof discord_js_1.BaseInteraction)) {
            throw new Error('Interaction is not a Discord BaseInteraction instance.');
        }
        if (users.length > 0 && users.some((user) => !(user instanceof discord_js_1.User))) {
            throw new Error('Users are not Discord User instances list.');
        }
        this._channel = channel;
        if (this.command) {
            if (!(command instanceof base_1.Command))
                throw new Error('Command is not a Command instance.');
            this.command = command;
        }
        if (this.interaction)
            this.interaction = interaction;
        this.users = users;
    }
    /**
     * Get the context channel.
     * @returns The channel instance.
     */
    get channel() {
        return this._channel;
    }
    /**
     * Set the Kyatsu client instance.
     */
    set client(client) {
        if (!client || !(client instanceof base_1.KyaClient))
            throw new Error('Invalid client provided.');
        this._client = client;
    }
    /**
     * Send a message in a text based channel (text, thread, announcements...).
     * @param messagePayload The message data to send (Discord.<MessagePayload>).
     * @returns The message instance, or null if not sent.
     */
    async send(messagePayload) {
        if (!this._channel.isTextBased) {
            throw new Error('Channel is not a Discord BaseChannel instance.');
        }
        if (!this._channel.isTextBased())
            return null;
        if (!messagePayload || typeof messagePayload !== 'object') {
            throw new Error('No message payload passed.');
        }
        const message = await this._channel.send(messagePayload).catch((reason) => {
            (0, tools_1.log)(`Message could not be sent: ${reason}`);
        });
        if (!message)
            return null;
        return message;
    }
    /**
     * Send an alert in a text based channel. The alert is sent as an embed.
     * @param alertData The data of the alert.
     * @param style The style of the alert.
     * @returns The message instance, or null if not sent.
     */
    async alert(alertData, style = Object.keys(tools_1.Colors)[0]) {
        if (!alertData || typeof alertData !== 'object')
            throw new Error('Invalid alert data passed.');
        if (!style || !(style in tools_1.Colors))
            throw new Error('Invalid style for embed alert.');
        if (!alertData.title)
            throw new Error('No title passed, but necessary.');
        if (!alertData.description)
            throw new Error('No description passed, but necessary.');
        const embed = new discord_js_1.EmbedBuilder();
        if (alertData.author) {
            if (typeof alertData.author !== 'object')
                throw new Error('Invalid author for embed alert.');
            embed.setAuthor(alertData.author);
        }
        if (alertData.description) {
            embed.setDescription(alertData.description.substring(0, 4096));
        }
        if (alertData.image) {
            embed.setImage(alertData.image);
        }
        if (alertData.thumbnail) {
            embed.setThumbnail(alertData.thumbnail);
        }
        if (alertData.timestamp) {
            if (typeof alertData.timestamp === 'boolean') {
                if (alertData.timestamp)
                    embed.setTimestamp(Date.now());
            }
            else if (typeof alertData.timestamp === 'number') {
                embed.setTimestamp(alertData.timestamp);
            }
            else {
                throw new Error('Invalid timestamp for embed alert.');
            }
        }
        embed.setColor(tools_1.Colors[style]);
        embed.setTitle(alertData.title);
        embed.setDescription(alertData.description);
        if (!this.interaction) {
            return await this.send({ embeds: [embed.toJSON()] }).catch((reason) => {
                (0, tools_1.log)(`Message could not be sent: ${reason}`);
            });
        }
        if (this.interaction.isRepliable()) {
            // @ts-ignore
            return await this.interaction.reply({ embeds: [embed.toJSON()], ephemeral: true }).catch((reason) => {
                (0, tools_1.log)(`Interaction could not be replied to: ${reason}`);
            });
        }
        else {
            if (!this.interaction.isChatInputCommand())
                return null;
            await this.interaction.deferReply({ ephemeral: true }).catch((reason) => {
                (0, tools_1.log)(`Interaction could not be deferred: ${reason}`);
            });
            const followedUp = await this.interaction
                .followUp({ embeds: [embed.toJSON()], ephemeral: true })
                .catch((reason) => {
                (0, tools_1.log)(`Interaction could not be followed up: ${reason}`);
            });
            if (!followedUp)
                return null;
            return followedUp;
        }
    }
    /**
     * Set the context channel.
     * @param guildId The guild ID of the channel.
     * @param channel The channel to set.
     * @returns The context instance.
     */
    async setCtxChannel(guildId, channel) {
        if (!channel)
            throw new Error('No channel provided.');
        if (!this.command && !this._client)
            throw new Error('No command and client provided.');
        const client = this?.command?.client || this._client || undefined;
        if (!client)
            throw new Error('No valid client provided.');
        if (typeof channel === 'string')
            channel = await (0, tools_1.SFToCtxChannel)(client.resolved, guildId, channel);
        this._channel = channel;
        return this;
    }
}
exports.Context = Context;
