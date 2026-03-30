import { get, set, del, clear, keys } from 'idb-keyval'

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    return await del(name)
  },
  clear: async (): Promise<void> => {
    await clear()
  },
  keys: async (): Promise<string[]> => {
    return await keys()
  },
  get length(): Promise<number> {
    return keys().then((allKeys) => allKeys.length)
  },
}

export default idbStorage
