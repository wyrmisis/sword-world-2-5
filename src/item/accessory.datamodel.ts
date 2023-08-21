import { AccessorySlot, ItemSourceEra } from "../constants";

// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class AccessoryDataModel extends foundry.abstract.TypeDataModel {
  slot?: boolean;

  /**
   * @returns 
   */
  static defineSchema() {
    // @ts-expect-error - FVTT types package does not include data model fields
    const { StringField, HTMLField, NumberField, BooleanField, ArrayField } = foundry.data.fields;

    return {
      description: new HTMLField({}),
      price: new NumberField({
        nullable: false,
        min: 0,
        initial: 0,
      }),
      popularity: new NumberField({
        nullable: false,
        min: 2,
        initial: 2
      }),
      era: new StringField({
        nullable: false,
        initial: ItemSourceEra.Current,
        choices: Object.values(ItemSourceEra)
      }),
      allowedSlots: new ArrayField(
        new StringField({
          nullable: false,
          required: true,
          choices: Object.values(AccessorySlot)
        }),
        {
          nullable: false,
        }
      ),
      slot: new StringField({
        nullable: true,
        required: true,
        choices: Object.values(AccessorySlot)
      }),
      isMagical: new BooleanField({
        nullable: false,
        initial: false
      }),
    }
  }

  get isEquipped() {
    return !!this.slot;
  }
}

export default AccessoryDataModel;