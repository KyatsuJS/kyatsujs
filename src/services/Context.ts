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
} from 'discord.js';

import { APIEmbedAuthor } from 'discord-api-types/v10';

import { Command } from '../base';
import { log, Colors } from '../tools';

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
  public readonly channel: ContextChannel;
  /**
   * The command associated with the context.
   */
  public readonly command: Command;
  /**
   * The interaction, if there is one.
   */
  public readonly interaction: BaseInteraction | undefined;
  /**
   * The users implicated in the context/action.
   */
  public readonly users: User[] | [];

  /**
   * @param channel The channel where the action occurs.
   * @param command The command associated with the context.
   * @param interaction The interaction, if there is one.
   * @param users The users implicated in the context/action.
   */
  constructor(channel: ContextChannel, command: Command, interaction?: BaseInteraction, ...users: User[] | []) {
    if (!channel) throw new Error('No channel provided.');
    if (!command || !(command instanceof Command)) throw new Error('No command passed.');
    if (interaction && !(interaction instanceof BaseInteraction)) {
      throw new Error('Interaction is not a Discord BaseInteraction instance.');
    }
    if (users.length > 0 && users.some((user: User): boolean => !(user instanceof User))) {
      throw new Error('Users are not Discord User instances list.');
    }

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
  public async send(messagePayload: MessagePayload | object): Promise<Message | null> {
    if (!this.channel.isTextBased) {
      throw new Error('Channel is not a Discord BaseChannel instance.');
    }
    if (!this.channel.isTextBased()) return null;
    if (!messagePayload || !(messagePayload instanceof MessagePayload && typeof messagePayload === 'object')) {
      throw new Error('No message payload passed.');
    }

    const message: void | Message = await this.channel.send(messagePayload).catch((reason: any): void => {
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
  ): Promise<Message | null> {
    if (!alertData || typeof alertData !== 'object') throw new Error('Invalid alert data passed.');
    if (!this.interaction) return null;

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

    if (this.interaction.isRepliable()) {
      // @ts-ignore
      return await this.interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
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
}
