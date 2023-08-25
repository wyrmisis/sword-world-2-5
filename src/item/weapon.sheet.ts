/**
 * @file The backing class for the `character` Actor type's sheet
 */
import { GearRank, ItemSourceEra, WeaponCategory, WeaponDamageType, WeaponStanceType } from '../constants';

// @ts-expect-error - TS is confused by importing CSS
import styles from './weapon.sheet.module.css';

/**
 * @todo Add/remove stances
 */
class WeaponSheet extends ItemSheet {
  static get customFields () {
    return ["sw-input"].join(", "); 
  }

  get template() {
    console.info(styles);
    // @ts-expect-error - game.system exists in v10+
    return `/systems/${game.system.id}/dist/templates/weapon.sheet.hbs`;
  }

  static get defaultOptions() {
    const sheetClasses = ["sword-world", "sheet", "sheet--item", "sheet--weapon"];

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
    const stanceToKeyval = (obj: Record<string, string>, key: WeaponStanceType) => enumToKeyval(obj, key, 'SW.equipment.weapon.stanceType');
    const damageTypeToKeyval = (obj: Record<string, string>, key: WeaponDamageType) => enumToKeyval(obj, key, 'SW.equipment.weapon.damageType');
    const weaponCategoryToKeyval = (obj: Record<string, string>, key: WeaponCategory) => enumToKeyval(obj, key, 'SW.equipment.weapon.weaponCategory');
    const weaponRankToKeyval = (obj: Record<string, string>, key: GearRank) => enumToKeyval(obj, key, 'SW.equipment.general.gearRank');

    return {
      ...super.getData(),
      styles,
      options: {
        // @ts-expect-error - Compiler doesn't like enums with numeric values in reducers
        stanceType: Object.values(WeaponStanceType).filter(k => typeof k === 'number').reduce(stanceToKeyval, {}),
        damageType: Object.values(WeaponDamageType).reduce(damageTypeToKeyval, {}),
        weaponCategory: Object.values(WeaponCategory).reduce(weaponCategoryToKeyval, {}),
        // @ts-expect-error - Compiler doesn't like enums with numeric values in reducers
        rank: Object.values(GearRank).filter(k => typeof k === 'number').reduce(weaponRankToKeyval, {}),
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

    html.on("change", WeaponSheet.customFields, this._onChangeInput.bind(this));
    html.on("click", '.add', this.#addNewStance.bind(this));
    html.on("click", '.remove', this.#removeStance.bind(this));

    // html.find(`${styles.stance}`).on('hover', (e: Event) => {
    //   game.tooltip.activate(e.target, {text: "Test!"})
    // })
  }

  #addNewStance(e: Event) {
    e.stopPropagation();
    // @ts-expect-error - item.system exists as of v10+
    const template = this.item.system.stanceTemplate;
    this.item.update({
      'system.stances': [
        // @ts-expect-error - item.system exists as of v10+
        ...this.item.system.stances,
        template
      ]
    })
  }

  /**
   * @todo Warn the user before deleting their stance info!
   * @param e - The event that triggered this method
   * @returns 
   */
  #removeStance(e: Event) {
    e.stopPropagation();
    const indexToDrop = parseInt((e.target as HTMLButtonElement).dataset.index || '0');
    console.info((e.target as HTMLButtonElement).dataset.index , indexToDrop);
    if (isNaN(indexToDrop))
      return;
    // @ts-expect-error - item.system exists as of v10+
    const updated = this.item.system.stances.filter((_s: unknown, i: number) => i !== indexToDrop);
    console.info(updated)
    this.item.update({
      'system.stances': updated
    })
  }
}

export default WeaponSheet;