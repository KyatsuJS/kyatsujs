import { Collection, Snowflake } from 'discord.js';

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
export class InterferingManager {
  /**
   * The KyaClient instance.
   */
  public client: KyaClient;
  /**
   * The collection of the current cool downs.
   */
  private readonly _collection: Collection<Snowflake, interferingQueueElement[]>;

  /**
   * @param client The KyaClient instance.
   */
  constructor(client: KyaClient) {
    if (!client) throw new Error('Invalid client provided.');

    this.client = client;
    this._collection = new Collection();
  }

  /**
   * Register an interfering command when this command is triggered.
   * @param userId The user ID of the command's author.
   * @param commandName The name of the command.
   * @param interactionId The ID of the interaction.
   * @returns Void.
   */
  public registerInterfering(userId: Snowflake, commandName: string, interactionId: Snowflake): void {
    const startTime: number = Date.now();
    const currentCoolDowns: interferingQueueElement[] = this.interfering(userId);

    currentCoolDowns.push([commandName, startTime, interactionId]);

    this._collection.set(userId, currentCoolDowns);
  }

  /**
   * Returns all the interfering commands for a specified user.
   * @param userId The user ID to search for.
   * @param commands The names of the commands to filter by.
   * @returns The full list of the user's cool downs.
   */
  public interfering(userId: Snowflake, ...commands: string[]): interferingQueueElement[] {
    const currentInterfering: interferingQueueElement[] | [] = this._collection.get(userId) || [];

    if (commands.length > 0) {
      return currentInterfering.filter((queueElement: interferingQueueElement): boolean => {
        return commands.includes(queueElement[0]);
      });
    }
    return currentInterfering;
  }

  /**
   * Removes an interfering commands. If a name is passed, remove all the commands with that name.
   * If an ID is passed, remove the command with the same interaction ID.
   * @param userId The user ID to search for.
   * @param key The value to search for; either the name of the command or the interaction ID.
   * @returns Void.
   */
  public removeInterfering(userId: Snowflake, key: string | Snowflake): void {
    if (!key) throw new Error('Invalid key provided.');

    const currentInterfering: interferingQueueElement[] = this.interfering(userId);
    const interferingNames: string[] = currentInterfering.map((queueElement: interferingQueueElement): string => {
      return queueElement[0];
    });
    const interferingIds: Snowflake[] = currentInterfering.map((queueElement: interferingQueueElement): Snowflake => {
      return queueElement[2];
    });

    if (interferingNames.includes(key as string)) {
      this._collection.set(
        userId,
        currentInterfering.filter((queueElement: interferingQueueElement): boolean => {
          return queueElement[0] !== key;
        }),
      );
    } else {
      this._collection.set(
        userId,
        currentInterfering.filter((queueElement: interferingQueueElement): boolean => {
          return queueElement[2] !== key;
        }),
      );
    }
  }
}
