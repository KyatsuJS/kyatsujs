"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildLogsManager = void 0;
const discord_js_1 = require("discord.js");
const base_1 = require("../../base");
/**
 * The logs that can be listened to.
 */
const AuditLogEventValues = Object.values(discord_js_1.AuditLogEvent).filter((value) => typeof value === 'string');
/**
 * The main class for the audit logs module. Configures the module with this class.
 */
class GuildLogsManager {
    /**
     * The list of saved guilds logs to listen to.
     */
    _savedLogs = new discord_js_1.Collection();
    /**
     * The guild focused on.
     */
    _focusedGuild;
    /**
     * The KyaClient instance.
     */
    client;
    /**
     * @param guild The main guild for the logs. The guild could be undefined, and defined later.
     * @param client The KyaClient instance.
     */
    constructor(guild, client) {
        if (guild) {
            if (!(guild instanceof discord_js_1.Guild))
                throw new Error('Invalid guild provided.');
            this._focusedGuild = guild;
        }
        if (client) {
            if (!(client instanceof base_1.KyaClient))
                throw new Error('Invalid client provided.');
            this.client = client;
        }
    }
    /**
     * Set the guild to focus on.
     * @param guild The guild to focus on.
     */
    set setFocusedGuild(guild) {
        if (!guild)
            throw new Error('Guild is not defined.');
        if (!(guild instanceof discord_js_1.Guild))
            throw new Error('Guild is not a valid guild.');
        this._focusedGuild = guild;
    }
    /**
     * Get the focused guild.
     * @returns The focused guild.
     */
    get focusedGuild() {
        if (!this._focusedGuild)
            throw new Error('Focused guild is not defined.');
        return this._focusedGuild;
    }
}
exports.GuildLogsManager = GuildLogsManager;
