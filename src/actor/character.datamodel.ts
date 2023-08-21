import { Language, ClassType } from '../constants';
import ActorEntity from './_entity';
import AbilityScoreSet, { Score } from './abilityscore.character.datamodel';

class Meter {
  static multiplier = 3;

  value: number;
  
  #level: number;
  #score: number;

  constructor(value: number = 0, level: number = 0, score: number = 0) {
    this.value = value;
    this.#level = level;
    this.#score = score;
  }

  get max() {
    return this.#level * Meter.multiplier + this.#score;
  }
}

/**
 * @todo - Schema!
 */
// @ts-expect-error - FVTT types package has not been updated with v10/v11 data model stuff
class CharacterDataModel extends foundry.abstract.TypeDataModel {
  /**
   * @todo Set up derived ability score class
   * @todo Set up derived defense class
   */
  prepareDerivedData() {
    // @ts-expect-error - this.abilityScores exists on the model schema
    this.abilityScores = new AbilityScoreSet(
      // @ts-expect-error - this.abilityScores exists on the model schema
      this.abilityScores?.skill as Score,
      // @ts-expect-error - this.abilityScores exists on the model schema
      this.abilityScores?.body as Score,
      // @ts-expect-error - this.abilityScores exists on the model schema
      this.abilityScores?.mind as Score,
    )

    // @ts-expect-error - this.hp exists on the model schema
    this.hp = new Meter(
      // @ts-expect-error - this.hp exists on the model schema
      this.hp?.value || 0,
      this.adventurerLevel,
      // @ts-expect-error - this.abilityScores exists on the model schema
      this.abilityScores?.body.vitality.value || 0
    )

    // @ts-expect-error - this.mp exists on the model schema
    this.mp = new Meter(
      // @ts-expect-error - this.mp exists on the model schema
      this.mp?.value || 0, 
      this.classes?.filter(i => i.type === ClassType.Wizard).length || 0,
      // @ts-expect-error - this.abilityScores exists on the model schema
      this.abilityScores?.mind.spirit.value || 0
    )
  }

