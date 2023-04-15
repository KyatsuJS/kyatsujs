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
class KyaClient extends discord_js_1.Client {
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
        super(options);
        this.Commands = new CommandManager_1.CommandManager(this);
        this.Events = new EventManager_1.EventManager(this);
        this._token = options.token || undefined;
        this.Events.bindEvent('ready');
    }
    /**
     * Create a KyaClient instance and returns it; using multiple possibles as arguments.
     * @param {KyaOptions | string | any} options The options or the token. If the token only is passed, default options are taken.
     * @returns {KyaClient} The KyaClient instance.
     */
    static init(options) {
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
        this.Events.events.each((event) => {
            const method = event.name === 'ready' ? 'once' : 'on';
            this[method](event.name, (...args) => {
                event.callbackFn(this, ...args);
            });
        });
        await super.login(token || this._token);
        if (this._load) {
            this.loadCommands();
        }
        return 'Logged in.';
    }
    /**
     * A private function that load commands.
     * @private
     * @returns The command manager instance of the client.
     */
    loadCommands() {
        const clientApplication = this.application;
        if (!clientApplication) {
            throw new Error('Invalid client application provided.');
        }
        const guilds = new discord_js_1.Collection();
        const global = [];
        this.Commands.commands.each((command) => {
            if (command.metaData.guildOnly === Command_1.CommandLocation.GUILD_ONLY ||
                command.metaData.guildOnly === Command_1.CommandLocation.BOTH) {
                for (const guildId of command.metaData.guilds || []) {
                    if (!guilds.has(guildId)) {
                        // @ts-ignore
                        guilds.set(guildId, []);
                    }
                    // @ts-ignore
                    const guildCommands = guilds.get(guildId);
                    if (!guildCommands)
                        continue;
                    guildCommands.push(command);
                    guilds.set(guildId, guildCommands);
                }
            }
            else if (command.metaData.guildOnly === Command_1.CommandLocation.GLOBAL ||
                command.metaData.guildOnly === Command_1.CommandLocation.BOTH) {
                global.push(command);
            }
        });
        for (const guild of guilds) {
            const guildId = guild[0];
            const guildCommands = guild[1];
            if (guildCommands.length > 0) {
                this.application?.commands.set(guildCommands.map((cmd) => cmd.options), guildId);
            }
        }
        if (global.length > 0) {
            this.application?.commands.set(global.map((cmd) => cmd.options));
        }
        return this.Commands;
    }
}
exports.KyaClient = KyaClient;
