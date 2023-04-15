import { Client, ClientOptions } from 'discord.js';
import { CommandManager } from './CommandManager';
import { EventManager } from './EventManager';
/**
 * Represents the default events list.
 */
export type availableEvent = 'ready' | 'interactionCreate';
/**
 * The KyaClient structure properties.
 */
export interface KyaOptions extends ClientOptions {
    /**
     * The client token.
     */
    token?: string | undefined;
    /**
     * The default events to bind among the available ones. See the availableEvent type.
     */
    defaultEvents?: availableEvent[];
}
/**
 * The class that represents an instance of KyaClient. It extends the Discord.<Client> class.
 */
export declare class KyaClient extends Client {
    /**
     * The command manager instance.
     */
    readonly Commands: CommandManager;
    /**
     * The event manager instance.
     */
    readonly Events: EventManager;
    /**
     * The client token.
     */
    private readonly _token;
    /**
     * Whether the client should load commands or not. Load commands means sending commands to the API.
     * Don't activate this permanently, it's only on change.
     */
    _load: boolean;
    /**
     * @param options The ClientOptions of the client (Discord.<ClientOptions>).
     */
    constructor(options: KyaOptions);
    /**
     * Create a KyaClient instance and returns it; using multiple possibles as arguments.
     * @param {KyaOptions | string | any} options The options or the token. If the token only is passed, default options are taken.
     * @returns {KyaClient} The KyaClient instance.
     */
    static init(options: KyaOptions | string | undefined): KyaClient;
    /**
     * Launch the client after bounding events and sending commands to the API, if necessary.
     * Returns a simple string.
     * @param token The client token, if not specified before.
     * @returns A string constant "Logged in.".
     */
    login(token?: string): Promise<string>;
    /**
     * A private function that load commands.
     * @private
     * @returns The command manager instance of the client.
     */
    private loadCommands;
}
