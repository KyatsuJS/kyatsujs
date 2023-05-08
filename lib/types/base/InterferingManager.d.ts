import { Snowflake } from 'discord.js';
import { KyaClient } from './index';
/**
 * Represents an element in the interfering commands queue.
 * Interfering commands are commands that are currently executing.
 */
export type InterferingQueueElement = [
    /**
     * The name of the command.
     */
    string,
    /**
     * The date when the command began.
     */
    number,
    /**
     * The ID of the interaction.
     */
    Snowflake
];
/**
 * The main class that manages the active cool downs for commands.
 */
export declare class InterferingManager {
    /**
     * The KyaClient instance.
     */
    readonly client: KyaClient;
    /**
     * The collection of the current cool downs.
     */
    private readonly _collection;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client: KyaClient);
    /**
     * Register an interfering command when this command is triggered.
     * @param userID The user ID of the command's author.
     * @param commandName The name of the command.
     * @param interactionID The ID of the interaction.
     * @returns Void.
     */
    registerInterfering(userID: Snowflake, commandName: string, interactionID: Snowflake): void;
    /**
     * Returns all the interfering commands for a specified user.
     * @param userID The user ID to search for.
     * @param commands The names of the commands to filter by.
     * @returns The full list of the user's cool downs.
     */
    interfering(userID: Snowflake, ...commands: string[]): InterferingQueueElement[];
    /**
     * Removes an interfering commands. If a name is passed, remove all the commands with that name.
     * If an ID is passed, remove the command with the same interaction ID.
     * @param userID The user ID to search for.
     * @param key The value to search for; either the name of the command or the interaction ID.
     * @returns Void.
     */
    removeInterfering(userID: Snowflake, key: string | Snowflake): void;
}
