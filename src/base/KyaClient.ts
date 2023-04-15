import { Client, ClientOptions, Collection } from 'discord.js';

import { CommandManager } from './CommandManager';
import { EventManager } from './EventManager';
import { Event } from './Event';
import { Command, CommandLocation } from './Command';
import * as Discord from "discord.js";

/**
 * Represents the default events list.
 */
export type availableEvent = 'ready' | 'interactionCreate';

/**
 * The KyaClient structure properties.
 */
export interface KyaOptions extends ClientOptions {
  /**
   * The client token.
   */
  token?: string | undefined;
  /**
   * The default events to bind among the available ones. See the availableEvent type.
   */
  defaultEvents?: availableEvent[];
}

/**
 * The class that represents an instance of KyaClient. It extends the Discord.<Client> class.
 */
export class KyaClient extends Client {
  /**
   * The command manager instance.
   */
  public readonly Commands: CommandManager;
  /**
   * The event manager instance.
   */
  public readonly Events: EventManager;
  /**
   * The client token.
   */
  private readonly _token: string | undefined;
  /**
   * Whether the client should load commands or not. Load commands means sending commands to the API.
   * Don't activate this permanently, it's only on change.
   */
  public _load: boolean = false;

  /**
   * @param options The ClientOptions of the client (Discord.<ClientOptions>).
   */
  constructor(options: KyaOptions) {
    super(options);

    this.Commands = new CommandManager(this);
    this.Events = new EventManager(this);
    this._token = options.token || undefined;

    this.Events.bindEvent('ready');
  }

  /**
   * Create a KyaClient instance and returns it; using multiple possibles as arguments.
   * @param {KyaOptions | string | any} options The options or the token. If the token only is passed, default options are taken.
   * @returns {KyaClient} The KyaClient instance.
   */
  static init(options: KyaOptions | string | undefined): KyaClient {
    let defaultOptions: KyaOptions = {
      failIfNotExists: false,
      intents: [Discord.GatewayIntentBits.Guilds],
      defaultEvents: ['ready'],
    };
    if (typeof options === 'string') {
      defaultOptions.token = options;
    } else if (typeof options === 'object') {
      defaultOptions = Object.assign(defaultOptions, options);
    }
    return new KyaClient(defaultOptions);
  }

  /**
   * Launch the client after bounding events and sending commands to the API, if necessary.
   * Returns a simple string.
   * @param token The client token, if not specified before.
   * @returns A string constant "Logged in.".
   */
  public async login(token?: string): Promise<string> {
    if (!token && !this._token) throw new Error('No token provided.');

    this.Events.events.each((event: Event) => {
      const method: string = event.name === 'ready' ? 'once' : 'on';
      (this as { [index: string]: any })[method](event.name, (...args: any[]): void => {
        event.callbackFn(this, ...args);
      });
    });

    await super.login(token || this._token);
    if (this._load) {
      this.loadCommands();
    }

    return 'Logged in.';
  }

  /**
   * A private function that load commands.
   * @private
   * @returns The command manager instance of the client.
   */
  private loadCommands(): CommandManager {
    const clientApplication: KyaClient['application'] = this.application;
    if (!clientApplication) {
      throw new Error('Invalid client application provided.');
    }

    const guilds: Collection<string, Command[]> = new Collection();
    const global: Command[] = [];

    this.Commands.commands.each((command: Command) => {
      if (
        command.metaData.guildOnly === CommandLocation.GUILD_ONLY ||
        command.metaData.guildOnly === CommandLocation.BOTH
      ) {
        for (const guildId of command.metaData.guilds || []) {
          if (!guilds.has(guildId)) {
            // @ts-ignore
            guilds.set(guildId, []);
          }

          // @ts-ignore
          const guildCommands: undefined | Command[] = guilds.get(guildId);
          if (!guildCommands) continue;

          guildCommands.push(command);
          guilds.set(guildId, guildCommands);
        }
      } else if (
        command.metaData.guildOnly === CommandLocation.GLOBAL ||
        command.metaData.guildOnly === CommandLocation.BOTH
      ) {
        global.push(command);
      }
    });

    for (const guild of guilds) {
      const guildId: string = guild[0];
      const guildCommands: Command[] = guild[1];
      if (guildCommands.length > 0) {
        this.application?.commands.set(
          guildCommands.map((cmd: Command) => cmd.options),
          guildId,
        );
      }
    }
    if (global.length > 0) {
      this.application?.commands.set(global.map((cmd: Command) => cmd.options));
    }
    return this.Commands;
  }
}
