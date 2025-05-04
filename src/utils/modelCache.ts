
/**
 * Utility for caching and retrieving 3D models
 * This helps to avoid redundant API calls and improve load times
 */

interface CachedModel {
  modelUrl: string;
  jobId: string;
  address: string;
  createdAt: string;
  expiresAt: string;
  thumbnailUrl?: string;
}

const CACHE_PREFIX = 'meshy_cache_';
const CACHE_INDEX_KEY = 'meshy_cache_index';
const CACHE_EXPIRY_DAYS = 30; // Models expire after 30 days

export const saveModelToCache = (
  jobId: string, 
  modelUrl: string, 
  address: string,
  thumbnailUrl?: string
) => {
  try {
    if (!jobId || !modelUrl || !address) {
      console.warn("Cannot cache model: missing required parameters");
      return;
    }
    
    // Get current cache index or create a new one
    const cacheIndex: string[] = getCacheIndex();
    
    // Skip if already cached
    if (cacheIndex.includes(jobId)) {
      console.log(`Model ${jobId} already exists in cache`);
      return;
    }
    
    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + CACHE_EXPIRY_DAYS);
    
    // Create cache entry
    const cacheEntry: CachedModel = {
      jobId,
      modelUrl,
      address,
      createdAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      thumbnailUrl
    };
    
    // Save the model to cache
    localStorage.setItem(CACHE_PREFIX + jobId, JSON.stringify(cacheEntry));
    
    // Update the cache index
    cacheIndex.push(jobId);
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(cacheIndex));
    
    console.log(`Model ${jobId} saved to cache. Expires: ${expiryDate.toLocaleDateString()}`);
  } catch (error) {
    console.error("Error saving model to cache:", error);
  }
};

export const getModelFromCache = (jobId: string): CachedModel | null => {
  try {
    const cacheKey = CACHE_PREFIX + jobId;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }
    
    const model: CachedModel = JSON.parse(cachedData);
    
    // Check if the cached model has expired
    if (new Date(model.expiresAt) < new Date()) {
      console.log(`Cached model ${jobId} has expired, removing from cache`);
      removeModelFromCache(jobId);
      return null;
    }
    
    console.log(`Retrieved model ${jobId} from cache`);
    return model;
  } catch (error) {
    console.error("Error retrieving model from cache:", error);
    return null;
  }
};

export const removeModelFromCache = (jobId: string) => {
  try {
    // Remove the model data
    localStorage.removeItem(CACHE_PREFIX + jobId);
    
    // Update the index
    const cacheIndex = getCacheIndex();
    const updatedIndex = cacheIndex.filter(id => id !== jobId);
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
    
    console.log(`Model ${jobId} removed from cache`);
  } catch (error) {
    console.error("Error removing model from cache:", error);
  }
};

export const getCachedModels = (): CachedModel[] => {
  try {
    const cacheIndex = getCacheIndex();
    const models: CachedModel[] = [];
    const expiredIds: string[] = [];
    
    // Retrieve all cached models
    for (const jobId of cacheIndex) {
      const model = getModelFromCache(jobId);
      if (model) {
        models.push(model);
      } else {
        expiredIds.push(jobId);
      }
    }
    
    // Clean up expired models from index
    if (expiredIds.length > 0) {
      const updatedIndex = cacheIndex.filter(id => !expiredIds.includes(id));
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
    }
    
    return models;
  } catch (error) {
    console.error("Error retrieving cached models:", error);
    return [];
  }
};

export const clearModelCache = () => {
  try {
    const cacheIndex = getCacheIndex();
    
    // Remove all cached models
    for (const jobId of cacheIndex) {
      localStorage.removeItem(CACHE_PREFIX + jobId);
    }
    
    // Clear the index
    localStorage.removeItem(CACHE_INDEX_KEY);
    
    console.log("Model cache cleared");
  } catch (error) {
    console.error("Error clearing model cache:", error);
  }
};

export const getCacheIndex = (): string[] => {
  try {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch (error) {
    console.error("Error retrieving cache index:", error);
    return [];
  }
};
