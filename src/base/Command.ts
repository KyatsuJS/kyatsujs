import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';

import {CreateAnonymeArray, NumRange} from "../tools";
import {log} from "../tools";
import {KyaClient} from './KyaClient';
import {Context, ContextChannel} from "../services";
import {coolDownsQueueElement} from './CoolDownManager';
import {interferingQueueElement} from './InterferingManager';

/**
 * Where the command should be executed.
 */
export enum CommandLocation {
  /**
   * The command will be sent in the global commands.
   */
  GLOBAL,
  /**
   * The command will be sent in one or few guilds.
   */
  GUILD_ONLY,
  /**
   * The command will be sent in both places.
   */
  BOTH,
}

/**
 * The properties of the metadata options for the command.
 */
export interface MetaData {
  /**
   * The commands that must be executed before this one.
   * If one of the interfering commands are currently running, this command will be ignored.
   */
  interferingCommands?: ChatInputApplicationCommandData['name'][];
  /**
   * The amount of time before running the command again. Must be between 0 and 300 seconds.
   */
  coolDown?: NumRange<CreateAnonymeArray<0>, 300>;
  /**
   * Where the command should be executed.
   */
  guildOnly?: CommandLocation;
  /**
   * If the previous field ('guildOnly') is set on GUILD_ONLY or BOTH.
   * List the guilds where the command should be executed.
   */
  guilds?: string[];
}

/**
 * Default meta data fields.
 */
export const defaultMetaData: MetaData = {
  interferingCommands: [],
  coolDown: 0,
  guildOnly: CommandLocation.GLOBAL,
  guilds: [],
};

/**
 * The properties of a command structure.
 */
export interface CommandOptions {
  /**
   * The data concerning the command. See the Discord API documentation for more information.
   * @link https://discord.com/developers/docs/interactions/slash-commands#applicationcommand
   */
  options: ChatInputApplicationCommandData;
  /**
   * The options associated with Kyatsu services. See the MetaData interface for more information.
   */
  metaData?: MetaData;
  /**
   * The options to pass if you want to store some personal information.
   * @example
   * {
   *   easterEgg: "I'm a sheep !",
   * }
   */
  additional?: object;
}

/**
 * The function to call when the command is executed.
 * @param command The command instance.
 * @param interaction The interaction associated with the command.
 * @returns Void.
 */
export type commandCallback = (
    command: Command,
    interaction:
        | ChatInputCommandInteraction
        | ContextMenuCommandInteraction
) => Promise<void>;

/**
 * Represents the basic command interaction.
 */
export class Command {
  /**
   * The client instance.
   */
  public readonly client: KyaClient;
  /**
   * The name of the command.
   */
  public readonly name: string;
  /**
   * The options to implement with the command.
   */
  public readonly options: ChatInputApplicationCommandData;
  /**
   * The options associated with Kyatsu services (cool down, permissions...).
   */
  public readonly metaData: MetaData;
  /**
   * The options to pass if you want to store some personal information.
   */
  public readonly additional: object;
  /**
   * The context of the command, to use interactions with Discord.
   */
  private _ctx: Context | undefined;
  /**
   * The function to call when the command is executed.
   */
  private _run: commandCallback = async (): Promise<void> => {
    log('Command interaction ran.');
    return;
  };

  /**
   * @param client The KyaClient instance.
   * @param name The name of the command.
   * @param options The options to implement with the command.
   * @param metaData The options associated with Kyatsu services (cool down, permissions...).
   * @param additional The options to pass if you want to store some personal information.
   */
  constructor(
    client: KyaClient,
    name: string,
    options: ChatInputApplicationCommandData,
    metaData?: MetaData,
    additional?: object,
  ) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid command name provided.');
    }
    if (!options || typeof options !== "object") throw new Error('Invalid command options provided.');
    if (options?.type !== 1) {
      throw new Error('Invalid command type provided. It must be a slash command. Type 1.');
    }

    if (metaData && typeof metaData !== "object") throw new Error('Invalid command metaData provided.');
    if (additional && typeof additional !== "object") throw new Error('Invalid command additional provided.');

    this.client = client;
    this.name = name;
    this.options = options;
    this.metaData = metaData || defaultMetaData;
    this.additional = additional || {};
  }

  /**
   * Set the context of the command.
   * @param ctx The context instance.
   */
  public set setContext(ctx: Context) {
    if (!(ctx instanceof Context)) throw new Error('Invalid context provided. It must be a Context instance.');

    this._ctx = ctx;
  }

  /**
   * Set the function to be call back when the command is executed.
   * @param callback The function to call.
   */
  public set setRun(callback: commandCallback) {
    if (typeof callback !== 'function') {
      throw new Error('Invalid callback provided. It must be a function.');
    }
    this._run = callback;
  }

  /**
   * Get the context of the command.
   * @returns The context of the command.
   */
  public get ctx(): Context {
    if (!this._ctx) throw new Error('Context not set.');
    return this._ctx;
  }

  /**
   * Execute the command call back function.
   * @param interaction The interaction associated with the command.
   * @returns Void.
   */
  // @ts-ignore
  public async run(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction): Promise<void> {
    if (!(interaction instanceof ChatInputCommandInteraction)
        && !(interaction instanceof ContextMenuCommandInteraction)) {
        throw new Error(
            'Invalid interaction provided: ChatInputCommandInteraction or ContextMenuCommandInteraction expected.'
        );
    }

    this.setContext = new Context(interaction.channel as ContextChannel, this, interaction, interaction.user);
    const activeCoolDowns: coolDownsQueueElement[] = this.client.Commands.CoolDowns.coolDowns(
      interaction.user.id,
      this.name,
    );
    const activeInterfering: interferingQueueElement[] = this.client.Commands.Interfering.interfering(
      interaction.user.id,
      ...(this.metaData.interferingCommands || []),
    );

    if (activeCoolDowns.length > 0) {
      const finishTime: string = String(activeCoolDowns[0][1] / 1000).split('.')[0];
      if (!this._ctx) return;

      return void (await this._ctx.alert(
        {
          title: 'Oops!',
          description:
            `Slow down! Command **/${this.name}** can't be run again,` + ` waiting time: <t:${finishTime}:R>`,
        },
        'RED',
      ));
    }
    if (activeInterfering.length > 0) {
      if (!this._ctx) return;

      return void (await this._ctx.alert(
        {
          title: 'Oops!',
          description: `You can't run this command while **/${
            activeInterfering.length > 1
              ? activeInterfering.map((i: interferingQueueElement) => i[0]).join('**, **/')
              : activeInterfering[0][0]
          }** is running.`,
        },
        'RED',
      ));
    }

    this.client.Commands.CoolDowns.registerCoolDown(interaction.user.id, this.name, this.metaData.coolDown || 0);
    this.client.Commands.Interfering.registerInterfering(interaction.user.id, this.name, interaction.id);
    await this._run(this, interaction);
  }

  /**
   * End the command. Call it when you want the command to be considered as finished and remove it from the interfering queue.
   * @returns Void.
   */
  public end(): void {
    if (!this._ctx) return;
    if (!this._ctx.interaction) return;

    this.client.Commands.Interfering.removeInterfering(this._ctx?.interaction.user.id, this._ctx?.interaction.id);
  }
}
