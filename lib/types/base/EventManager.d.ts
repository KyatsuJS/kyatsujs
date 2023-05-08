import { Collection } from 'discord.js';
import { KyaClient, EventCallback, Event } from './index';
/**
 * Represents the event manager for the Kyatsu service.
 */
export declare class EventManager {
    /**
     * The KyaClient instance.
     */
    readonly client: KyaClient;
    /**
     * The collection of the events.
     */
    private readonly _events;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client: KyaClient);
    /**
     * Add an event to the bot. Will be listened when the bot will be launched.
     * @param name The event name.
     * @param callback The function to be called back when the event is triggered.
     * @returns The bound event instance.
     */
    bindEvent(name: string, callback?: EventCallback): Event;
    /**
     * Unbind a specific event. Doesn't have any effect when the bot is launched.
     * @param name The event name.
     * @returns True if the command has been removed, or false if not.
     */
    unbindEvent(name: string): boolean;
    /**
     * Returns the list of bound events. If some events have been removed after the client launch, they won't appear.
     * @returns The list of bot events.
     */
    get events(): Collection<string, Event>;
}
