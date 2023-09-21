import ActorEntity from '../actor/_entity';
import { ClassType, GunWeaponCategories, MeleeWeaponCategories, ShootingWeaponCategories, ThrownWeaponCategories, WeaponCategory, WrestlingWeaponCategories } from '../constants';
import { majorXPTable, minorXPTable } from '../data/xp';

/**
 * @todo - Schema!
 */
// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class ClassDataModel extends foundry.abstract.TypeDataModel {
  prepareDerivedData() {

  }

  static bonusMapBuilder (key: string, bonus: number, flag: boolean) {
    return { [key]: flag ? bonus : null }
  }

  static defineSchema() {
    // @ts-expect-error - FVTT types package does not include data model fields
    const { StringField, HTMLField, NumberField, BooleanField, ObjectField, SchemaField, ArrayField } = foundry.data.fields;

    return {
      level: new NumberField({
        initial: 1,
        nullable: false,
        min: 1,
        max: 15,
        step: 1,
        integer: true,
        positive: true,
      }),
      description: new HTMLField({
        initial: ""
      }),
      isMajor: new BooleanField({
        initial: true,
        nullable: false,
      }),
      type: new StringField({
        initial: ClassType.Other,
        choices: Object.values(ClassType)
      }),
      // Flags for enabling combat options
      canAllowShootingAttacks: new BooleanField({ initial: false, nullable: false }),
      canAllowBullets: new BooleanField({ initial: false, nullable: false }),
      canAllowThrownAttacks: new BooleanField({ initial: false, nullable: false }),
      canAllowMeleeAttacks: new BooleanField({ initial: false, nullable: false }),
      canAllowWrestlingAttacks: new BooleanField({ initial: false, nullable: false }),
      canAllowGrapplerGear: new BooleanField({ initial: false, nullable: false }),
      // Flags for combat bonuses
      canAddEvasion: new BooleanField({ initial: false, nullable: false }),
      canAddAccuracy: new BooleanField({ initial: false, nullable: false }),
      canAddDamage: new BooleanField({ initial: false, nullable: false }),
      // Flags for check bonuses
      canAddInitiative: new BooleanField({ initial: false, nullable: false }),
      canAddMonsterKnowledge: new BooleanField({ initial: false, nullable: false }),
      // Flags for check package bonuses
      canAddTechniqueSkillPoints: new BooleanField({ initial: false, nullable: false }),
      canAddMovementSkillPoints: new BooleanField({ initial: false, nullable: false }),
      canAddObservationSkillPoints: new BooleanField({ initial: false, nullable: false }),
      canAddKnowledgeSkillPoints: new BooleanField({ initial: false, nullable: false }),
    }
  }

  #getMeleeBonusMap (key: string, bonus: number) {
    // @ts-expect-error - property exists on the model's schema
    return ClassDataModel.bonusMapBuilder(key, bonus, this.canAllowMeleeAttacks);
  } 
  #getShootingBonusMap (key: string, bonus: number) {
    // @ts-expect-error - property exists on the model's schema
    return ClassDataModel.bonusMapBuilder(key, bonus, this.canAllowShootingAttacks);
  } 
  #getThrownBonusMap (key: string, bonus: number) {
    // @ts-expect-error - property exists on the model's schema
    return ClassDataModel.bonusMapBuilder(key, bonus, this.canAllowThrownAttacks);
  } 
  #getWrestlingBonusMap (key: string, bonus: number) {
    // @ts-expect-error - property exists on the model's schema
    return ClassDataModel.bonusMapBuilder(key, bonus, this.canAllowWrestlingAttacks);
  } 

  get xpTable() {
    // @ts-expect-error - isMajor exists on the model's schema
    return this.isMajor
      ? majorXPTable
      : minorXPTable;
  }
  get xpToRefund() {
    // @ts-expect-error - level exists on the model's schema
    return this.xpTable.get(this.level || 1);
  }
  get xpToNext() {
    // @ts-expect-error - level exists on the model's schema
    const result = this.xpTable.get((this.level || 1) + 1);
    return (result) ? result : 0;

  }
  get xpCumulativeCost() {
    let cost = 0;
    // @ts-expect-error - level exists on the model's schema
    for (let i = 1; i <= (this.level || 1); i++)
      cost += this.xpTable.get(i) || 0;
    return cost;
  }

  get accuracy() {
    // @ts-expect-error - level exists on the model's schema, parent exists on superclass
    const bonus = this.level + (this.parent?.accuracy || 0);
      
    return [
      ...MeleeWeaponCategories.map(key => this.#getMeleeBonusMap(key, bonus)),
      ...ThrownWeaponCategories.map(key => this.#getThrownBonusMap(key, bonus)),
      ...WrestlingWeaponCategories.map(key => this.#getWrestlingBonusMap(key, bonus)),
      ...ShootingWeaponCategories.map(key => this.#getShootingBonusMap(key, bonus)),
      ...GunWeaponCategories.map(key => this.#getShootingBonusMap(key, bonus)),
    ]
    .filter(i => Object.values(i)[0] !== null)
    .reduce((prev, curr) => ({
      ...prev,
      [Object.keys(curr)[0]]: Object.values(curr)[0]
    }), {})
  }

  get extraDamage() {
    // @ts-expect-error - level exists on the model's schema, parent exists on superclass
    const bonus = this.level + (this.parent?.extraDamage || 0);
    // Crossbows get extra damage from the weapon itself; the user can fill that in
    // @ts-expect-error - level exists on the model's schema
    const crossbowBonus = this.level;
    // Guns get extra damage from she shooter's [* Bullet] spell; the user can fill that in
    // @ts-expect-error - level exists on the model's schema
    const gunBonus = this.level;

    return [
      ...MeleeWeaponCategories.map(key => this.#getMeleeBonusMap(key, bonus)),
      ...ThrownWeaponCategories.map(key => this.#getThrownBonusMap(key, bonus)),
      ...WrestlingWeaponCategories.map(key => this.#getWrestlingBonusMap(key, bonus)),
      ...[WeaponCategory.Bow].map(key => this.#getShootingBonusMap(key, bonus)),
      // @ts-expect-error - property exists on the model's schema
      { [WeaponCategory.Crossbow]: this.canAllowShootingAttacks ? crossbowBonus : null },
      // @ts-expect-error - property exists on the model's schema
      { [WeaponCategory.Gun]: (this.canAllowShootingAttacks && this.canAllowBullets) ? gunBonus : null },
    ]
    .filter(i => Object.values(i)[0] !== null)
    .reduce((prev, curr) => ({
      ...prev,
      [Object.keys(curr)[0]]: Object.values(curr)[0]
    }), {})
  }

  get evasion() {
    // @ts-expect-error - property exists on the model's schema
    if (!this.canAddEvasion) return 0;

    // @ts-expect-error - property exists on the model's schema
    return this.level + this.parent?.evasion || 0;
  }

  get magicPower() {
    // @ts-expect-error - type exists on the model's schema
    if (this.type !== ClassType.Wizard)
      return null;
    // @ts-expect-error - FVTT types package does not include system object on Actors
    const modifier = (this.parent as ActorEntity).system.abilityScores.mind.intelligence.modifier;
    // @ts-expect-error - level exists on the model's schema
    return this.level + (modifier || 0);
  }
}

export default ClassDataModel;