import { Client, Collection, BaseInteraction } from 'discord.js';

import { Command, KyaClient } from './index';
import { log } from '../tools';

/**
 * The model of a callback function for an event.
 * @param args The command args.
 */
export type eventCallback = (...args: any[]) => void;

/**
 * A default callback function used when nothing is set.
 * @param args The command args.
 * @returns Void.
 */
export async function callbackDefault(...args: any[]): Promise<void> {
  return;
}

/**
 * Represents an Event on Kyatsu service.
 */
export class Event {
  /**
   * The KyaClient instance.
   */
  public readonly client: KyaClient;
  /**
   * The event name.
   */
  public readonly name: string;
  /**
   * The callback function.
   */
  private _callback: eventCallback;

  /**
   * @param client The KyaClient instance.
   * @param name The event name.
   */
  constructor(client: KyaClient, name: string) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');
    if (!name || typeof name !== 'string') throw new Error('Invalid event name provided.');

    this.client = client;
    this.name = name;
    this._callback = callbackDefault;
  }

  /**
   * Call the callback function of an event.
   * @returns Void.
   */
  public async call(): Promise<void> {
    await this._callback(...arguments);
  }

  /**
   * Set the call back function for the event. This function is called when the event is triggered.
   * @param callback The function to set.
   */
  set setCallback(callback: eventCallback) {
    if (typeof callback !== 'function') {
      throw new Error('Invalid callback provided.');
    }
    this._callback = callback;
  }

  /**
   * Returns the callback defined for the current event instance.
   * @returns The function associated with the command.
   */
  get callback(): eventCallback {
    return this._callback;
  }
}

/**
 * The collection that includes the default callback functions for basic events.
 */
export const defaultEventsCb: Collection<string, eventCallback> = new Collection();

defaultEventsCb.set('ready', (client: KyaClient): void => {
  log(`Logged in as ${(client.resolved as Client<true>).user.tag}.`);
});

defaultEventsCb.set('interactionCreate', async (client: KyaClient, interaction: BaseInteraction): Promise<void> => {
  if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
    const command: Command | undefined = client.Commands.getCommand(interaction.commandName);
    if (!command) return;
    await command.run(interaction);
  }
});
