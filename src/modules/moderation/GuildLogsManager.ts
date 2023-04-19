import { Guild, GuildAuditLogs, AuditLogEvent, Collection } from 'discord.js';
import { KyaClient } from '../../base';

/**
 * The logs that can be listened to.
 */
const AuditLogEventValues: (string | AuditLogEvent)[] = Object.values(AuditLogEvent).filter(
  (value: string | AuditLogEvent): boolean => typeof value === 'string',
);

/**
 * The main class for the audit logs module. Configures the module with this class.
 */
export class GuildLogsManager {
  /**
   * The list of saved guilds logs to listen to.
   */
  private readonly _savedLogs: Collection<(typeof Guild.prototype)['id'], typeof AuditLogEventValues> =
    new Collection();
  /**
   * The guild focused on.
   */
  private _focusedGuild: Guild | undefined;
  /**
   * The KyaClient instance.
   */
  public readonly client: KyaClient | undefined;

  /**
   * @param guild The main guild for the logs. The guild could be undefined, and defined later.
   * @param client The KyaClient instance.
   */
  constructor(guild?: Guild, client?: KyaClient) {
    if (guild) {
      if (!(guild instanceof Guild)) throw new Error('Invalid guild provided.');
      this._focusedGuild = guild;
    }
    if (client) {
      if (!(client instanceof KyaClient)) throw new Error('Invalid client provided.');
      this.client = client;
    }
  }

  /**
   * Set the guild to focus on.
   * @param guild The guild to focus on.
   */
  public set setFocusedGuild(guild: Guild) {
    if (!guild) throw new Error('Guild is not defined.');
    if (!(guild instanceof Guild)) throw new Error('Guild is not a valid guild.');

    this._focusedGuild = guild;
  }

  /**
   * Get the focused guild.
   * @returns The focused guild.
   */
  public get focusedGuild(): Guild {
    if (!this._focusedGuild) throw new Error('Focused guild is not defined.');
    return this._focusedGuild;
  }
}
