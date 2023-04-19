import { ApplicationCommand, Collection, GuildResolvable } from 'discord.js';
import { Command, commandCallback, CommandOptions, CoolDownManager, InterferingManager, KyaClient } from './index';
/**
 * Represents the command manager of Kyatsu.
 */
export declare class CommandManager {
    /**
     * The client instance.
     */
    readonly client: KyaClient;
    /**
     * The cool down manager instance, to have access to the different delays of the current commands.
     */
    readonly CoolDowns: CoolDownManager;
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    readonly Interfering: InterferingManager;
    /**
     * The collection of the commands.
     */
    private readonly _commands;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client: KyaClient);
    /**
     * Create a command based on the name and/or some options, and returns it.
     * @param data The name and/or the options.
     * @returns The command instance.
     */
    create(data: string | CommandOptions): Command;
    /**
     * Add a command to the KyaClient (the bot) using the name, options or the command itself.
     * If no command is passed, the function creates one based on the data passed.
     * @param data The options passed (name, command options, command instance).
     * @param callback? The callback function if the data passed are not a command instance. If nothing passed, use default.
     * @returns The command manager instance (this).
     */
    add(data: string | CommandOptions | Command, callback?: commandCallback): CommandManager;
    /**
     * Remove a command from the bot.
     * @param name The command name.
     * @returns The command manager instance (this).
     */
    remove(name: string): CommandManager;
    /**
     * Load the command of the bot (those in the cache) and send it to the API.
     * Use it only when you finished to add all the commands you want to.
     * @returns Void.
     */
    load(): void;
    /**
     * Get a command from the cache with the name.
     * @param name The command name.
     * @returns The found command instance, or undefined.
     */
    getCommand(name: string): Command | undefined;
    /**
     * Get the client commands. The client commands are the commands hosted on the API, not from the cache.
     * @returns The bot API commands list, or undefined.
     */
    get clientCommands(): Promise<Collection<string, ApplicationCommand<{
        guild: GuildResolvable;
    }>>> | undefined;
    /**
     * Return the list of cache commands.
     * @returns The list of cache commands.
     */
    get commands(): CommandManager['_commands'];
}
