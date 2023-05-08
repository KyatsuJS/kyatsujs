import { Guild, Snowflake, VoiceChannel, Client, GuildMember, GuildBasedChannel, Collection } from 'discord.js';
import { KyaClient } from '../base';
import { SFToMember } from '../tools';

/**
 * The literal type of the different voice events.
 */
export type VoiceEvent = 'join' | 'leave' | 'mute' | 'unmute' | 'deafen' | 'undeafen';

/**
 * Represents the class that contains different statistics about voice channels.
 */
export class Voice {
  /**
   * The Discord Client instance.
   */
  public readonly client: Client<boolean>;
  /**
   * The guild to look on.
   */
  private _contextGuild: Snowflake;
  /**
   * The voice channel to look on.
   */
  private _contextChannel: Snowflake;

  /**
   * @param client The Discord Client instance.
   */
  constructor(client: Client<true> | KyaClient) {
    if (!client) throw new Error('Invalid client was provided.');
    if (client instanceof KyaClient) this.client = client.resolved;
    else if (client instanceof Client) this.client = client;
    else throw new Error('Invalid client was provided.');
  }

  /**
   * The guild to look on.
   * @returns The guild instance.
   */
  public get guild(): Guild {
    if (!this.client.isReady()) throw new Error('The client is not ready yet.');
    return this.client.guilds.resolve(this._contextGuild);
  }

  /**
   * The voice channel to look on.
   * @returns The voice channel instance.
   */
  public get channel(): VoiceChannel {
    if (!this.client.isReady()) throw new Error('The client is not ready yet.');

    if (!this._contextGuild) {
      if (!this.client.guilds.cache.size)
        throw new Error('The client is not in any guild, or the guild is not cached.');
      this._contextGuild = this.client.guilds.cache.first().id;
    }
    let resolved: GuildBasedChannel = this.guild.channels.resolve(this._contextChannel);
    if (!resolved)
      resolved = this.guild.channels.cache.find(
        (c: GuildBasedChannel): boolean => c.name.toLowerCase() === this._contextChannel.toLowerCase(),
      );
    return resolved as VoiceChannel;
  }

  /**
   * Set the guild to look on.
   */
  public set setGuild(guild: Snowflake) {
    if (typeof guild !== 'string') throw new Error('Invalid guild was provided.');
    this._contextGuild = guild;
  }

  /**
   * Set the voice channel to look on.
   */
  public set setChannel(channel: Snowflake) {
    if (typeof channel !== 'string') throw new Error('Invalid channel was provided.');
    this._contextChannel = channel;
  }

  /**
   * Returns the full list of members connected in the voice channel.
   * @param channel The voice channel to look on.
   * @param guild The guild to look on. It's recommended to set it before calling this method for performance issues.
   * @returns The list of members.
   */
  public members(channel?: Snowflake, guild?: Snowflake): GuildMember[] {
    if (!this.client.isReady()) throw new Error('The client is not ready yet.');
    if (guild) {
      if (typeof guild !== 'string') throw new Error('Invalid guild was provided.');
      this.setGuild = guild;
    }
    if (channel) {
      if (typeof channel !== 'string') throw new Error('Invalid channel was provided.');
      this.setChannel = channel;
    }

    if (!this._contextChannel) throw new Error('The channel is not set.');

    const channelInstance: VoiceChannel = this.channel;
    if (!channelInstance) throw new Error('The channel was not found.');

    const members: GuildMember[] = [];
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
  public async move(member: Snowflake | GuildMember, channel: Snowflake): Promise<GuildMember> {
    const [memberInstance, channelInstance]: [GuildMember, VoiceChannel] = await this.contextualize(member, channel);
    return await memberInstance.voice.setChannel(channelInstance);
  }

  /**
   * Disconnects a member from the voice channel.
   * @param member The member to disconnect.
   * @param channel The channel to disconnect the member to.
   * @returns The promised member.
   */
  public async disconnect(member: Snowflake | GuildMember, channel?: Snowflake): Promise<GuildMember> {
    const memberInstance: GuildMember = (await this.contextualize(member, channel || this._contextChannel))[0];
    return await memberInstance.voice.setChannel(null);
  }

  /**
   * Contextualizes the voice channel.
   * @param member The voice channel to contextualize.
   * @param channel The contextualized voice channel.
   * @returns The contextualized voice channel.
   */
  private async contextualize(
    member: Snowflake | GuildMember,
    channel: Snowflake,
  ): Promise<[GuildMember, VoiceChannel]> {
    if (!this.client.isReady()) throw new Error('The client is not ready yet.');
    if (!member) throw new Error('Invalid member was provided.');
    if (!channel) throw new Error('Invalid channel was provided.');

    if (typeof channel !== 'string') throw new Error('Invalid channel was provided.');

    this.setChannel = channel;
    const channelInstance: VoiceChannel = this.channel;
    if (typeof member === 'string') member = await SFToMember(this.client, this._contextGuild, member);
    if (!(member instanceof GuildMember)) throw new Error('Invalid member was provided.');

    if (!channelInstance) throw new Error('The channel was not found.');
    return [member, channelInstance];
  }
}
