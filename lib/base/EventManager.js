"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const discord_js_1 = require("discord.js");
const Event_1 = require("./Event");
const KyaClient_1 = require("./KyaClient");
/**
 * Represents the event manager for the Kyatsu service.
 */
class EventManager {
    /**
     * The KyaClient instance.
     */
    client;
    /**
     * The collection of the events.
     */
    _events;
    /**
     * @param client The KyaClient instance.
     */
    constructor(client) {
        if (!client || !(client instanceof KyaClient_1.KyaClient))
            throw new Error('Invalid client provided.');
        this.client = client;
        this._events = new discord_js_1.Collection();
    }
    /**
     * Add an event to the bot. Will be listened when the bot will be launched.
     * @param name The event name.
     * @param callback The function to be called back when the event is triggered.
     * @returns The bound event instance.
     */
    bindEvent(name, callback) {
        if (!name || typeof name !== 'string')
            throw new Error('Invalid event name provided.');
        const event = new Event_1.Event(this.client, name);
        if (callback && typeof callback === 'function')
            event.setCallback = callback;
        else if (!callback)
            event.setCallback = Event_1.defaultEventsCb.get(name) || Event_1.callbackDefault;
        this._events.set(name, event);
        return event;
    }
    /**
     * Unbind a specific event. Doesn't have any effect when the bot is launched.
     * @param name The event name.
     * @returns True if the command has been removed, or false if not.
     */
    unbindEvent(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Invalid event name provided.');
        }
        return this._events.delete(name);
    }
    /**
     * Returns the list of bound events. If some events have been removed after the client launch, they won't appear.
     * @returns The list of bot events.
     */
    get events() {
        return this._events;
    }
}
exports.EventManager = EventManager;
