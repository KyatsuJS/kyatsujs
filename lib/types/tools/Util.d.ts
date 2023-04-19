/**
 * Logs a message to the console.
 * @param args The message to log.
 * @returns Void.
 */
export declare function log(...args: any[]): void;
/**
 * Logs a message to the console, with the "test" tag.
 * @param args The message to log.
 * @returns Void.
 */
export declare function test(...args: any[]): void;
/**
 * Logs a message to the console, with the "error" tag.
 * @param args The message to log.
 * @returns Void.
 */
export declare function err(...args: any[]): void;
/**
 * Log a line to the console. Useful to separate logs.
 * @returns Void.
 */
export declare function split(): void;
/**
 * The equivalent of setTimeout, but asynchronous.
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Void.
 * @example
 * await timeout(() => console.log('Hello world !'), 1000);
 */
export declare function timeout(fn: (...args: any[]) => any, ms: number): Promise<any>;
/**
 * The Colors enum. These are the colors used in the embeds.
 */
export declare const Colors: {
    readonly RED: 16730184;
    readonly ORANGE: 16741670;
    readonly YELLOW: 16772224;
    readonly GREEN: 3604333;
    readonly BLUE: 4541439;
    readonly WHITE: 15461355;
};
