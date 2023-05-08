import { ApplicationCommand, Collection, GuildResolvable } from 'discord.js';

import { Command, CommandCallback, CommandOptions, CoolDownManager, InterferingManager, KyaClient } from './index';

/**
 * Represents the command manager of Kyatsu.
 */
export class CommandManager {
  /**
   * The client instance.
   */
  public readonly client: KyaClient;
  /**
   * The cool down manager instance, to have access to the different delays of the current commands.
   */
  public readonly CoolDowns: CoolDownManager;
  /**
   * The interfering manager instance, to have access to the different executing commands.
   */
  public readonly Interfering: InterferingManager;
  /**
   * The collection of the commands.
   */
  private readonly _commands: Collection<string, Command>;

  /**
   * @param client The KyaClient instance.
   */
  constructor(client: KyaClient) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');

    this.client = client;
    this.CoolDowns = new CoolDownManager(this.client);
    this.Interfering = new InterferingManager(this.client);
    this._commands = new Collection();
  }

  /**
   * Create a command based on the name and/or some options, and returns it.
   * @param data The name and/or the options.
   * @returns The command instance.
   */
  public create(data: string | CommandOptions): Command {
    if (!data) throw new Error('Invalid command data provided.');
    if (typeof data !== 'string' && typeof data !== 'object') {
      throw new Error('Invalid command data provided. It must be a string or an object.');
    }

    if (typeof data === 'string') {
      data = {
        options: {
          name: data,
          description: 'No description provided.',
        },
      };
    } else if (typeof data !== 'object') {
      throw new Error('Invalid command data provided. It must be a string or an object.');
    }
    if (!data.options.type) data.options.type = 1;
    if (!data.options.name) {
      throw new Error('Invalid command name provided.');
    }

    const desc: string = data.options?.description;
    if (!desc) {
      data.options.description = 'No description provided.';
    }

    return new Command(this.client, data.options.name, data.options, data.metaData, data.additional);
  }

  /**
   * Add a command to the KyaClient (the bot) using the name, options or the command itself.
   * If no command is passed, the function creates one based on the data passed.
   * @param data The options passed (name, command options, command instance).
   * @param callback? The callback function if the data passed are not a command instance. If nothing passed, use default.
   * @returns The command manager instance (this).
   */
  public add(data: string | CommandOptions | Command, callback?: CommandCallback): CommandManager {
    if (data instanceof Command) {
      this._commands.set(data.options.name, data);
      return this;
    }
    const command: Command = this.create(data);
    if (callback) {
      if (typeof callback !== 'function') throw new Error('Invalid callback provided. It must be a function.');
      command.setRun = callback;
    }
    this._commands.set(command.options.name, command);
    return this;
  }

  /**
   * Remove a command from the bot.
   * @param name The command name.
   * @returns The command manager instance (this).
   */
  public remove(name: string): CommandManager {
    if (!name || typeof name !== 'string') throw new Error('Invalid command name provided.');

    this._commands.delete(name);
    return this;
  }

  /**
   * Load the command of the bot (those in the cache) and send it to the API.
   * Use it only when you finished to add all the commands you want to.
   * @returns Void.
   */
  public load(): void {
    this.client.setLoad = true;
  }

  /**
   * Get a command from the cache with the name.
   * @param name The command name.
   * @returns The found command instance, or undefined.
   */
  public getCommand(name: string): Command | undefined {
    if (!name || typeof name !== 'string') throw new Error('Invalid command name provided.');

    return this.commands.get(name);
  }

  /**
   * Get the client commands. The client commands are the commands hosted on the API, not from the cache.
   * @returns The bot API commands list, or undefined.
   */
  public get clientCommands(): Promise<Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>> | undefined {
    return this.client.resolved.application?.commands.fetch();
  }

  /**
   * Return the list of cache commands.
   * @returns The list of cache commands.
   */
  public get commands(): CommandManager['_commands'] {
    return this._commands;
  }
}
