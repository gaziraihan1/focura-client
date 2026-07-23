/**
 * lib/offline/offlineStorage.ts
 *
 * IndexedDB wrapper for offline data storage.
 * Provides a simple API for storing and retrieving data when offline.
 */

const DB_NAME = "focura-offline";
const DB_VERSION = 1;

// ─── Store names ─────────────────────────────────────────────────────────────

export const STORES = {
  TASKS: "tasks",
  PROJECTS: "projects",
  NOTIFICATIONS: "notifications",
  PENDING_MUTATIONS: "pending-mutations",
  USER_DATA: "user-data",
} as const;

// ─── Database connection ─────────────────────────────────────────────────────

let dbInstance: IDBDatabase | null = null;

export async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: "id" });
        taskStore.createIndex("projectId", "projectId", { unique: false });
        taskStore.createIndex("status", "status", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        db.createObjectStore(STORES.PROJECTS, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
        const notifStore = db.createObjectStore(STORES.NOTIFICATIONS, { keyPath: "id" });
        notifStore.createIndex("read", "read", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PENDING_MUTATIONS)) {
        const mutationStore = db.createObjectStore(STORES.PENDING_MUTATIONS, {
          keyPath: "id",
          autoIncrement: true,
        });
        mutationStore.createIndex("timestamp", "timestamp", { unique: false });
        mutationStore.createIndex("type", "type", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
        db.createObjectStore(STORES.USER_DATA, { keyPath: "key" });
      }
    };
  });
}

// ─── Generic CRUD operations ─────────────────────────────────────────────────

export async function getItem<T>(storeName: string, key: string): Promise<T | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putItem<T>(storeName: string, item: T): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function putItems<T>(storeName: string, items: T[]): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    items.forEach((item) => store.put(item));

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteItem(storeName: string, key: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ─── Pending mutations (offline queue) ───────────────────────────────────────

export interface PendingMutation {
  id?: number;
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: "task" | "project" | "notification";
  entityId?: string;
  data?: unknown;
  endpoint: string;
  method: string;
  timestamp: number;
  retryCount: number;
}

export async function addPendingMutation(mutation: Omit<PendingMutation, "id">): Promise<number> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PENDING_MUTATIONS, "readwrite");
    const store = tx.objectStore(STORES.PENDING_MUTATIONS);
    const request = store.add(mutation);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingMutations(): Promise<PendingMutation[]> {
  return getAllItems<PendingMutation>(STORES.PENDING_MUTATIONS);
}

export async function deletePendingMutation(id: number): Promise<void> {
  return deleteItem(STORES.PENDING_MUTATIONS, String(id));
}

export async function clearPendingMutations(): Promise<void> {
  return clearStore(STORES.PENDING_MUTATIONS);
}

// ─── Task-specific helpers ───────────────────────────────────────────────────

export async function cacheTasks(tasks: unknown[]): Promise<void> {
  return putItems(STORES.TASKS, tasks);
}

export async function getCachedTasks(): Promise<unknown[]> {
  return getAllItems(STORES.TASKS);
}

export async function cacheTask(task: unknown): Promise<void> {
  return putItem(STORES.TASKS, task);
}

// ─── Project-specific helpers ────────────────────────────────────────────────

export async function cacheProjects(projects: unknown[]): Promise<void> {
  return putItems(STORES.PROJECTS, projects);
}

export async function getCachedProjects(): Promise<unknown[]> {
  return getAllItems(STORES.PROJECTS);
}

// ─── Notification-specific helpers ───────────────────────────────────────────

export async function cacheNotifications(notifications: unknown[]): Promise<void> {
  return putItems(STORES.NOTIFICATIONS, notifications);
}

export async function getCachedNotifications(): Promise<unknown[]> {
  return getAllItems(STORES.NOTIFICATIONS);
}
