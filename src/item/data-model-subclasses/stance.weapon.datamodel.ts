import CharacterDataModel from '../../actor/character.datamodel';
import { WeaponCategory, WeaponDamageType, WeaponStanceType } from '../../constants';
import powerTable from '../../data/power';
import { powerRollWithCrits } from '../../helpers/power';
import ClassDataModel from '../class.datamodel';

export type StanceSchema = {
  stanceType: WeaponStanceType,
  damageType: WeaponDamageType,
  power: number,
  minimumStrength: number,
  accuracy: number,
  extraDamage: number,
  criticalValue: number,
  weaponCategory: WeaponCategory,
  range: StanceRange
}

export type StanceRange = {
  simplified: number,
  standard: number
}

export default class WeaponStance {
  stanceType: WeaponStanceType;
  damageType: WeaponDamageType;
  power: number;
  powerTable: Map<number, number | null> | undefined;
  minimumStrength: number;
  accuracy: number;
  extraDamage: number;
  criticalValue: number;
  range: StanceRange;

  #actorStrength: number;

  /**
   * 
   * @param stance - The StanceSchema object for this weapon stance
   * @param category - The WeaponCategories that apply to this weapon
   * @param actor - The ActorEntity that represents this item's parent. Used for determining this stance's total accuracy and damage
   */
  constructor (
    {
      stanceType,
      damageType,
      power,
      minimumStrength,
      accuracy,
      extraDamage,
      criticalValue,
      weaponCategory,
      range
    }: StanceSchema,
    actor: CharacterDataModel,
    classItem: ClassDataModel
  ) {
    this.stanceType = stanceType;
    this.damageType = damageType;
    this.power = power;
    this.powerTable = powerTable.get(power) as Map<number, number|null>;
    this.minimumStrength = minimumStrength;
    this.accuracy = accuracy + (classItem?.accuracy?.[weaponCategory] || 0);
    // @ts-expect-error - we're building the class item's extra damage object kinda weird
    this.extraDamage = extraDamage + (classItem?.extraDamage?.[weaponCategory] || 0);
    this.criticalValue = criticalValue + actor?.criticalValueModifier || 0;
    this.range = range;

    // @ts-expect-error - Property exists on model schema
    this.#actorStrength = actor?.abilityScores.body.strength.value;
  }

  get canBeUsed() {
    return this.#actorStrength >= this.minimumStrength;
  }

  /**
   * Roll to hit for an attack with this stance
   * 
   * @param situationalBonus - A temporary bonus to the attacker's accuracy. Note: do not add the character's normal modifiers  
   * @returns 
   */
  async rollAccuracy(bonus: number) {
    const terms = !bonus 
      ? `2d6+${this.accuracy}`
      : `2d6+${this.accuracy}+${bonus}`
    const roll = await new Roll(terms).evaluate();
    return roll;
  }

  /**
   * Roll damage for an attack with this stance.
   *
   * @param situationalBonus - A temporary bonus to the attacker's extra damage.
   * @param critBonus - A temporary bonus to the attacker's crit value.
   * @returns 
   */
  async rollDamage(situationalBonus: number, critBonus = 0) {
    const { rolls, result } = await powerRollWithCrits(
      this.power,
      this.criticalValue + critBonus
    );

    return {
      rolls,
      result,
      total: (result !== null && result !== undefined)
        ? result + this.extraDamage + situationalBonus
        : result
    }
  }
}