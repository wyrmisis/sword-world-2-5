import { GearRank, ItemSourceEra, WeaponCategory, WeaponDamageType, WeaponStanceType } from '../constants';
import WeaponStance, { StanceSchema } from './data-model-subclasses/stance.weapon.datamodel';

/**
 * @todo static DEFAULT_ICON = "path/to/default/icon.png"
 */
// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class WeaponDataModel extends foundry.abstract.TypeDataModel {
  async prepareDerivedData() {
    // @ts-expect-error - this.stances comes from the schema
    this.stances = (this.stances || []).map((s: StanceSchema) =>
      //@ts-expect-error - this.parent exists on the parent DataModel class
      new WeaponStance(s, this.parent?.system, this.attackingClass?.system)
    );
  }

  /**
   * @todo Why can't I get weaponCategories to have a default value?
   * @returns 
   */
  static defineSchema() {
    // @ts-expect-error - FVTT types package does not include data model fields
    const { StringField, HTMLField, NumberField, BooleanField, ObjectField, SchemaField, ArrayField } = foundry.data.fields;

    const stances = new ArrayField(
      new SchemaField({
        stanceType: new NumberField({
          initial: WeaponStanceType.OneHand, 
          choices: Object.values(WeaponStanceType)
        }),
        damageType: new StringField({
          initial: WeaponDamageType.Edged,
          choices: Object.values(WeaponDamageType)
        }),
        weaponCategory: new StringField({
          nullable: false,
          initial: WeaponCategory.Sword,
          choices: Object.values(WeaponCategory)
        }),
        power: new NumberField({
          initial: 0,
          nullable: false,
          min: 0,
          max: 100,
          integer: true,
        }),
        minimumStrength: new NumberField({
          initial: 0,
          nullable: false,
          min: 0,
          integer: true,
        }),
        accuracy: new NumberField({
          initial: 0,
          nullable: false,
        }),
        extraDamage: new NumberField({
          initial: 0,
          nullable: false,
        }),
        criticalValue: new NumberField({
          initial: 12,
          nullable: false,
          integer: true,
          min: 3,
          max: 12
        }),
        range: new SchemaField({
          simplified: new NumberField({
            min: 0,
            max: 2,
            initial: 0,
            nullable: false
          }),
          standard: new NumberField({
            min: 0,
            initial: 0,
            nullable: false
          }),
        }),
        usesAmmunition: new BooleanField({
          initial: false,
          nullable: false
        })
      }),
      {
        initial: [{
          stanceType: WeaponStanceType.OneHand,
          damageType: WeaponDamageType.Edged,
          weaponCategory: WeaponCategory.Sword,
          power: 0,
          minimumStrength: 0,
          accuracy: 0,
          extraDamage: 0,
          criticalValue: 12,
          range: { simplified: 0, standard: 0 },
          usesAmmunition: false
        }]
      }
    );

    return {
      description: new HTMLField({}),
      price: new NumberField({
        nullable: false,
        min: 0,
        initial: 0,
      }),
      quantity: new NumberField({
        min: 1,
        initial: 1,
        nullable: false,
        positive: true,
      }),
      stances,
      rank: new NumberField({
        nullable: false,
        required: true,
        initial: GearRank.B,
        choices: Object.values(GearRank)
      }), 
      popularity: new NumberField({
        nullable: false,
        min: 2,
        initial: 2
      }),
      era: new StringField({
        initial: ItemSourceEra.Current,
        choices: Object.values(ItemSourceEra)
      }),
      isMagical: new BooleanField({}),
      isSilvered: new BooleanField({}),
      isEquipped: new BooleanField({
        initial: false
      }),
      attackingClassId: new StringField()
    }
  }

  get #actor() {
    // @ts-expect-error - parent exists on superclass
    return this.parent?.parent;
  }

  get attackingClass() {
    //@ts-expect-error - this.attackingClassId exists on the schema
    return this.#actor?.items.get(this.attackingClassId);
  }

  /**
   * @todo Handle weapon category types:
   */
  get canBeUsed() {
    if (!this.#actor) return false;
    if (!this.attackingClass) return false;
  
    //@ts-expect-error - this.stances exists on the schema
    const hasAvailableStance = this.stances
      .some((s: WeaponStance) => s.canBeUsed);

    return true;
  }

  get stanceTemplate() {
    // @ts-expect-error - schema comes from the superclass
    return this.schema.fields.stances.options.initial[0];
  }
}

export default WeaponDataModel;