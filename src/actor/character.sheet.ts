/**
 * @file The backing class for the `character` Actor type's sheet
 */
class CharacterSheet extends ActorSheet {
  get template() {
    // @ts-expect-error - game.system exists in v10+
    return `/systems/${game.system.id}/dist/templates/character.sheet.hbs`;
  }

  static get defaultOptions() {
    const sheetClasses = ["sword-world", "sheet", "sheet--actor", "sheet--character"];

    return mergeObject(super.defaultOptions, {
      classes: sheetClasses,
      width: 584,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".tab-group__container", initial: "summary" }]
    });
  }
}

export default CharacterSheet;