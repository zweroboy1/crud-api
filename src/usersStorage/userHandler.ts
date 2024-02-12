import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';
import { USERS_FILE_PATH } from '../constants';

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(USERS_FILE_PATH, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    return [];
  }
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const users = await getUsers();
  const newUser: User = {
    id: uuidv4(),
    ...user,
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

export const getUserById = async (userId: string): Promise<User | undefined> => {
  const users = await getUsers();
  return users.find((user) => user.id === userId);
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    users.splice(index, 1);
    await saveUsers(users);
  }

  return index !== -1;
};

export const updateUser = async (userId: string, updatedUser: Partial<User>): Promise<User | undefined> => {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const updatedUserData = { ...users[index], ...updatedUser };
    users[index] = updatedUserData;
    await saveUsers(users);
    return updatedUserData;
  }

  return undefined;
};

const saveUsers = async (users: User[]): Promise<void> => {
  const data = JSON.stringify(users, null, 2);
  await fs.writeFile(USERS_FILE_PATH, data, 'utf-8');
};

