import { Role, CarHeight, Companion, Follow, HelpingUtil } from 'models/backend/common/enums';
import { Enum, EnumTypes } from 'types';

const UNKNOWN_ENUM_TYPE = 'Ukendt';

/**
 * Translate an enum value to a string
 * @param key Enum value to translate
 * @returns The translated enum value
 */
export const translateEnum = (key: Enum, type: EnumTypes): string => {
  switch (type) {
    case CarHeight: {
      switch (key) {
        case CarHeight.Any: return 'Alle';
        case CarHeight.Low: return 'Lav';
        case CarHeight.High: return 'Høj';
        default: return UNKNOWN_ENUM_TYPE
      }
    }
    case Companion: {
      switch (key) {
        case Companion.Alone: return 'Alene';
        case Companion.WithRelative: return 'Med pårørende';
        case Companion.WithHelper: return 'Med hjælper';
        case Companion.WithCompanion: return 'Med ledsager';
        case Companion.WithPet: return 'Med kæledyr';
        case Companion.WithChild: return 'Med barn';
        default: return UNKNOWN_ENUM_TYPE
      }
    }
    case Follow: {
      switch (key) {
        case Follow.No: return 'Nej';
        case Follow.AtDesitnation: return 'Ved destination';
        case Follow.AtPickup: return 'Ved afhentning';
        case Follow.Both: return 'Ved begge';
        default: return UNKNOWN_ENUM_TYPE
      }
    }
    case HelpingUtil: {
      switch (key) {
        case HelpingUtil.None: return 'Ingen';
        case HelpingUtil.WalkingStick: return 'Gangstok';
        case HelpingUtil.Crutches: return 'Krykker';
        case HelpingUtil.Rollator: return 'Rollator';
        case HelpingUtil.Wheelchair: return 'Kørestol';
        default: return UNKNOWN_ENUM_TYPE
      }
    }
    case Role: {
      switch (key) {
        case Role.Citizen: return 'Borger';
        case Role.Admin: return 'Admin';
        default: return UNKNOWN_ENUM_TYPE
      }
    }
    default: return UNKNOWN_ENUM_TYPE
  }
};

/**
 * Revert an enum translation to an enum value
 * @param translation The enum translation to revert
 * @param enumType Type of enum to revert
 * @returns Enum value from the translation
 */
export const revertTranslationForEnum = (translation: string, enumType: EnumTypes): number => {
  const keys = Object.keys(enumType)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));
  const values = keys.map(key => translateEnum(key, enumType));
  const index = values.indexOf(translation);
  return keys[index];
};

/**
 * Get a list of enum values
 * @param enumType Enum type to get list from
 * @returns List of enum values
 */
export const getListFromEnum = (enumType: EnumTypes): number[] => {
  return Object.keys(enumType)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));
};