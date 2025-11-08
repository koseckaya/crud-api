import { CreateUserDto, User } from '../types';
import { mockUsers } from './mock';
import { v4 as uuidv4 } from 'uuid';

class Users {
  private users: User[] = [];
  private static instance: Users;

  constructor() {
    this.users = [...mockUsers];
  }

  public static getInstance(): Users {
    if (!Users.instance) {
      Users.instance = new Users();
    }
    return Users.instance;
  }

  public synchronizationDB(users: User[]): void {
    this.users = users;
  }

  getAllUsers(): User[] {
    return this.users;
  }
  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
  addUser(userData: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }
  updateUser(id: string, updatedUser: User): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      return updatedUser;
    }
    return undefined;
  }
  deleteUser(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const usersDB = Users.getInstance();
