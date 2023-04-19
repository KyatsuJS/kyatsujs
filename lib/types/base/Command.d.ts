import { ChatInputApplicationCommandData, ChatInputCommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import { KyaClient } from './index';
import { Context } from '../services';
import { CreateAnonymeArray, NumRange } from '../tools';
/**
 * Where the command should be executed.
 */
export declare enum CommandLocation {
    /**
     * The command will be sent in the global commands.
     */
    GLOBAL = 0,
    /**
     * The command will be sent in one or few guilds.
     */
    GUILD_ONLY = 1,
    /**
     * The command will be sent in both places.
     */
    BOTH = 2
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
export declare const defaultMetaData: MetaData;
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
export type commandCallback = (command: Command, interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction) => Promise<void>;
/**
 * Represents the basic command interaction.
 */
export declare class Command {
    /**
     * The client instance.
     */
    readonly client: KyaClient;
    /**
     * The name of the command.
     */
    readonly name: string;
    /**
     * The options to implement with the command.
     */
    readonly options: ChatInputApplicationCommandData;
    /**
     * The options associated with Kyatsu services (cool down, permissions...).
     */
    readonly metaData: MetaData;
    /**
     * The options to pass if you want to store some personal information.
     */
    readonly additional: object;
    /**
     * The context of the command, to use interactions with Discord.
     */
    private _ctx;
    /**
     * The function to call when the command is executed.
     */
    private _run;
    /**
     * @param client The KyaClient instance.
     * @param name The name of the command.
     * @param options The options to implement with the command.
     * @param metaData The options associated with Kyatsu services (cool down, permissions...).
     * @param additional The options to pass if you want to store some personal information.
     */
    constructor(client: KyaClient, name: string, options: ChatInputApplicationCommandData, metaData?: MetaData, additional?: object);
    /**
     * Set the context of the command.
     * @param ctx The context instance.
     */
    set setContext(ctx: Context);
    /**
     * Set the function to be call back when the command is executed.
     * @param callback The function to call.
     */
    set setRun(callback: commandCallback);
    /**
     * Get the context of the command.
     * @returns The context of the command.
     */
    get ctx(): Context;
    /**
     * Execute the command call back function.
     * @param interaction The interaction associated with the command.
     * @returns Void.
     */
    run(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction): Promise<void>;
    /**
     * End the command. Call it when you want the command to be considered as finished and remove it from the interfering queue.
     * @returns Void.
     */
    end(): void;
}