  static defineSchema() {
    // @ts-expect-error - FVTT types package does not include data model fields
    const { StringField, NumberField, BooleanField, ObjectField, SchemaField, ArrayField } = foundry.data.fields;

    return {
      hp: new ObjectField({
        value: new NumberField({
          initial: 0,
          nullable: false,
          min: 0,
          integer: true,
        })
      }),
      mp: new ObjectField({
        value: new NumberField({
          initial: 0,
          nullable: false,
          min: 0,
          integer: true,
        })
      }),
      xp: new NumberField({}),
      soulscars: new NumberField({}),
      abilityScores: new ObjectField({
        skill: new ObjectField({
          value: new NumberField({
            initial: 0,
            nullable: false,
            min: 0,
            integer: true,
          }),
          dexterity: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            })
          }),
          agility: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            })
          })
        }),
        body: new ObjectField({
          value: new NumberField({
            initial: 0,
            nullable: false,
            min: 0,
            integer: true,
          }),
          strength: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            })
          }),
          vitality: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            })
          })
        }),
        mind: new ObjectField({
          value: new NumberField({
            initial: 0,
            nullable: false,
            min: 0,
            integer: true,
          }),
          intelligence: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
          }),
          spirit: new ObjectField({
            correction: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            }),
            growth: new NumberField({
              initial: 0,
              nullable: false,
              min: 0,
              integer: true,
            })
          })
        })
      }),
      languages: new ArrayField(
        new ObjectField({
          name: new StringField(),
          canSpeak: new BooleanField(),
          canReadWrite: new BooleanField()
        }),
        {
          initial: [{
            name: Language.TradeCommon,
            canSpeak: true,
            canReadWrite: true
          }]
        })
    }
  }

  get race() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .find(({ type }: Item) => type === 'race') || [];
  }

  /**
   * All classes owned by a character
   */
  get classes(): Item[] {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'class') || [];
  }

  get weapons() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'weapon') || [];
  }

  get armor() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'armor') || [];
  }

  get accessories() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'accessory') || [];
  }

  get spells() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'spell') || [];
  }

  get combatFeats() {
    // @ts-expect-error - parent exists on the model's superclass
    return (this.parent as ActorEntity)?.items
      .filter(({ type }: Item) => type === 'feat') || [];
  }

  /**
   * The base evasion score, calculated by adding the following:
   * - currently equipped armor/shield's evasion bonuses
   * - the character's agility mod.
   */
  get evasion() {
    // @ts-expect-error - FVTT types package does not include system object on Actors
    const reducer = (total: number, i: Item) => total + (i.system.evasion || 0);
    
    const armorEvasion = this.armor
      // @ts-expect-error - FVTT types package does not include system object on Actors
      .filter(i => i.system.isEquipped)
      .reduce(reducer, 0);

    // @ts-expect-error - property exists on the model's schema
    return armorEvasion + (this.abilityScores?.skill.agility.modifier || 0);
  }
  /**
   * The total defensive value of all equipped armor
   */
  get defense() {
    // @ts-expect-error - FVTT types package does not include system object on Actors
    const reducer = (total: number, i: Item) => total + (i.system.defense || 0);
    return this.armor
      // @ts-expect-error - FVTT types package does not include system object on Actors
      .filter(i => i.system.isEquipped)
      .reduce(reducer, 0);
  }
  /**
   * The character's fortitude score
   */
  get fortitude() {
    // @ts-expect-error - property exists on the model's schema
    return this.adventurerLevel + (this.abilityScores?.body.vitality.modifier || 0);
  }
  /**
   * The character's willpower score
   */
  get willpower() {
    // @ts-expect-error - property exists on the model's schema
    return this.adventurerLevel + (this.abilityScores?.mind.spirit.modifier || 0);
  }
  /**
   * Unspent XP, available for use to buy levels in classes
   */
  get xpRemaining(): number {
    // @ts-expect-error - FVTT types package does not include system object on Actors
    const reducer = (xp: number, i: Item) => xp - i.system.xpCumulativeCost;
    // @ts-expect-error - I will use reducers to give me numbers from Items and you can't stop me.
    return this.classes.reduce(reducer, this.xp) as unknown as number;
  }
  /**
   * The highest-level class that this character has
   */
  get adventurerLevel(): number {
    const reducer = (highest: number, i: Item) =>
      // @ts-expect-error - FVTT types package does not include system object on Items
      highest >= i.system.level
        ? highest
        // @ts-expect-error - FVTT types package does not include system object on Items
        : i.system.level;
    return this.classes.reduce(reducer, 1);
  }

  get techniquePackageBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddTechniqueSkillPoints',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.skill.dexterity.modifier || 0
    );
  }

  get movementPackageBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddMovementSkillPoints',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.skill.agility.modifier || 0
    );
  }

  get observationPackageBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddObservationSkillPoints',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.mind.intelligence.modifier || 0
    );
  }

  get knowledgePackageBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddKnowledgeSkillPoints',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.mind.intelligence.modifier || 0
    );
  }

  get initiativeBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddInitiative',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.skill.agility.modifier || 0
    );
  }

  get monsterKnowledgeBonus() {
    return this.#getFlaggedPackageBonus(
      'canAddMonsterKnowledge',
      // @ts-expect-error - property exists on the model's schema
      this.abilityScores?.mind.intelligence.modifier || 0
    );
  }

  /**
   * The character's base accuracy
   */
  get accuracy() {
    // @ts-expect-error - property exists on the model's schema
    return this.abilityScores?.skill.dexterity.modifier || 0;
  }

  /**
   * The character's base extra damage for all 
   * weapon types but crossbows and guns
   */
  get extraDamage() {
    // @ts-expect-error - property exists on the model's schema
    return this.abilityScores?.body.strength.modifier || 0;
  }

  /**
   * Some features adjust the character's weapons' critical value. Examples (CR1 pg. 137):
   * - Attacks made with Fencer levels grant a -1 to Critical Value
   * - Combat Feats like "Aimed Attack 1" add a +1 to Critical Value
   * - Spells like "Critical Bullet" grant a -1 to Critical Value 
   * 
   * We can use this value to reflect these adjustments.
   */
  get criticalValueModifier() {
    return 0;
  }

  #getFlaggedPackageBonus(classFlag: string, modifier: number) {
    if (!classFlag)
      return 0;
    // @ts-expect-error - FVTT types package does not include system object on Items
    const reducer = (total: number, i: Item) => total + i.system.level;
    const techniqueClassLevels = this.classes
      // @ts-expect-error - FVTT types package does not include system object on Items
      .filter(i => i.system[classFlag])
      .reduce(reducer, 0);
    if (!techniqueClassLevels)
      return 0;
    return modifier + techniqueClassLevels;
  }
}

export default CharacterDataModel;