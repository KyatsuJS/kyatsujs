"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.timeout = exports.split = exports.err = exports.test = exports.log = void 0;
/**
 * Logs a message to the console.
 * @param args The message to log.
 * @returns Void.
 */
function log(...args) {
    console.log('⟦KYATSU LOG⟧', ...args);
}
exports.log = log;
/**
 * Logs a message to the console, with the "test" tag.
 * @param args The message to log.
 * @returns Void.
 */
function test(...args) {
    console.log('⟦KYATSU TEST⟧', ...args);
}
exports.test = test;
/**
 * Logs a message to the console, with the "error" tag.
 * @param args The message to log.
 * @returns Void.
 */
function err(...args) {
    console.error('⟦KYATSU ERROR⟧', ...args);
}
exports.err = err;
/**
 * Log a line to the console. Useful to separate logs.
 * @returns Void.
 */
function split() {
    console.log('⟦-------------------------------------------------⟧');
}
exports.split = split;
/**
 * The equivalent of setTimeout, but asynchronous.
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Void.
 * @example
 * await timeout(() => console.log('Hello world !'), 1000);
 */
async function timeout(fn, ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return fn(...arguments);
}
exports.timeout = timeout;
/**
 * The Colors enum. These are the colors used in the embeds.
 */
exports.Colors = {
    RED: 0xff4848,
    ORANGE: 0xff7526,
    YELLOW: 0xffec80,
    GREEN: 0x36ff6d,
    BLUE: 0x454bff,
    WHITE: 0xebebeb,
};
