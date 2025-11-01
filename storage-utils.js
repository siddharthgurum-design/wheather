/**
 * STORAGE UTILITIES MODULE
 * Demonstrates: Local Storage API, Data Persistence, Error Handling
 * 
 * This module handles all browser storage operations using the Web Storage API.
 * It provides methods for storing and retrieving user preferences, search history,
 * and favorite locations.
 */

const StorageUtils = {
  // Storage keys as constants to avoid typos
  KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    FAVORITES: 'weather_favorites',
    THEME: 'weather_theme',
    UNIT: 'weather_unit'
  },

  /**
   * Generic method to get data from localStorage
   * Demonstrates: Try-catch error handling, JSON parsing
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Generic method to set data in localStorage
   * Demonstrates: JSON serialization, error handling
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  /**
   * Get search history
   * Demonstrates: Array operations, default values
   */
  getSearchHistory() {
    return this.getItem(this.KEYS.SEARCH_HISTORY, []);
  },

  /**
   * Add a city to search history
   * Demonstrates: Array manipulation, Set for uniqueness, Array methods
   */
  addToSearchHistory(city) {
    const history = this.getSearchHistory();
    
    // Remove duplicates and add to beginning
    const updatedHistory = [
      city,
      ...history.filter(item => item.toLowerCase() !== city.toLowerCase())
    ].slice(0, 10); // Keep only last 10 searches
    
    this.setItem(this.KEYS.SEARCH_HISTORY, updatedHistory);
    return updatedHistory;
  },

  /**
   * Clear search history
   */
  clearSearchHistory() {
    this.setItem(this.KEYS.SEARCH_HISTORY, []);
  },

  /**
   * Get favorite locations
   * Demonstrates: Object storage, complex data structures
   */
  getFavorites() {
    return this.getItem(this.KEYS.FAVORITES, []);
  },

  /**
   * Add a location to favorites
   * Demonstrates: Object manipulation, duplicate checking
   */
  addToFavorites(location) {
    const favorites = this.getFavorites();
    
    // Check if already exists
    const exists = favorites.some(
      fav => fav.name.toLowerCase() === location.name.toLowerCase()
    );
    
    if (!exists) {
      const updatedFavorites = [...favorites, {
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        addedAt: new Date().toISOString()
      }];
      
      this.setItem(this.KEYS.FAVORITES, updatedFavorites);
      return { success: true, favorites: updatedFavorites };
    }
    
    return { success: false, message: 'Location already in favorites' };
  },

  /**
   * Remove a location from favorites
   * Demonstrates: Array filtering, immutability
   */
  removeFromFavorites(locationName) {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(
      fav => fav.name.toLowerCase() !== locationName.toLowerCase()
    );
    
    this.setItem(this.KEYS.FAVORITES, updatedFavorites);
    return updatedFavorites;
  },

  /**
   * Check if a location is in favorites
   */
  isFavorite(locationName) {
    const favorites = this.getFavorites();
    return favorites.some(
      fav => fav.name.toLowerCase() === locationName.toLowerCase()
    );
  },

  /**
   * Get user's preferred theme
   * Demonstrates: Boolean storage, default values
   */
  getTheme() {
    return this.getItem(this.KEYS.THEME, 'light');
  },

  /**
   * Set user's preferred theme
   */
  setTheme(theme) {
    this.setItem(this.KEYS.THEME, theme);
  },

  /**
   * Get user's preferred temperature unit
   */
  getUnit() {
    return this.getItem(this.KEYS.UNIT, 'celsius');
  },

  /**
   * Set user's preferred temperature unit
   */
  setUnit(unit) {
    this.setItem(this.KEYS.UNIT, unit);
  },

  /**
   * Clear all app data
   * Demonstrates: Batch operations
   */
  clearAll() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  /**
   * Get storage usage statistics
   * Demonstrates: String manipulation, calculation
   */
  getStorageStats() {
    let totalSize = 0;
    const stats = {};
    
    Object.entries(this.KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      const size = item ? new Blob([item]).size : 0;
      stats[name] = {
        size: size,
        sizeKB: (size / 1024).toFixed(2)
      };
      totalSize += size;
    });
    
    return {
      individual: stats,
      total: totalSize,
      totalKB: (totalSize / 1024).toFixed(2)
    };
  }
};

// Export for use in other modules
// In a real module system, you'd use: export default StorageUtils;
// For browser compatibility without build tools, we attach to window
if (typeof window !== 'undefined') {
  window.StorageUtils = StorageUtils;
}
