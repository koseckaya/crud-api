import { ERROR_MSG } from '../constants';
import { CreateUserDto, ValidationResult } from '../types';

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateUserData = (data: unknown): ValidationResult => {
  const userData = data as CreateUserDto;

  if (!userData.username || !userData.age || !Array.isArray(userData.hobbies)) {
    return {
      isValid: false,
      message: ERROR_MSG.MISSING_REQUIRED_FIELDS
    };
  }

  if (
    typeof userData.username !== 'string' ||
    typeof userData.age !== 'number' ||
    !Array.isArray(userData.hobbies) ||
    !userData.hobbies.every((hobby) => typeof hobby === 'string')
  ) {
    return {
      isValid: false,
      message: ERROR_MSG.INVALID_DATA_TYPES
    };
  }

  return {
    isValid: true,
    data: userData
  };
};
