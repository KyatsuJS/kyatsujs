import { Guild, Snowflake, VoiceChannel, Client, GuildMember } from "discord.js";
import { KyaClient } from "../base";
/**
 * The literal type of the different voice events.
 */
export type VoiceEvent = 'join' | 'leave' | 'mute' | 'unmute' | 'deafen' | 'undeafen';
/**
 * Represents the class that contains different statistics about voice channels.
 */
export declare class Voice {
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
}
