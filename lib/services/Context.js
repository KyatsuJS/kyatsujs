"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_js_1 = require("discord.js");
const tools_1 = require("../tools");
/**
 * Represents a context. Includes a channel, an interaction, users.
 */
class Context {
    /**
     * The channel where the action occurs.
     */
    channel;
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
     * @param channel The channel where the action occurs.
     * @param command The command associated with the context.
     * @param interaction The interaction, if there is one.
     * @param users The users implicated in the context/action.
     */
    constructor(channel, command, interaction, ...users) {
        if (!channel)
            throw new Error('No channel passed.');
        if (!command)
            throw new Error('No command passed.');
        this.channel = channel;
        this.command = command;
        this.interaction = interaction;
        this.users = users;
    }
    /**
     * Send a message in a text based channel (text, thread, announcements...).
     * @param messagePayload The message data to send (Discord.<MessagePayload>).
     * @returns The message instance, or null if not sent.
     */
    async send(messagePayload) {
        if (!this.channel.isTextBased) {
            throw new Error('Channel is not a Discord BaseChannel instance.');
        }
        if (!this.channel.isTextBased())
            return null;
        const message = await this.channel.send(messagePayload).catch((reason) => {
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
        if (!alertData)
            throw new Error('No alert data passed.');
        if (!this.interaction)
            return null;
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
        if (this.interaction.isRepliable()) {
            // @ts-ignore
            return await this.interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
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
}
exports.Context = Context;
