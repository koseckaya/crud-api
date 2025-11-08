import { v4 as uuidv4 } from 'uuid';
import { User } from '../../types';

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    username: 'John Doe',
    age: 25,
    hobbies: ['coding', 'reading']
  },
  {
    id: uuidv4(),
    username: 'Jane Smith',
    age: 30,
    hobbies: ['traveling', 'photography']
  },
  {
    id: uuidv4(),
    username: 'Mike Johnson',
    age: 28,
    hobbies: ['sports', 'music', 'cooking']
  }
];
