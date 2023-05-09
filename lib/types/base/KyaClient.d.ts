import { Client, ClientOptions } from 'discord.js';
import { CommandManager, EventManager, KyaClientAppearance } from './index';
import { VoiceManager } from '../modules';
/**
 * Represents the default events list.
 */
export type AvailableEvent = 'ready' | 'interactionCreate';
/**
 * Represents a system function.
 * @param client The client instance.
 * @param args The arguments to pass to the function.
 * @returns The function result.
 */
export type SystemFunction = (client: KyaClient, bot: typeof KyaClient.prototype.resolved, ...args: any[]) => Promise<any | void> | any | void;
/**
 * The KyaClient structure properties.
 */
export interface KyaOptions extends ClientOptions {
    /**
     * The client token.
     */
    token?: string | undefined;
    /**
     * The default events to bind among the available ones. See the AvailableEvent type.
     */
    defaultEvents?: AvailableEvent[];
}
/**
 * The class that represents an instance of KyaClient. It extends the Discord.<Client> class.
 */
export declare class KyaClient {
    /**
     * The Discord Client instance.
     */
    readonly resolved: Client;
    /**
     * The command manager instance.
     */
    readonly Commands: CommandManager;
    /**
     * The event manager instance.
     */
    readonly Events: EventManager;
    /**
     * The voice manager instance.
     */
    readonly Voice: VoiceManager;
    /**
     * The client token.
     */
    private readonly _token;
    /**
     * Whether the client should load commands or not. Load commands means sending commands to the API.
     * Don't activate this permanently, it's only on change.
     */
    private _load;
    /**
     * The client appearance manager.
     */
    readonly Appearance: KyaClientAppearance;
    /**
     * The function that is called before the client is ready. This is called before the commands are loaded (if enabled).
     * Also, this is called before the events are bound.
     */
    private _prepareMethod;
    /**
     * The function that is called after the client is ready.
     */
    private _readyMethod;
    /**
     * @param options The ClientOptions of the client (Discord.<ClientOptions>).
     */
    constructor(options: KyaOptions);
    /**
     * Set the commands loading to the API value (true/false).
     * @param value The value to set.
     */
    set setLoad(value: boolean);
    /**
     * Returns if the commands loading to the API is enabled or not.
     * @returns True if the commands loading is enabled, or false if not.
     */
    get load(): boolean;
    /**
     * Create a KyaClient instance and returns it; using multiple possibles as arguments.
     * @param options The options or the token. If the token only is passed, default options are taken.
     * @returns The KyaClient instance.
     */
    static init(options: KyaOptions | string): KyaClient;
    /**
     * Launch the client after bounding events and sending commands to the API, if necessary.
     * Returns a simple string.
     * @param token The client token, if not specified before.
     * @returns A string constant "Logged in.".
     */
    login(token?: string): Promise<string>;
    /**
     * A private function that load commands.
     * @returns The command manager instance of the client.
     */
    private loadCommands;
    /**
     * Set the function that is called before the client is ready.
     * @param method The function to call.
     * @param timeoutMs The timeout to wait before calling the function in seconds. It will retard the client launching.
     */
    prepare(method: SystemFunction, timeoutMs?: number): void;
    /**
     * Set the function that is called after the client is ready.
     * @param method The function to call.
     * @param timeoutMs The timeout to wait before calling the function in seconds.
     */
    run(method: SystemFunction, timeoutMs?: number): void;
}
