import { CreateUserDto, User } from '../types';
import { mockUsers } from './mock';
import { v4 as uuidv4 } from 'uuid';

class Users {
  private users: User[] = [];
  constructor() {
    this.users = [...mockUsers];
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

export const usersDB = new Users();
