import { Client, ClientOptions, Collection, GatewayIntentBits } from 'discord.js';

import { CommandManager, EventManager, Event, Command, CommandLocation, KyaClientAppearance } from './index';
import { timeout } from '../tools';

/**
 * Represents the default events list.
 */
export type availableEvent = 'ready' | 'interactionCreate';

/**
 * Represents a system function.
 * @param client The client instance.
 * @param args The arguments to pass to the function.
 * @returns The function result.
 */
export type systemFunction = (
  client: KyaClient,
  bot: typeof KyaClient.prototype.resolved,
  ...args: any[]
) => Promise<any | void> | any | void;

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
export class KyaClient {
  /**
   * The Discord Client instance.
   */
  public readonly resolved: Client;
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
  private _load: boolean = false;
  /**
   * The client appearance manager.
   */
  public readonly Appearance: KyaClientAppearance = new KyaClientAppearance(this);
  /**
   * The function that is called before the client is ready. This is called before the commands are loaded (if enabled).
   * Also, this is called before the events are bound.
   */
  private _prepareMethod: systemFunction = async (): Promise<void> => {
    return;
  };
  /**
   * The function that is called after the client is ready.
   */
  private _readyMethod: systemFunction = async (): Promise<void> => {
    return;
  };

  /**
   * @param options The ClientOptions of the client (Discord.<ClientOptions>).
   */
  constructor(options: KyaOptions) {
    if (!options || typeof options !== 'object') throw new Error('Invalid options provided.');

    this.Commands = new CommandManager(this);
    this.Events = new EventManager(this);
    this._token = options.token || undefined;

    this.resolved = new Client(options);

    this.Events.bindEvent('ready');
  }

  /**
   * Set the commands loading to the API value (true/false).
   * @param value The value to set.
   */
  public set setLoad(value: boolean) {
    if (typeof value !== 'boolean') throw new Error('Invalid value provided.');
    this._load = value;
  }

  /**
   * Returns if the commands loading to the API is enabled or not.
   * @returns True if the commands loading is enabled, or false if not.
   */
  public get load(): boolean {
    return this._load;
  }

  /**
   * Create a KyaClient instance and returns it; using multiple possibles as arguments.
   * @param options The options or the token. If the token only is passed, default options are taken.
   * @returns The KyaClient instance.
   */
  static init(options: KyaOptions | string): KyaClient {
    if (!options || (options && typeof options !== 'object' && typeof options !== 'string'))
      throw new Error('Invalid options provided.');

    let defaultOptions: KyaOptions = {
      failIfNotExists: false,
      intents: [GatewayIntentBits.Guilds],
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
    if (token && typeof token !== 'string') throw new Error('Invalid token provided.');

    await this._prepareMethod(this, this.resolved, ...arguments);

    this.Events.events.each((event: Event) => {
      const method: string = event.name === 'ready' ? 'once' : 'on';
      (this.resolved as { [index: string]: any })[method](event.name, (...args: any[]): void => {
        event.callback(this, ...args);
      });
    });

    const logged: string = await this.resolved.login(token || this._token);
    if (this._load) {
      await this.loadCommands();
    }

    await this._readyMethod(this, this.resolved, ...arguments);

    return logged;
  }

  /**
   * A private function that load commands.
   * @returns The command manager instance of the client.
   */
  private async loadCommands(): Promise<CommandManager> {
    const clientApplication: KyaClient['resolved']['application'] = this.resolved.application;
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
        for (const guildID of command.metaData.guilds || []) {
          if (!guilds.has(guildID)) {
            // @ts-ignore
            guilds.set(guildID, []);
          }

          // @ts-ignore
          const guildCommands: undefined | Command[] = guilds.get(guildID);
          if (!guildCommands) continue;

          guildCommands.push(command);
          guilds.set(guildID, guildCommands);
        }
      } else if (
        command.metaData.guildOnly === CommandLocation.GLOBAL ||
        command.metaData.guildOnly === CommandLocation.BOTH
      ) {
        global.push(command);
      }
    });

    for (const guild of guilds) {
      const guildID: string = guild[0];
      const guildCommands: Command[] = guild[1];
      if (guildCommands.length > 0) {
        void (await this.resolved.application?.commands.set(
          guildCommands.map((cmd: Command) => cmd.options),
          guildID,
        ));
      }
    }
    if (global.length > 0) {
      void (await this.resolved.application?.commands.set(global.map((cmd: Command) => cmd.options)));
    }
    return this.Commands;
  }

  /**
   * Set the function that is called before the client is ready.
   * @param method The function to call.
   * @param timeoutMs The timeout to wait before calling the function in seconds. It will retard the client launching.
   */
  public prepare(method: systemFunction, timeoutMs?: number): void {
    if (typeof method !== 'function') throw new Error('Invalid method provided.');

    if (!(timeout ?? undefined)) {
      if (typeof timeout !== 'number') throw new Error('Invalid timeout number.');

      this._prepareMethod = async (): Promise<void> => {
        return await timeout(method, timeoutMs);
      };
    }
    this._prepareMethod = method;
  }

  /**
   * Set the function that is called after the client is ready.
   * @param method The function to call.
   * @param timeoutMs The timeout to wait before calling the function in seconds.
   */
  public run(method: systemFunction, timeoutMs?: number): void {
    if (typeof method !== 'function') throw new Error('Invalid method provided.');

    if (!(timeout ?? undefined)) {
      if (typeof timeout !== 'number') throw new Error('Invalid timeout number.');

      this._readyMethod = async (): Promise<void> => {
        return await timeout(method, timeoutMs);
      };
    }
    this._readyMethod = method;
  }
}
