import { Collection } from 'discord.js';

import { KyaClient, eventCallback, Event, defaultEventsCb, callbackDefault } from './index';

/**
 * Represents the event manager for the Kyatsu service.
 */
export class EventManager {
  /**
   * The KyaClient instance.
   */
  public readonly client: KyaClient;
  /**
   * The collection of the events.
   */
  private readonly _events: Collection<string, Event>;

  /**
   * @param client The KyaClient instance.
   */
  constructor(client: KyaClient) {
    if (!client || !(client instanceof KyaClient)) throw new Error('Invalid client provided.');

    this.client = client;
    this._events = new Collection();
  }

  /**
   * Add an event to the bot. Will be listened when the bot will be launched.
   * @param name The event name.
   * @param callback The function to be called back when the event is triggered.
   * @returns The bound event instance.
   */
  public bindEvent(name: string, callback?: eventCallback): Event {
    if (!name || typeof name !== 'string') throw new Error('Invalid event name provided.');

    const event: Event = new Event(this.client, name);
    if (callback && typeof callback === 'function') event.setCallback = callback;
    else if (!callback) event.setCallback = defaultEventsCb.get(name) || callbackDefault;

    this._events.set(name, event);
    return event;
  }

  /**
   * Unbind a specific event. Doesn't have any effect when the bot is launched.
   * @param name The event name.
   * @returns True if the command has been removed, or false if not.
   */
  public unbindEvent(name: string): boolean {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid event name provided.');
    }
    return this._events.delete(name);
  }

  /**
   * Returns the list of bound events. If some events have been removed after the client launch, they won't appear.
   * @returns The list of bot events.
   */
  public get events(): Collection<string, Event> {
    return this._events;
  }
}
