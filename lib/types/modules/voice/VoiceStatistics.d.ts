import { Guild, Snowflake, VoiceChannel, Client, GuildMember } from 'discord.js';
import { KyaClient } from '../../base';
/**
 * Represents the class that contains different statistics about voice channels.
 */
export declare class VoiceStatistics {
    /**
     * The Discord Client instance.
     */
    readonly client: Client<boolean>;
    /**
     * The guild to look on.
     */
    private _guild;
    /**
     * The voice channel to look on.
     */
    private _channel;
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
     * @param guild The guild to look on.
     * @param channel The voice channel to look on.
     * @returns The list of members.
     */
    members(guild?: Snowflake, channel?: Snowflake): GuildMember[];
}
