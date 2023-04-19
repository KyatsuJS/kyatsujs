import { PresenceStatusData } from 'discord.js';

/**
 * Declares a random array.
 */
export type CreateAnonymeArray<Length extends number, Acc extends unknown[] = []> = Acc['length'] extends Length
  ? Acc
  : CreateAnonymeArray<Length, [...Acc, 1]>;

/**
 * Declares a range.
 */
export type NumRange<
  _Start extends number[],
  _End extends number,
  Acc extends number = never,
> = _Start['length'] extends _End ? Acc | _End : NumRange<[..._Start, 1], _End, Acc | _Start['length']>;
