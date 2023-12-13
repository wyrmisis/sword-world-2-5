/**
 * @file The backing class for the `character` Actor type's sheet
 */
import { ItemSourceEra } from '../constants';

// @ts-expect-error - TS is confused by importing CSS
import styles from './weapon.sheet.module.css';

/**
 * @todo Add/remove stances
 */
class ItemsSheet extends ItemSheet {
  get template() {
    // @ts-expect-error - game.system exists in v10+
    return `/systems/${game.system.id}/dist/templates/item.sheet.hbs`;
  }

  static get defaultOptions() {
    const sheetClasses = ["sword-world", "sheet", "sheet--item", "sheet--inventory-item"];

    return mergeObject(super.defaultOptions, {
      classes: sheetClasses,
      width: 580,
      height: 440,
    });
  }

  getData() {
    const enumToKeyval = (obj: Record<string, string>, key: any, translationKey: string) => ({
      ...obj,
      [key]: `${translationKey}.${key}`
    });

    const itemEraToKeyval = (obj: Record<string, string>, key: ItemSourceEra) => enumToKeyval(obj, key, 'SW.equipment.general.era');

    return {
      ...super.getData(),
      styles,
      selectOptions: {
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
  }
}

export default ItemsSheet;
