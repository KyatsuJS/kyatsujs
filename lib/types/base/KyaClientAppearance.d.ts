/// <reference types="node" />
import { PresenceStatusData, ActivitiesOptions } from 'discord.js';
import { KyaClient } from './KyaClient';
/**
 * The full list of presence statuses.
 */
export declare const PresenceStatusList: PresenceStatusData[];
/**
 * Represents the appearance manager for the client.
 */
export declare class KyaClientAppearance {
    /**
     * The client instance.
     */
    readonly client: KyaClient;
    /**
     * @param client The client instance.
     */
    constructor(client: KyaClient);
    /**
     * Set the client's avatar.
     * @param path The path to the image.
     * @returns Void.
     */
    setAvatar(path: string | Buffer): Promise<void>;
    /**
     * Change the bot username.
     * @param username The new username.
     * @returns Void.
     */
    setUsername(username: string): Promise<void>;
    /**
     * Change the bot presence.
     * @param status The new status.
     * @param activity The new activity.
     * @param shardId The shard id.
     * @returns Void.
     */
    setPresence(status: PresenceStatusData, activity: string | ActivitiesOptions, shardId?: number): Promise<void>;
}
