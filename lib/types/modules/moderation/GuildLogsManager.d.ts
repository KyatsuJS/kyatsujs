import { Guild } from 'discord.js';
import { KyaClient } from '../../base';
/**
 * The main class for the audit logs module. Configures the module with this class.
 */
export declare class GuildLogsManager {
    /**
     * The list of saved guilds logs to listen to.
     */
    private readonly _savedLogs;
    /**
     * The guild focused on.
     */
    private _focusedGuild;
    /**
     * The KyaClient instance.
     */
    readonly client: KyaClient | undefined;
    /**
     * @param guild The main guild for the logs. The guild could be undefined, and defined later.
     * @param client The KyaClient instance.
     */
    constructor(guild?: Guild, client?: KyaClient);
    /**
     * Set the guild to focus on.
     * @param guild The guild to focus on.
     */
    set setFocusedGuild(guild: Guild);
    /**
     * Get the focused guild.
     * @returns The focused guild.
     */
    get focusedGuild(): Guild;
}
