"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyaClient = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("./index");
const tools_1 = require("../tools");
/**
 * The class that represents an instance of KyaClient. It extends the Discord.<Client> class.
 */
class KyaClient {
    /**
     * The Discord Client instance.
     */
    resolved;
    /**
     * The command manager instance.
     */
    Commands;
    /**
     * The event manager instance.
     */
    Events;
    /**
     * The client token.
     */
    _token;
    /**
     * Whether the client should load commands or not. Load commands means sending commands to the API.
     * Don't activate this permanently, it's only on change.
     */
    _load = false;
    /**
     * The client appearance manager.
     */
    Appearance = new index_1.KyaClientAppearance(this);
    /**
     * The function that is called before the client is ready. This is called before the commands are loaded (if enabled).
     * Also, this is called before the events are bound.
     */
    _prepareMethod = async () => {
        return;
    };
    /**
     * The function that is called after the client is ready.
     */
    _readyMethod = async () => {
        return;
    };
    /**
     * @param options The ClientOptions of the client (Discord.<ClientOptions>).
     */
    constructor(options) {
        if (!options || typeof options !== 'object')
            throw new Error('Invalid options provided.');
        this.Commands = new index_1.CommandManager(this);
        this.Events = new index_1.EventManager(this);
        this._token = options.token || undefined;
        this.resolved = new discord_js_1.Client(options);
        this.Events.bindEvent('ready');
    }
    /**
     * Set the commands loading to the API value (true/false).
     * @param value The value to set.
     */
    set setLoad(value) {
        if (typeof value !== 'boolean')
            throw new Error('Invalid value provided.');
        this._load = value;
    }
    /**
     * Returns if the commands loading to the API is enabled or not.
     * @returns True if the commands loading is enabled, or false if not.
     */
    get load() {
        return this._load;
    }
    /**
     * Create a KyaClient instance and returns it; using multiple possibles as arguments.
     * @param options The options or the token. If the token only is passed, default options are taken.
     * @returns The KyaClient instance.
     */
    static init(options) {
        if (!options || (options && typeof options !== 'object' && typeof options !== 'string'))
            throw new Error('Invalid options provided.');
        let defaultOptions = {
            failIfNotExists: false,
            intents: 3276799,
            defaultEvents: ['ready'],
        };
        if (typeof options === 'string') {
            defaultOptions.token = options;
        }
        else if (typeof options === 'object') {
            defaultOptions = Object.assign(defaultOptions, options);
        }
        return new KyaClient(defaultOptions);
    }
    /**
     * Launch the client after bounding events and sending commands to the API, if necessary.
     * Returns a simple string.
     * @param token The client token, if not specified before.
     * @returns A string constant "Logged in.".
     */
    async login(token) {
        if (!token && !this._token)
            throw new Error('No token provided.');
        if (token && typeof token !== 'string')
            throw new Error('Invalid token provided.');
        await this._prepareMethod(this, this.resolved, ...arguments);
        this.Events.events.each((event) => {
            const method = event.name === 'ready' ? 'once' : 'on';
            this.resolved[method](event.name, (...args) => {
                event.callback(this, ...args);
            });
        });
        const logged = await this.resolved.login(token || this._token);
        if (this._load) {
            await this.loadCommands();
        }
        while (!this.resolved.readyAt) {
            await (0, tools_1.timeout)(() => null, 250);
        }
        await this._readyMethod(this, this.resolved, ...arguments);
        return logged;
    }
    /**
     * A private function that load commands.
     * @returns The command manager instance of the client.
     */
    async loadCommands() {
        const clientApplication = this.resolved.application;
        if (!clientApplication) {
            throw new Error('Invalid client application provided.');
        }
        const guilds = new discord_js_1.Collection();
        const global = [];
        this.Commands.commands.each((command) => {
            if (command.metaData.guildOnly === index_1.CommandLocation.GUILD_ONLY ||
                command.metaData.guildOnly === index_1.CommandLocation.BOTH) {
                for (const guildID of command.metaData.guilds || []) {
                    if (!guilds.has(guildID)) {
                        // @ts-ignore
                        guilds.set(guildID, []);
                    }
                    // @ts-ignore
                    const guildCommands = guilds.get(guildID);
                    if (!guildCommands)
                        continue;
                    guildCommands.push(command);
                    guilds.set(guildID, guildCommands);
                }
            }
            else if (command.metaData.guildOnly === index_1.CommandLocation.GLOBAL ||
                command.metaData.guildOnly === index_1.CommandLocation.BOTH) {
                global.push(command);
            }
        });
        for (const guild of guilds) {
            const guildID = guild[0];
            const guildCommands = guild[1];
            if (guildCommands.length > 0) {
                void (await this.resolved.application?.commands.set(guildCommands.map((cmd) => cmd.options), guildID));
            }
        }
        if (global.length > 0) {
            void (await this.resolved.application?.commands.set(global.map((cmd) => cmd.options)));
        }
        return this.Commands;
    }
    /**
     * Set the function that is called before the client is ready.
     * @param method The function to call.
     * @param timeoutMs The timeout to wait before calling the function in seconds. It will retard the client launching.
     */
    prepare(method, timeoutMs) {
        if (typeof method !== 'function')
            throw new Error('Invalid method provided.');
        if (!(tools_1.timeout ?? undefined)) {
            if (typeof tools_1.timeout !== 'number')
                throw new Error('Invalid timeout number.');
            this._prepareMethod = async () => {
                return await (0, tools_1.timeout)(method, timeoutMs);
            };
        }
        this._prepareMethod = method;
    }
    /**
     * Set the function that is called after the client is ready.
     * @param method The function to call.
     * @param timeoutMs The timeout to wait before calling the function in seconds.
     */
    run(method, timeoutMs) {
        if (typeof method !== 'function')
            throw new Error('Invalid method provided.');
        if (!(tools_1.timeout ?? undefined)) {
            if (typeof tools_1.timeout !== 'number')
                throw new Error('Invalid timeout number.');
            this._readyMethod = async () => {
                return await (0, tools_1.timeout)(method, timeoutMs);
            };
        }
        this._readyMethod = method;
    }
}
exports.KyaClient = KyaClient;
