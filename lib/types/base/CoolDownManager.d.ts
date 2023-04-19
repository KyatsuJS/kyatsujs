import { Snowflake } from 'discord.js';
import { KyaClient } from './index';
import { CreateAnonymeArray, NumRange } from '../tools';
/**
 * Represents an element in the cool downs queue.
 */
export type coolDownsQueueElement = [
    /**
     * The name of the command.
     */
    string,
    /**
     * The end time of the cool down.
     */
    number,
    /**
     * The cool down amount.
     */
    NumRange<CreateAnonymeArray<0>, 300>
];
/**
 * The main class that manages the active cool downs for commands.
 */
export declare class CoolDownManager {
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
     * Register a cool down when a command is triggered.
     * @param userID The user ID of the command's author.
     * @param commandName The name of the command.
     * @param coolDown The cool down amount (waiting time before executing it again).
     * @returns Void.
     */
    registerCoolDown(userID: Snowflake, commandName: string, coolDown: NumRange<CreateAnonymeArray<0>, 300>): void;
    /**
     * Returns all the cool downs for a specified user.
     * @param userID The user ID to search for.
     * @param commandName The name of the command to filter by.
     * @returns The full list of the user's cool downs.
     */
    coolDowns(userID: Snowflake, commandName?: string): coolDownsQueueElement[];
}
