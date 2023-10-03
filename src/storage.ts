import { storageFactory } from './utils/storage-factory'

export const local = storageFactory(() => localStorage)
export const session = storageFactory(() => sessionStorage)
