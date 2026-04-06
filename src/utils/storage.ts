import { FarmRecord, User } from '../types';

const STORAGE_KEYS = {
  RECORDS: 'farmtrack_records',
  USER: 'farmtrack_user',
  TOKEN: 'farmtrack_token',
};

export const storage = {
  getRecords: (): FarmRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },
  saveRecords: (records: FarmRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  saveUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  saveToken: (token: string | null) => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
};
