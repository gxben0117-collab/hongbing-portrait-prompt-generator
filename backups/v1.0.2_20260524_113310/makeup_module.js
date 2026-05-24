// Makeup Module v1.0.0
// Runtime makeup management - loads from 核心資料/妝容模組.json

/**
 * Makeup module for runtime use
 * Provides makeup definitions, risk assessment, and validation
 */

// This will be populated by loading the JSON file
let MAKEUP_DATA = null;

/**
 * Load makeup data from JSON file
 * @returns {Promise<Object>} Makeup data object
 */
async function loadMakeupData() {
  if (MAKEUP_DATA) return MAKEUP_DATA;

  try {
    const response = await fetch('核心資料/妝容模組.json');
    MAKEUP_DATA = await response.json();
    return MAKEUP_DATA;
  } catch (error) {
    console.error('Failed to load makeup data:', error);
    return null;
  }
}

/**
 * Get all makeup definitions
 * @returns {Array} Array of makeup objects
 */
function getAllMakeups() {
  if (!MAKEUP_DATA) {
    console.warn('Makeup data not loaded. Call loadMakeupData() first.');
    return [];
  }
  return MAKEUP_DATA.makeups || [];
}

/**
 * Get makeup by ID
 * @param {string} id - Makeup ID
 * @returns {Object|null} Makeup object or null if not found
 */
function getMakeupById(id) {
  const makeups = getAllMakeups();
  return makeups.find(m => m.id === id) || null;
}

/**
 * Get makeups by category
 * @param {string} category - Category name
 * @returns {Array} Array of makeup objects
 */
function getMakeupsByCategory(category) {
  const makeups = getAllMakeups();
  return makeups.filter(m => m.category === category);
}

/**
 * Get makeups by risk level
 * @param {string} riskLevel - Risk level (low, medium, high)
 * @returns {Array} Array of makeup objects
 */
function getMakeupsByRiskLevel(riskLevel) {
  const makeups = getAllMakeups();
  return makeups.filter(m => m.riskLevel === riskLevel);
}

/**
 * Get high-risk makeups (for monitoring)
 * @returns {Array} Array of high-risk makeup objects
 */
function getHighRiskMakeups() {
  return getMakeupsByRiskLevel('high');
}

/**
 * Check if a makeup ID exists
 * @param {string} id - Makeup ID
 * @returns {boolean} True if makeup exists
 */
function makeupExists(id) {
  return getMakeupById(id) !== null;
}

/**
 * Validate makeup ID and return warnings if any
 * @param {string} id - Makeup ID
 * @returns {Object} Validation result {valid, warnings, makeup}
 */
function validateMakeup(id) {
  const makeup = getMakeupById(id);

  if (!makeup) {
    return {
      valid: false,
      warnings: [`Makeup ID "${id}" not found in makeup module`],
      makeup: null
    };
  }

  const warnings = [];

  if (makeup.riskLevel === 'high') {
    warnings.push(`High-risk makeup: ${makeup.name} - ${makeup.category}`);
    if (makeup.warnings) {
      warnings.push(...makeup.warnings);
    }
  }

  if (makeup.riskLevel === 'medium') {
    warnings.push(`Medium-risk makeup: ${makeup.name} - monitor for face changes`);
  }

  return {
    valid: true,
    warnings,
    makeup
  };
}

/**
 * Get makeup statistics
 * @returns {Object} Statistics object
 */
function getMakeupStats() {
  const makeups = getAllMakeups();

  const stats = {
    total: makeups.length,
    byCategory: {},
    byRiskLevel: {
      low: 0,
      medium: 0,
      high: 0
    }
  };

  makeups.forEach(makeup => {
    // Count by category
    if (!stats.byCategory[makeup.category]) {
      stats.byCategory[makeup.category] = 0;
    }
    stats.byCategory[makeup.category]++;

    // Count by risk level
    if (makeup.riskLevel) {
      stats.byRiskLevel[makeup.riskLevel]++;
    }
  });

  return stats;
}

/**
 * Convert makeup data to legacy MK array format (for backward compatibility)
 * @returns {Array} Array in legacy format [{id, name, desc}, ...]
 */
function toLegacyFormat() {
  const makeups = getAllMakeups();
  return makeups.map(m => ({
    id: m.id,
    name: m.name,
    desc: m.desc
  }));
}

/**
 * Get category information
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null
 */
function getCategoryInfo(categoryId) {
  if (!MAKEUP_DATA || !MAKEUP_DATA.categories) return null;
  return MAKEUP_DATA.categories[categoryId] || null;
}

/**
 * Get all categories
 * @returns {Object} Categories object
 */
function getAllCategories() {
  if (!MAKEUP_DATA) return {};
  return MAKEUP_DATA.categories || {};
}

/**
 * Search makeups by tag
 * @param {string} tag - Tag to search for
 * @returns {Array} Array of makeup objects with matching tag
 */
function searchByTag(tag) {
  const makeups = getAllMakeups();
  return makeups.filter(m => m.tags && m.tags.includes(tag));
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MakeupModule = {
    loadMakeupData,
    getAllMakeups,
    getMakeupById,
    getMakeupsByCategory,
    getMakeupsByRiskLevel,
    getHighRiskMakeups,
    makeupExists,
    validateMakeup,
    getMakeupStats,
    toLegacyFormat,
    getCategoryInfo,
    getAllCategories,
    searchByTag
  };
}

// For Node.js environment (testing/scripts)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadMakeupData,
    getAllMakeups,
    getMakeupById,
    getMakeupsByCategory,
    getMakeupsByRiskLevel,
    getHighRiskMakeups,
    makeupExists,
    validateMakeup,
    getMakeupStats,
    toLegacyFormat,
    getCategoryInfo,
    getAllCategories,
    searchByTag
  };
}
