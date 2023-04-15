/**
 * Logs a message to the console.
 * @param args The message to log.
 * @returns Void.
 */
export function log(...args: any[]): void {
  console.log('⟦KYATSU LOG⟧', ...args);
}

/**
 * Logs a message to the console, with the "test" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function test(...args: any[]): void {
  console.log('⟦KYATSU TEST⟧', ...args);
}

/**
 * Logs a message to the console, with the "error" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function err(...args: any[]): void {
  console.error('⟦KYATSU ERROR⟧', ...args);
}

/**
 * Log a line to the console. Useful to separate logs.
 * @returns Void.
 */
export function split(): void {
  console.log('⟦-------------------------------------------------⟧');
}

/**
 * The equivalent of setTimeout, but asynchronous.
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Void.
 * @example
 * await timeout(() => console.log('Hello world !'), 1000);
 */
export async function timeout(fn: (...args: any[]) => any, ms: number): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  // @ts-ignore
  return fn(...args);
}

/**
 * The Colors enum. These are the colors used in the embeds.
 */
export const Colors = {
  RED: 0xff4848,
  ORANGE: 0xff7526,
  YELLOW: 0xffec80,
  GREEN: 0x36ff6d,
  BLUE: 0x454bff,
  WHITE: 0xebebeb,
};
