import { ArmorCategory, GearRank, ItemSourceEra } from "../constants";

// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class ArmorDataModel extends foundry.abstract.TypeDataModel {
  /**
   * @returns 
   */
  static defineSchema() {
    // @ts-expect-error - FVTT types package does not include data model fields
    const { StringField, HTMLField, NumberField, BooleanField } = foundry.data.fields;

    return {
      description: new HTMLField({}),
      price: new NumberField({
        nullable: false,
        min: 0,
        initial: 0,
      }),
      minimumStrength: new NumberField({
        nullable: false,
        min: 0,
        initial: 0,
      }),
      evasion: new NumberField({
        nullable: false,
        initial: 0,
      }),
      defense: new NumberField({
        nullable: false,
        initial: 0,
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
      category: new StringField({
        nullable: false,
        required: true,
        initial: ArmorCategory.Nonmetal,
        choices: Object.values(ArmorCategory)
      }),
      rank: new NumberField({
        nullable: false,
        required: true,
        initial: GearRank.B,
        choices: Object.values(GearRank)
      }),
      equipped: new BooleanField({
        initial: false
      })
    }
  }
}

export default ArmorDataModel;