import { Guild, Snowflake, VoiceChannel, Client, GuildMember, VoiceState } from 'discord.js';
import { KyaClient } from '../base';
import { Context } from '../services';
/**
 * The list of the different voice events.
 */
export declare const VoiceEvents: readonly ["join", "leave", "switch", "serverMute", "serverUnmute", "serverDeaf", "serverUndeaf", "selfMute", "selfUnmute", "selfDeaf", "selfUndeaf", "enableVideo", "disableVideo", "startStreaming", "stopStreaming", "stageSuppressedOn", "stageSuppressedOff", "askSpeakRequest", "cancelSpeakRequest"];
/**
 * The literal type of the different voice events.
 */
export type VoiceEvent = (typeof VoiceEvents)[number];
/**
 * The function type for voice events callbacks. There is one event per member.
 * @param changes The different voice events (join, leave, mute, unmute, deafen, undeafen).
 * @param member The member that triggered the event.
 * @param oldState The old voice state of the member.
 * @param newState The new voice state of the member.
 */
export type VoiceEventCallback = (changes: VoiceEvent[], member: GuildMember, context: Context, oldState: VoiceState, newState: VoiceState) => void | Promise<void>;
/**
 * Represents the class that contains different statistics about voice channels.
 */
export declare class VoiceManager {
    /**
     * The Discord Client instance.
     */
    readonly client: Client<boolean>;
    /**
     * The guild to look on.
     */
    private _contextGuild;
    /**
     * The voice channel to look on.
     */
    private _contextChannel;
    /**
     * The different voice events configured by the user with their callbacks.
     */
    private readonly _voiceEvents;
    /**
     * @param client The Discord Client instance.
     */
    constructor(client: Client<true> | KyaClient);
    /**
     * The guild to look on.
     * @returns The guild instance.
     */
    get guild(): Guild;
    /**
     * The voice channel to look on.
     * @returns The voice channel instance.
     */
    get channel(): VoiceChannel;
    /**
     * Set the guild to look on.
     */
    set setGuild(guild: Snowflake);
    /**
     * Set the voice channel to look on.
     */
    set setChannel(channel: Snowflake);
    /**
     * Returns the full list of members connected in the voice channel.
     * @param channel The voice channel to look on.
     * @param guild The guild to look on. It's recommended to set it before calling this method for performance issues.
     * @returns The list of members.
     */
    members(channel?: Snowflake, guild?: Snowflake): GuildMember[];
    /**
     * Moves a member to another voice channel.
     * @param member The member to move.
     * @param channel The channel to move the member to.
     * @returns The promised member.
     */
    move(member: Snowflake | GuildMember, channel: Snowflake): Promise<GuildMember>;
    /**
     * Disconnects a member from the voice channel.
     * @param member The member to disconnect.
     * @param channel The channel to disconnect the member to.
     * @returns The promised member.
     */
    disconnect(member: Snowflake | GuildMember, channel?: Snowflake): Promise<GuildMember>;
    /**
     * Contextualizes the voice channel.
     * @param member The voice channel to contextualize.
     * @param channel The contextualized voice channel.
     * @returns The contextualized voice channel.
     */
    private contextualize;
    /**
     * Registers a voice event.
     * @param event The voice event to register.
     * @param callback The callback to call when the event is triggered.
     * @returns Void.
     */
    register(event: VoiceEvent, callback: VoiceEventCallback): void;
    /**
     * Unregisters a voice event.
     * @param event The voice event to unregister.
     * @returns Void.
     */
    unregister(event: VoiceEvent): void;
    /**
     * Get the list of registered voice events.
     * @returns The list of registered voice events.
     */
    get events(): Map<VoiceEvent, VoiceEventCallback>;
    /**
     * Returns the list of changes in the voice state.
     * @param oldState The old voice state.
     * @param newState The new voice state.
     * @returns The list of changes.
     */
    static getChanges(oldState: VoiceState, newState: VoiceState): VoiceEvent[];
}
