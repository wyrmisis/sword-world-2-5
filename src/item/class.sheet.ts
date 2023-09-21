/**
 * @file The backing class for the `class` Item type's sheet
 */
import { ClassType } from "../constants";

// @ts-expect-error - TS is confused by importing CSS
import styles from './class.sheet.module.css';

/**
 * @todo Add active effects
 * @todo Add "At this level, get $ITEM" Tab
 * @todo Add Magic Tab
 * @todo Add "can use Grappler gear"
 */
class ClassSheet extends ItemSheet {
  static get customFields () {
    return ["sw-input", "sw-switch"].join(", "); 
  }

  get template() {
    // @ts-expect-error - game.system exists in v10+
    return `/systems/${game.system.id}/dist/templates/class.sheet.hbs`;
  }

  static get defaultOptions() {
    const sheetClasses = ["sword-world", "sheet", "sheet--item", "sheet--class"];

    return mergeObject(super.defaultOptions, {
      classes: sheetClasses,
      width: 580,
      height: 440,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary" }]
    });
  }

  getData() {
    const enumToKeyval = (obj: Record<string, string>, key: any, translationKey: string) => ({
      ...obj,
      [key]: `${translationKey}.${key}` 
    });

    const classTypeToKeyval = (obj: Record<string, string>, key: ClassType) => enumToKeyval(obj, key, 'SW.characterOptions.class.classType');

    return {
      ...super.getData(),
      styles,
      selectOptions: {
        classType: Object.values(ClassType).reduce(classTypeToKeyval, {})
      },
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

    html.on("change", ClassSheet.customFields, this._onChangeInput.bind(this));
  }
}

export default ClassSheet;