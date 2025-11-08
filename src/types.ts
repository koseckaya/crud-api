import { STATUS_CODES } from './constants';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface CreateUserDto {
  username: string;
  age: number;
  hobbies: string[];
}

export interface ValidationError {
  isValid: false;
  message: string;
}

export interface ValidationSuccess {
  isValid: true;
  data: CreateUserDto;
}

export type ValidationResult = ValidationError | ValidationSuccess;

export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
