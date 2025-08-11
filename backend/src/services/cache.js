const NodeCache = require('node-cache');
const config = require('../config');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkperiod,
      useClones: false
    });

    // Cache hit/miss statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  /**
   * Generate cache key for requests
   * @param {string} service - Service name (ai4bharat, huggingface)
   * @param {string} operation - Operation type (translate, ner, etc.)
   * @param {Object} params - Request parameters
   * @returns {string} Cache key
   */
  generateKey(service, operation, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${service}:${operation}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or undefined
   */
  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.stats.hits++;
      console.log(`Cache HIT for key: ${key}`);
      return value;
    } else {
      this.stats.misses++;
      console.log(`Cache MISS for key: ${key}`);
      return undefined;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {boolean} Success status
   */
  set(key, value, ttl = null) {
    this.stats.sets++;
    console.log(`Cache SET for key: ${key}`);
    return this.cache.set(key, value, ttl || config.cache.ttl);
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {number} Number of deleted entries
   */
  del(key) {
    console.log(`Cache DELETE for key: ${key}`);
    return this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  flushAll() {
    console.log('Cache FLUSH ALL');
    this.cache.flushAll();
    this.resetStats();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const cacheStats = this.cache.getStats();
    return {
      ...this.stats,
      keys: cacheStats.keys,
      ksize: cacheStats.ksize,
      vsize: cacheStats.vsize,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  /**
   * Get or set with function
   * @param {string} key - Cache key
   * @param {Function} fn - Function to execute if cache miss
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<any>} Result value
   */
  async getOrSet(key, fn, ttl = null) {
    let value = this.get(key);
    
    if (value === undefined) {
      try {
        value = await fn();
        if (value !== undefined && value !== null) {
          this.set(key, value, ttl);
        }
      } catch (error) {
        console.error(`Error executing function for cache key ${key}:`, error);
        throw error;
      }
    }
    
    return value;
  }

  /**
   * Cache translation results
   * @param {string} text - Source text
   * @param {string} sourceLang - Source language
   * @param {string} targetLang - Target language
   * @param {string} service - Service name
   * @returns {string} Cache key
   */
  getTranslationKey(text, sourceLang, targetLang, service) {
    return this.generateKey(service, 'translate', {
      text: text.trim().toLowerCase(),
      source: sourceLang,
      target: targetLang
    });
  }

  /**
   * Cache medical entity extraction results
   * @param {string} text - Text to analyze
   * @param {string} service - Service name
   * @returns {string} Cache key
   */
  getMedicalNERKey(text, service) {
    return this.generateKey(service, 'ner', {
      text: text.trim().toLowerCase()
    });
  }

  /**
   * Cache symptom classification results
   * @param {string} symptoms - Symptom description
   * @param {string} service - Service name
   * @returns {string} Cache key
   */
  getSymptomClassificationKey(symptoms, service) {
    return this.generateKey(service, 'symptom_classification', {
      symptoms: symptoms.trim().toLowerCase()
    });
  }

  /**
   * Cache TTS results
   * @param {string} text - Text to convert
   * @param {string} language - Language code
   * @param {string} voice - Voice type
   * @param {string} service - Service name
   * @returns {string} Cache key
   */
  getTTSKey(text, language, voice, service) {
    return this.generateKey(service, 'tts', {
      text: text.trim().toLowerCase(),
      language,
      voice
    });
  }

  /**
   * Get cached data with fallback to multiple services
   * @param {Array} keys - Array of cache keys to try
   * @returns {any} First found cached value or undefined
   */
  getWithFallback(keys) {
    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Preload commonly used translations
   */
  async preloadCommonTranslations() {
    const commonMedicalPhrases = [
      'How are you feeling?',
      'Do you have any pain?',
      'Take this medicine',
      'Visit the doctor',
      'Drink plenty of water',
      'Get rest'
    ];

    const languages = ['hi', 'ta', 'te'];
    
    // This would typically load from actual services
    // For now, just setting up the cache structure
    console.log('Preloading common medical translations...');
    
    commonMedicalPhrases.forEach(phrase => {
      languages.forEach(lang => {
        const key = this.getTranslationKey(phrase, 'en', lang, 'ai4bharat');
        // In production, you would fetch actual translations here
        // this.set(key, { translatedText: phrase, cached: true }, 86400); // 24 hours
      });
    });
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;