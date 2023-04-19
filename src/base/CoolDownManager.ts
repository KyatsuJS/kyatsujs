import { Collection, Snowflake, SnowflakeUtil } from 'discord.js';

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
  NumRange<CreateAnonymeArray<0>, 300>,
];

/**
 * The main class that manages the active cool downs for commands.
 */
export class CoolDownManager {
  /**
   * The KyaClient instance.
   */
  public readonly client: KyaClient;
  /**
   * The collection of the current cool downs.
   */
  private readonly _collection: Collection<Snowflake, coolDownsQueueElement[]>;

  /**
   * @param client The KyaClient instance.
   */
  constructor(client: KyaClient) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');

    this.client = client;
    this._collection = new Collection();
  }

  /**
   * Register a cool down when a command is triggered.
   * @param userID The user ID of the command's author.
   * @param commandName The name of the command.
   * @param coolDown The cool down amount (waiting time before executing it again).
   * @returns Void.
   */
  public registerCoolDown(
    userID: Snowflake,
    commandName: string,
    coolDown: NumRange<CreateAnonymeArray<0>, 300>,
  ): void {
    if (!userID || typeof userID !== 'string') throw new Error('Invalid user ID provided.');
    if (!commandName || typeof commandName !== 'string') throw new Error('Invalid command name provided.');
    if ((coolDown ?? undefined) || typeof coolDown !== 'number') throw new Error('Invalid cool down provided.');

    const endTime: number = Date.now() + coolDown * 1000;
    const currentCoolDowns: coolDownsQueueElement[] = this.coolDowns(userID);

    currentCoolDowns.push([commandName, endTime, coolDown]);

    this._collection.set(userID, currentCoolDowns);
  }

  /**
   * Returns all the cool downs for a specified user.
   * @param userID The user ID to search for.
   * @param commandName The name of the command to filter by.
   * @returns The full list of the user's cool downs.
   */
  public coolDowns(userID: Snowflake, commandName?: string): coolDownsQueueElement[] {
    if (!userID || typeof userID !== 'string') throw new Error('Invalid user ID provided.');
    if (commandName && typeof commandName !== 'string') throw new Error('Invalid command name provided.');

    let currentCoolDowns: coolDownsQueueElement[] | [] = this._collection.get(userID) || [];

    const currentTime: number = Date.now();
    currentCoolDowns = currentCoolDowns.filter((queueElement: coolDownsQueueElement): boolean => {
      return currentTime < queueElement[1];
    });
    this._collection.set(userID, currentCoolDowns);

    if (commandName) {
      return currentCoolDowns.filter((queueElement: coolDownsQueueElement): boolean => {
        return queueElement[0] === commandName;
      });
    }
    return currentCoolDowns;
  }
}
