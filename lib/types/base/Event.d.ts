import { Collection } from 'discord.js';
import { KyaClient } from './index';
/**
 * The model of a callback function for an event.
 * @param args The command args.
 */
export type EventCallback = (...args: any[]) => void;
/**
 * A default callback function used when nothing is set.
 * @param args The command args.
 * @returns Void.
 */
export declare function callbackDefault(...args: any[]): Promise<void>;
/**
 * Represents an Event on Kyatsu service.
 */
export declare class Event {
    /**
     * The KyaClient instance.
     */
    readonly client: KyaClient;
    /**
     * The event name.
     */
    readonly name: string;
    /**
     * The callback function.
     */
    private _callback;
    /**
     * @param client The KyaClient instance.
     * @param name The event name.
     */
    constructor(client: KyaClient, name: string);
    /**
     * Call the callback function of an event.
     * @returns Void.
     */
    call(): Promise<void>;
    /**
     * Set the call back function for the event. This function is called when the event is triggered.
     * @param callback The function to set.
     */
    set setCallback(callback: EventCallback);
    /**
     * Returns the callback defined for the current event instance.
     * @returns The function associated with the command.
     */
    get callback(): EventCallback;
}
/**
 * The collection that includes the default callback functions for basic events.
 */
export declare const defaultEventsCb: Collection<string, EventCallback>;
