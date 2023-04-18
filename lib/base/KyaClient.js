"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyaClient = void 0;
const discord_js_1 = require("discord.js");
const CommandManager_1 = require("./CommandManager");
const EventManager_1 = require("./EventManager");
const Command_1 = require("./Command");
const Discord = __importStar(require("discord.js"));
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
     * @param options The ClientOptions of the client (Discord.<ClientOptions>).
     */
    constructor(options) {
        if (!options || typeof options !== 'object')
            throw new Error('Invalid options provided.');
        this.Commands = new CommandManager_1.CommandManager(this);
        this.Events = new EventManager_1.EventManager(this);
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
        if (!options
            || (options && typeof options !== 'object' && typeof options !== 'string'))
            throw new Error('Invalid options provided.');
        let defaultOptions = {
            failIfNotExists: false,
            intents: [Discord.GatewayIntentBits.Guilds],
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
        this.Events.events.each((event) => {
            const method = event.name === 'ready' ? 'once' : 'on';
            this[method](event.name, (...args) => {
                event.callback(this, ...args);
            });
        });
        await this.resolved.login(token || this._token);
        if (this._load) {
            this.loadCommands();
        }
        return 'Logged in.';
    }
    /**
     * A private function that load commands.
     * @returns The command manager instance of the client.
     */
    loadCommands() {
        const clientApplication = this.resolved.application;
        if (!clientApplication) {
            throw new Error('Invalid client application provided.');
        }
        const guilds = new discord_js_1.Collection();
        const global = [];
        this.Commands.commands.each((command) => {
            if (command.metaData.guildOnly === Command_1.CommandLocation.GUILD_ONLY ||
                command.metaData.guildOnly === Command_1.CommandLocation.BOTH) {
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
            else if (command.metaData.guildOnly === Command_1.CommandLocation.GLOBAL ||
                command.metaData.guildOnly === Command_1.CommandLocation.BOTH) {
                global.push(command);
            }
        });
        for (const guild of guilds) {
            const guildID = guild[0];
            const guildCommands = guild[1];
            if (guildCommands.length > 0) {
                this.resolved.application?.commands.set(guildCommands.map((cmd) => cmd.options), guildID);
            }
        }
        if (global.length > 0) {
            this.resolved.application?.commands.set(global.map((cmd) => cmd.options));
        }
        return this.Commands;
    }
}
exports.KyaClient = KyaClient;
