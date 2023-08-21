export enum GearRank {
  B = 0,
  A = 1,
  S = 2,
  SS = 3
}

export enum ItemSourceEra {
  Current = 'current',
  Diabolic = 'diabolic',
  Magitech = 'magitech',
  Magic = 'magic',
  Divine = 'divine',
}

export enum AmmunitionType {
  Bow = "arrow",
  Crossbow = "quarrel",
  Gun = "bullet"
}

export enum WeaponCategory {
  Sword = 'sword',
  Axe = 'axe',
  Spear = 'spear',
  Mace = 'mace',
  Staff = 'staff',
  Flail = 'flail',
  Warhammer = 'warhammer',
  Wrestling = 'wrestling',
  Thrown = 'thrown',
  Shield = 'shield',
  Bow = 'bow',
  Crossbow = 'crossbow',
  Gun = 'gun'
};

export const MeleeWeaponCategories = [
  WeaponCategory.Axe,
  WeaponCategory.Flail,
  WeaponCategory.Mace,
  WeaponCategory.Shield,
  WeaponCategory.Spear,
  WeaponCategory.Staff,
  WeaponCategory.Sword,
  WeaponCategory.Warhammer
];

export const WrestlingWeaponCategories = [
  WeaponCategory.Wrestling,
]

export const ShootingWeaponCategories = [
  WeaponCategory.Bow,
  WeaponCategory.Crossbow
]

export const GunWeaponCategories = [
  WeaponCategory.Gun
]

export const ThrownWeaponCategories = [
  WeaponCategory.Thrown,
]

export enum WeaponStanceType {
  Thrown = 0,
  OneHand = 1,
  TwoHand = 2
}

export enum WeaponDamageType {
  Edged = "edged",
  Bludgeoning = "bludgeoning",
  Magic = "magical",
}

export enum ArmorCategory {
  Nonmetal = 'nonmetal',
  Metal = 'metal',
  Shield = 'shield'
};

export enum AccessorySlot {
  Head = "head",
  Face = "face",
  Ear = "ear",
  Neck = "neck", 
  Back = "back",
  Hand = "hand",
  Waist = "waist",
  Feet = "feet",
  Any = "any",
  Other = "other",
}


export enum ClassType {
  Warrior = 'warrior',
  Wizard = 'wizard',
  Other = 'other',
};

export enum Language {
  TradeCommon = "common",
}