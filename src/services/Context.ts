import {
  BaseGuildVoiceChannel,
  BaseGuildTextChannel,
  TextBasedChannel,
  VoiceBasedChannel,
  BaseInteraction,
  User,
  MessagePayload,
  EmbedBuilder,
  Message,
  Snowflake,
} from 'discord.js';

import { APIEmbedAuthor } from 'discord-api-types/v10';

import { Command, KyaClient } from '../base';
import { log, Colors, SFToCtxChannel } from '../tools';

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
export class Context {
  /**
   * The channel where the action occurs.
   */
  private _channel: ContextChannel;
  /**
   * The command associated with the context.
   */
  public readonly command: Command | undefined;
  /**
   * The interaction, if there is one.
   */
  public readonly interaction: BaseInteraction | undefined;
  /**
   * The users implicated in the context/action.
   */
  public readonly users: User[] | [];
  /**
   * The Kyatsu client instance.
   */
  private _client: KyaClient | undefined;

  /**
   * @param channel The channel where the action occurs.
   * @param command The command associated with the context.
   * @param interaction The interaction, if there is one.
   * @param users The users implicated in the context/action.
   */
  constructor(channel: ContextChannel, command?: Command, interaction?: BaseInteraction, ...users: User[] | []) {
    if (!channel) throw new Error('No channel provided.');
    if (interaction && !(interaction instanceof BaseInteraction)) {
      throw new Error('Interaction is not a Discord BaseInteraction instance.');
    }
    if (users.length > 0 && users.some((user: User): boolean => !(user instanceof User))) {
      throw new Error('Users are not Discord User instances list.');
    }

    this._channel = channel;
    if (this.command) {
      if (!(command instanceof Command)) throw new Error('Command is not a Command instance.');
      this.command = command;
    }
    if (this.interaction) this.interaction = interaction;
    this.users = users;
  }

  /**
   * Get the context channel.
   * @returns The channel instance.
   */
  public get channel(): ContextChannel {
    return this._channel;
  }

  /**
   * Set the Kyatsu client instance.
   */
  public set client(client: KyaClient) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');
    this._client = client;
  }

  /**
   * Send a message in a text based channel (text, thread, announcements...).
   * @param messagePayload The message data to send (Discord.<MessagePayload>).
   * @returns The message instance, or null if not sent.
   */
  public async send(messagePayload: MessagePayload | object): Promise<Message | null> {
    if (!this._channel.isTextBased) {
      throw new Error('Channel is not a Discord BaseChannel instance.');
    }
    if (!this._channel.isTextBased()) return null;
    if (!messagePayload || typeof messagePayload !== 'object') {
      throw new Error('No message payload passed.');
    }

    const message: void | Message = await this._channel.send(messagePayload).catch((reason: any): void => {
      log(`Message could not be sent: ${reason}`);
    });
    if (!message) return null;

    return message;
  }

  /**
   * Send an alert in a text based channel. The alert is sent as an embed.
   * @param alertData The data of the alert.
   * @param style The style of the alert.
   * @returns The message instance, or null if not sent.
   */
  public async alert(
    alertData: AlertData,
    style: keyof typeof Colors = Object.keys(Colors)[0] as keyof typeof Colors,
  ): Promise<Message<boolean> | void> {
    if (!alertData || typeof alertData !== 'object') throw new Error('Invalid alert data passed.');

    if (!style || !(style in Colors)) throw new Error('Invalid style for embed alert.');

    if (!alertData.title) throw new Error('No title passed, but necessary.');
    if (!alertData.description) throw new Error('No description passed, but necessary.');

    const embed: EmbedBuilder = new EmbedBuilder();

    if (alertData.author) {
      if (typeof alertData.author !== 'object') throw new Error('Invalid author for embed alert.');
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
        if (alertData.timestamp) embed.setTimestamp(Date.now());
      } else if (typeof alertData.timestamp === 'number') {
        embed.setTimestamp(alertData.timestamp);
      } else {
        throw new Error('Invalid timestamp for embed alert.');
      }
    }

    embed.setColor(Colors[style]);
    embed.setTitle(alertData.title);
    embed.setDescription(alertData.description);

    if (!this.interaction) {
      return await this.send({ embeds: [embed.toJSON()] }).catch((reason: any): void => {
        log(`Message could not be sent: ${reason}`);
      });
    }
    if (this.interaction.isRepliable()) {
      // @ts-ignore
      return await this.interaction.reply({ embeds: [embed.toJSON()], ephemeral: true }).catch((reason: any): void => {
        log(`Interaction could not be replied to: ${reason}`);
      });
    } else {
      if (!this.interaction.isChatInputCommand()) return null;
      await this.interaction.deferReply({ ephemeral: true }).catch((reason: any): void => {
        log(`Interaction could not be deferred: ${reason}`);
      });
      const followedUp = await this.interaction
        .followUp({ embeds: [embed.toJSON()], ephemeral: true })
        .catch((reason: any): void => {
          log(`Interaction could not be followed up: ${reason}`);
        });

      if (!followedUp) return null;
      return followedUp;
    }
  }

  /**
   * Set the context channel.
   * @param guildId The guild ID of the channel.
   * @param channel The channel to set.
   * @returns The context instance.
   */
  public async setCtxChannel(guildId: Snowflake, channel: ContextChannel | Snowflake): Promise<this> {
    if (!channel) throw new Error('No channel provided.');
    if (!this.command && !this._client) throw new Error('No command and client provided.');

    const client: KyaClient = this?.command?.client || this._client || undefined;
    if (!client) throw new Error('No valid client provided.');

    if (typeof channel === 'string') channel = await SFToCtxChannel(client.resolved, guildId, channel);

    this._channel = channel;
    return this;
  }
}
