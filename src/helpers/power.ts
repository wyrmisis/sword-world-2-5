import { Evaluated } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll';
import power from '../data/power';

/**
 * Given a Power table row, roll for effect.
 * @param level The row to use on the Power table
 * @returns The outcome of the Power roll.
 */
const powerRoll = async (
  level: number = 0
) => {
  const roll = await new Roll(`2d6`).evaluate();
  const powerResult = (power.get(level) as Map<number, number|null>)
    .get(roll.total) ;

  return {
    roll, result: powerResult
  }
}

export const powerRollWithCrits = async (
  level: number = 0,
  criticalValue = 12,
  fromCritical = false,
  rolls: Evaluated<Roll<{}>>[] = [],
  result = 0
) => {
  const { roll, result: powerResult } = await powerRoll(level);

  rolls = [...rolls, roll];

  // We got double 1's!
  // If this is part of a critical explosive chain, return 0
  // Otherwise, return null so we know to mark an automatic failure
  // (and to give the unfortunate roller some consolation XP)
  if (powerResult === null || powerResult === undefined)
    return {
      rolls,
      result: fromCritical ? result : null
    };

  result = result + powerResult;
  
  // We got a crit -- start exploding our dice!
  if (powerResult >= criticalValue) {
    const morePower = await powerRollWithCrits(level, criticalValue, true, rolls, result);
    rolls = [rolls, ...morePower.rolls].flat();
    if (morePower?.result)
      result += morePower.result;
  }

  return { rolls: rolls.flat(), result }
}

export default powerRoll;