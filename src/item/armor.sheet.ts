/**
 * @file The backing class for the `character` Actor type's sheet
 */
import { GearRank, ItemSourceEra } from '../constants';

// @ts-expect-error - TS is confused by importing CSS
import styles from './armor.sheet.module.css';

/**
 * @todo Add/remove stances
 */
class ArmorSheet extends ItemSheet {
  static get customFields () {
    return ["sw-input"].join(", "); 
  }

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

  // @ts-expect-error - Typescript is unhappy with adding our own stuff to the returned object
  getData() {
    const enumToKeyval = (obj: Record<string, string>, key: any, translationKey: string) => ({
      ...obj,
      [key]: `${translationKey}.${key}` 
    });

    const itemEraToKeyval = (obj: Record<string, string>, key: ItemSourceEra) => enumToKeyval(obj, key, 'SW.equipment.general.era');
    const rankToKeyval = (obj: Record<string, string>, key: GearRank) => enumToKeyval(obj, key, 'SW.equipment.general.gearRank');

    return {
      ...super.getData(),
      styles,
      options: {
        // @ts-expect-error - Compiler doesn't like enums with numeric values in reducers
        rank: Object.values(GearRank).filter(k => typeof k === 'number').reduce(rankToKeyval, {}),
        era: Object.values(ItemSourceEra).reduce(itemEraToKeyval, {})
      }
    }
  }

  /*
   * 
   * @todo Figure out focus for custom elements
   * @override 
   */
  // async _render(force?: boolean, options?: any) {
  //   // Identify the focused element
  //   let focus = document.activeElement;
  //   // Render the application and restore focus
  //   await super._render(force, options);
  //   if ( focus && focus.name ) {
  //     const input = this.form?.[focus.name];
  //     if ( input && (input.focus instanceof Function) ) input.focus();
  //   }
  // }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    html.on("change", ArmorSheet.customFields, this._onChangeInput.bind(this));
  }
}

export default ArmorSheet;