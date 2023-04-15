import { Collection, Snowflake } from 'discord.js';

import { KyaClient } from './KyaClient';
import { CreateAnonymeArray, NumRange } from "../tools";

/**
 * Represents an element in the cool downs queue.
 * @property 0 The name of the command.
 * @property 1 The end time of the cool down.
 * @property 2 The cool down amount.
 */
export type coolDownsQueueElement = [string, number, NumRange<CreateAnonymeArray<0>, 300>];

/**
 * The main class that manages the active cool downs for commands.
 */
export class CoolDownManager {
  /**
   * The KyaClient instance.
   */
  public client: KyaClient;
  /**
   * The collection of the current cool downs.
   */
  private readonly _collection: Collection<Snowflake, coolDownsQueueElement[]>;

  /**
   * @param client The KyaClient instance.
   */
  constructor(client: KyaClient) {
    if (!client) throw new Error('Invalid client provided.');

    this.client = client;
    this._collection = new Collection();
  }

  /**
   * Register a cool down when a command is triggered.
   * @param userId The user ID of the command's author.
   * @param commandName The name of the command.
   * @param coolDown The cool down amount (waiting time before executing it again).
   * @returns Void.
   */
  public registerCoolDown(userId: Snowflake, commandName: string, coolDown: NumRange<CreateAnonymeArray<0>, 300>): void {
    const endTime: number = Date.now() + coolDown * 1000;
    const currentCoolDowns: coolDownsQueueElement[] = this.coolDowns(userId);

    currentCoolDowns.push([commandName, endTime, coolDown]);

    this._collection.set(userId, currentCoolDowns);
  }

  /**
   * Returns all the cool downs for a specified user.
   * @param userId The user ID to search for.
   * @param commandName The name of the command to filter by.
   * @returns The full list of the user's cool downs.
   */
  public coolDowns(userId: Snowflake, commandName?: string): coolDownsQueueElement[] {
    let currentCoolDowns: coolDownsQueueElement[] | [] = this._collection.get(userId) || [];

    const currentTime: number = Date.now();
    currentCoolDowns = currentCoolDowns.filter((queueElement: coolDownsQueueElement): boolean => {
      return currentTime < queueElement[1];
    });
    this._collection.set(userId, currentCoolDowns);

    if (commandName) {
      return currentCoolDowns.filter((queueElement: coolDownsQueueElement): boolean => {
        return queueElement[0] === commandName;
      });
    }
    return currentCoolDowns;
  }
}
