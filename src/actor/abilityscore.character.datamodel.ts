export type Score = {
  value: number;
} & {
  [key: string]: AbilitySubScore;
}

export default class AbilityScoreSet {
  skill: AbilityScoreSkill;
  body: AbilityScoreBody;
  mind: AbilityScoreMind;

  constructor(skill: Score, body: Score, mind: Score) {
    this.skill = new AbilityScoreSkill(skill.value, skill.dexterity, skill.agility);
    this.body = new AbilityScoreBody(body.value, body.strength, body.vitality);
    this.mind = new AbilityScoreMind(mind.value, mind.intelligence, mind.spirit);
  }
}

/**
 * Provide derived ability scores, given the following: 
 *  - a core ability score
 *  - two correction values
 *  - two growth values
 * 
 * Note: you should not be using this class! It's a parent class for
 * the classes you *should* be using (namely `AbilityScoreSkill`,
 * `AbilityScoreBody`, and `AbilityScoreMind`).
 */
class AbilityScore {
  /**
   * The core value for this set of ability scores
   */
  value: number;
  /**
   * The correction value for this score's first subscore --
   * what we add to the core value at character creation to get
   * the final value.
   */
  correctionA: number;
  /**
   * The correction value for this score's second subscore --
   * what we add to the core value at character creation to get
   * the final value.
   */
  correctionB: number;
  /**
   * The growth value for this score's first subscore --
   * can randomly increase every game session. It is added to the
   * core value and correction value.
   */
  growthA: number;
  /**
   * The growth value for this score's second subscore --
   * can randomly increase every game session. It is added to the
   * core value and correction value.
   */
  growthB: number;

  constructor(
    value: number,
    { correction: correctionA, growth: growthA  }: AbilitySubScore,
    { correction: correctionB, growth: growthB  }: AbilitySubScore,
  ) {
    this.value = value;
    this.correctionA = correctionA;
    this.growthA = growthA;
    this.correctionB = correctionB;
    this.growthB = growthB;
  }
}

/**
 * A class representing the core ability score "Skill" 
 * @extends {AbilityScore}
 */
class AbilityScoreSkill extends AbilityScore {
  get dexterity() {
    return new AbilitySubScore(this.value, this.correctionA, this.growthA);
  }

  get agility() {
    return new AbilitySubScore(this.value, this.correctionB, this.growthB);
  }
}

/**
 * A class representing the core ability score "Body" 
 * @extends {AbilityScore}
 */
class AbilityScoreBody extends AbilityScore {
  get strength() {
    return new AbilitySubScore(this.value, this.correctionA, this.growthA);
  }

  get vitality() {
    return new AbilitySubScore(this.value, this.correctionB, this.growthB);
  }
}

/**
 * A class representing the core ability score "Mind" 
 * @extends {AbilityScore}
 */
class AbilityScoreMind extends AbilityScore {
  get intelligence() {
    return new AbilitySubScore(this.value, this.correctionA, this.growthA);
  }

  get spirit() {
    return new AbilitySubScore(this.value, this.correctionB, this.growthB);
  }
}

/**
 * Given a core value, correction value, and growth value,
 * provide the total derived ability score and modifier.
 * 
 * We use this to calculate the following character sheet stats:
 * - Dexterity
 * - Agility
 * - Strength
 * - Vitality
 * - Intelligence
 * - Spirit
 */
class AbilitySubScore {
  /**
   * The value assigned at character creation; the base value for this ability score.
   * @private
   */
  #corevalue: number;
  /**
   * The value rolled at character creation that adjusts the core ability score.
   * @private
   */
  #correction: number;
  /**
   * How much this value has grown since character creation
   * @private
   */
  #growth: number;

  constructor(value: number, correction: number, growth: number) {
    this.#corevalue = value;
    this.#correction = correction;
    this.#growth = growth;
  }

  /**
   * The adjusted core ability score, accounting for correction and growth values.
   */
  get value(): number {
    return this.#corevalue + this.#correction + this.#growth;
  }

  /**
   * The value rolled at character creation that adjusts the core ability score.
   */
  get correction(): number {
    return this.#correction;
  }

  /**
   * How much this value has grown since character creation
   */
  get growth(): number {
    return this.#growth;
  }

  /**
   * The ability score modifier; value divided by 6, rounded down.
   */
  get modifier(): number {
    return Math.floor(this.value / 6)
  }
}