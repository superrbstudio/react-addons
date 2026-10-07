import idbStorage from './storage/idb'
import { local, session } from './storage/web-storage'

export { local, session }
export const idb = idbStorage
