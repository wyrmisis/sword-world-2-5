// Actors
import ActorEntity from '../actor/_entity';

// Characters -- PCs and Fellows
import CharacterDataModel from '../actor/character.datamodel';
import CharacterSheet from '../actor/character.sheet';

// Monsters -- mounts, summons, and most other things
// import MonsterDataModel from '../actor/monster.datamodel';
// import MonsterSheet from '../actor/monster.sheet';

// Items
// import ItemEntity from '../item/_entity';

// Extrinsic items -- stuff characters own
import WeaponDataModel from '../item/weapon.datamodel';
// import WeaponSheet from '../item/weapon.sheet';
import ArmorDataModel from '../item/armor.datamodel';
// import ArmorSheet from '../item/armor.sheet';
import AccessoryDataModel from '../item/accessory.datamodel';
// import AccessorySheet from '../item/accessory.sheet';
import ConsumableDataModel from '../item/consumable.datamodel';
// import ConsumableSheet from '../item/consumable.sheet';
import ItemDataModel from '../item/item.datamodel';
// import ItemsSheet from '../item/item.sheet';

// Intrinsic items -- stuff characters are or know
// import RaceDataModel from '../item/race.datamodel';
// import RaceSheet from '../item/race.sheet';
import ClassDataModel from '../item/class.datamodel';
// import ClassSheet from '../item/class.sheet';
// import FeatDataModel from '../item/feat.datamodel';
// import FeatSheet from '../item/feat.sheet';
// import SpellDataModel from '../item/spell.datamodel';
// import SpellSheet from '../item/spell.sheet';

// Monster items -- stuff that makes a monster work
// import MonsterSectionDataModel from '../item/monstersection.datamodel';
// import MonsterSectionSheet from '../item/monstersection.sheet';
// import MonsterSkillDataModel from '../item/monsterskill.datamodel';
// import MonsterSkillSheet from '../item/monsterskill.sheet';

/**
 * @todo Assign data model and sheet - Actor - Character
 * @todo Assign data model and sheet - Actor - Monster
 * 
 * @todo Assign data model and sheet - Item - Weapon
 * @todo Assign data model and sheet - Item - Armor
 * @todo Assign data model and sheet - Item - Accessory
 * @todo Assign data model and sheet - Item - Consumable
 * @todo Assign data model and sheet - Item - Item
 * 
 * @todo Assign data model and sheet - Item - Race
 * @todo Assign data model and sheet - Item - Class
 * @todo Assign data model and sheet - Item - Combat Feat
 * @todo Assign data model and sheet - Item - Spell
 * 
 * @todo Assign data model and sheet - Item - Monster Section
 * @todo Assign data model and sheet - Item - Monster Unique Skill
 */
Hooks.on('init', () => {
  CONFIG.Actor.documentClass = ActorEntity;
  // CONFIG.Item.documentClass = ItemEntity;

  // @ts-expect-error - FVTT types package doesn't include v11 data models yet
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    // monster: MonsterDataModel,
  };

  // @ts-expect-error - FVTT types package doesn't include v11 data models yet
  CONFIG.Item.dataModels = {
    weapon: WeaponDataModel,
    armor: ArmorDataModel,
    accessory: AccessoryDataModel,
    consumable: ConsumableDataModel,
    item: ItemDataModel,
  //   race: RaceDataModel,
    class: ClassDataModel,
  //   skill: SkillDataModel,
  //   feat: FeatDataModel,
  //   spell: SpellDataModel,
  //   monstersection: MonsterSectionDataModel,
  //   monsterskill: MonsterSkillDataModel
  };

  // Actor sheets
  Actors.unregisterSheet("core", ActorSheet);
  // @ts-expect-error - The current system's ID exists on the Game object in v10+
  Actors.registerSheet(game.system.id, CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "SW.SheetCharacter",
  });
  // Actors.registerSheet(game.system.id, MonsterSheet, {
  //   types: ["monster"],
  //   makeDefault: true,
  //   label: "SW.SheetMonster",
  // });

  // Item sheets
  // @todo - Can any of these be consolidated?
  // Items.unregisterSheet("core", ItemSheet);
  // Items.registerSheet(game.system.id, WeaponSheet, {
  //   types: ["weapon"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, ArmorSheet, {
  //   types: ["armor"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, AccessorySheet, {
  //   types: ["accessory"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, ConsumableSheet, {
  //   types: ["consumable"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, ItemsSheet, {
  //   types: ["item"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, RaceSheet, {
  //   types: ["race"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, ClassSheet, {
  //   types: ["class"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, SpellSheet, {
  //   types: ["spell"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, FeatSheet, {
  //   types: ["feat"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, MonsterSectionSheet, {
  //   types: ["monstersection"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
  // Items.registerSheet(game.system.id, MonsterSkillSheet, {
  //   types: ["monsterskill"],
  //   makeDefault: true,
  //   label: "SW.SheetItem",
  // });
})