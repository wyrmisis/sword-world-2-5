import { ItemSourceEra } from "../constants";

// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class ItemDataModel extends foundry.abstract.TypeDataModel {
    /**
     * @returns 
     */
    static defineSchema() {
      // @ts-expect-error - FVTT types package does not include data model fields
      const { StringField, HTMLField, NumberField } = foundry.data.fields;
  
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
          initial: ItemSourceEra.Current,
          choices: Object.values(ItemSourceEra)
        }),
        quantity: new NumberField({
          min: 1,
          initial: 1,
          nullable: false,
          positive: true,
        }),
        power: new NumberField({
          nullable: true,
          required: false,
          min: 0,
          max: 100,
          initial: null
        })
      }
    }
  }
  
  export default ItemDataModel;