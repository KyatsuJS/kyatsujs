import { BaseGuildVoiceChannel, BaseGuildTextChannel, TextBasedChannel, VoiceBasedChannel, BaseInteraction, User, MessagePayload, Message } from 'discord.js';
import { APIEmbedAuthor } from 'discord-api-types/v10';
import { Command } from "../base";
import { Colors } from "../tools";
/**
 * Represents the type for a context possible channel type among Discord package.
 */
export type ContextChannel = TextBasedChannel | VoiceBasedChannel | BaseGuildTextChannel | BaseGuildVoiceChannel;
/**
 * Represents the data for an alert.
 */
export interface AlertData {
    /**
     * The author of the APIEmbed. See the Discord API documentation for more information.
     * @link https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
     */
    author?: APIEmbedAuthor;
    /**
     * The color of the APIEmbed. One of the Colors enum.
     */
    color?: (typeof Colors)[keyof typeof Colors];
    /**
     * The description of the APIEmbed.
     */
    description: string;
    /**
     * The footer of the APIEmbed. A URL is expected.
     */
    image?: string;
    /**
     * The thumbnail of the APIEmbed. A URL is expected.
     */
    thumbnail?: string;
    /**
     * The timestamp of the APIEmbed. Can be a number, a Date instance or a boolean.
     */
    timestamp?: number | Date | null | boolean;
    /**
     * The title of the APIEmbed.
     */
    title: string;
}
/**
 * Represents a context. Includes a channel, an interaction, users.
 */
export declare class Context {
    /**
     * The channel where the action occurs.
     */
    readonly channel: ContextChannel;
    /**
     * The command associated with the context.
     */
    readonly command: Command;
    /**
     * The interaction, if there is one.
     */
    readonly interaction: BaseInteraction | null | undefined;
    /**
     * The users implicated in the context/action.
     */
    readonly users: User[] | [];
    /**
     * @param channel The channel where the action occurs.
     * @param command The command associated with the context.
     * @param interaction The interaction, if there is one.
     * @param users The users implicated in the context/action.
     */
    constructor(channel: ContextChannel, command: Command, interaction?: null | BaseInteraction, ...users: User[] | []);
    /**
     * Send a message in a text based channel (text, thread, announcements...).
     * @param messagePayload The message data to send (Discord.<MessagePayload>).
     * @returns The message instance, or null if not sent.
     */
    send(messagePayload: MessagePayload | object): Promise<Message | null>;
    /**
     * Send an alert in a text based channel. The alert is sent as an embed.
     * @param alertData The data of the alert.
     * @param style The style of the alert.
     * @returns The message instance, or null if not sent.
     */
    alert(alertData: AlertData, style?: keyof typeof Colors): Promise<Message | null>;
}
