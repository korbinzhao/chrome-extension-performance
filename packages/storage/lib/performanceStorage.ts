import { BaseStorage, createStorage, StorageType } from './base';

type Performance = { [key: string]: string | object };

type ThemeStorage = BaseStorage<Performance>;

const storage = createStorage<Performance>(
  'matter-perf-storage',
  {},
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

export const performanceStorage: ThemeStorage = {
  ...storage,
  // TODO: extends your own methods
};
