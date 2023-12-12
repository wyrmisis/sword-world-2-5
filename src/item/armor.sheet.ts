/**
 * @file The backing class for the `character` Actor type's sheet
 */
import { GearRank, ItemSourceEra, ArmorCategory } from '../constants';

// @ts-expect-error - TS is confused by importing CSS
import styles from './armor.sheet.module.css';

/**
 * @todo Add/remove stances
 */
class ArmorSheet extends ItemSheet {
  get template() {
    console.info(styles);
    // @ts-expect-error - game.system exists in v10+
    return `/systems/${game.system.id}/dist/templates/armor.sheet.hbs`;
  }

  static get defaultOptions() {
    const sheetClasses = ["sword-world", "sheet", "sheet--item", "sheet--armor"];

    return mergeObject(super.defaultOptions, {
      classes: sheetClasses,
      width: 584,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary" }]
    });
  }

  getData() {
    const enumToKeyval = (obj: Record<string, string>, key: any, translationKey: string) => ({
      ...obj,
      [key]: `${translationKey}.${key}`
    });

    const itemEraToKeyval = (obj: Record<string, string>, key: ItemSourceEra) => enumToKeyval(obj, key, 'SW.equipment.general.era');
    const rankToKeyval = (obj: Record<string, string>, key: GearRank) => enumToKeyval(obj, key, 'SW.equipment.general.gearRank');
    const categoryToKeyval = (obj: Record<string, string>, key: ArmorCategory) => enumToKeyval(obj, key, 'SW.equipment.armor.category');

    return {
      ...super.getData(),
      styles,
      selectOptions: {
        // @ts-expect-error - Compiler doesn't like enums with numeric values in reducers
        rank: Object.values(GearRank).filter(k => typeof k === 'number').reduce(rankToKeyval, {}),
        era: Object.values(ItemSourceEra).reduce(itemEraToKeyval, {}),
        category: Object.values(ArmorCategory).reduce(categoryToKeyval, {})
      }
    }
  }


  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

  }
}

export default ArmorSheet;
