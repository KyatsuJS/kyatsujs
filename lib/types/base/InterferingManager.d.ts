import { Snowflake } from 'discord.js';
import { KyaClient } from './KyaClient';
/**
 * Represents an element in the interfering commands queue. Interfering commands are commands that are currently executing.
 * @property 0 The name of the command.
 * @property 1 The date when the command began.
 * @property 2 The ID of the interaction.
 */
export type interferingQueueElement = [string, number, Snowflake];
/**
 * The main class that manages the active cool downs for commands.
 */
export declare class InterferingManager {
    /**
     * The KyaClient instance.
     */
    client: KyaClient;
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
     * @param userId The user ID of the command's author.
     * @param commandName The name of the command.
     * @param interactionId The ID of the interaction.
     * @returns Void.
     */
    registerInterfering(userId: Snowflake, commandName: string, interactionId: Snowflake): void;
    /**
     * Returns all the interfering commands for a specified user.
     * @param userId The user ID to search for.
     * @param commands The names of the commands to filter by.
     * @returns The full list of the user's cool downs.
     */
    interfering(userId: Snowflake, ...commands: string[]): interferingQueueElement[];
    /**
     * Removes an interfering commands. If a name is passed, remove all the commands with that name.
     * If an ID is passed, remove the command with the same interaction ID.
     * @param userId The user ID to search for.
     * @param key The value to search for; either the name of the command or the interaction ID.
     * @returns Void.
     */
    removeInterfering(userId: Snowflake, key: string | Snowflake): void;
}
