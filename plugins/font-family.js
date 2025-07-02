/**
 * Font Family Plugin
 * Controls font family adjustments for comfort mode
 */

const FontFamilyPlugin = {
  id: 'font-family',
  
  options: {
    default: {
      label: 'Default Font',
      value: 'default',
      className: 'cm-font-family-default'
    },
    hyperlegible: {
      label: 'Atkinson Hyperlegible (Accessibility)',
      value: 'hyperlegible',
      className: 'cm-font-family-hyperlegible'
    },
    dyslexic: {
      label: 'OpenDyslexic (Dyslexia Support)',
      value: 'dyslexic',
      className: 'cm-font-family-dyslexic'
    },
    serif: {
      label: 'Serif Font',
      value: 'serif',
      className: 'cm-font-family-serif'
    },
    mono: {
      label: 'Monospace Font',
      value: 'mono',
      className: 'cm-font-family-mono'
    }
  },

  /**
   * Apply font family setting
   * @param {string} value - The font family value to apply
   */
  apply(value) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove any existing font-family classes
    this.reset();
    
    // Apply the new font family
    if (this.options[value]) {
      const className = this.options[value].className;
      htmlElement.classList.add(className);
      bodyElement.classList.add(className);
      
      // Also set CSS custom property for dynamic usage
      const cssValue = this._getFontFamilyValue(value);
      htmlElement.style.setProperty('--cm-current-font-family', cssValue);
      
      // Load font if needed
      this._loadFont(value);
      
      console.log(`Font family applied: ${value} (${cssValue})`);
      return true;
    }
    
    console.warn(`Invalid font family value: ${value}`);
    return false;
  },

  /**
   * Reset font family to default
   */
  reset() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove all font-family classes
    Object.values(this.options).forEach(option => {
      htmlElement.classList.remove(option.className);
      bodyElement.classList.remove(option.className);
    });
    
    // Reset CSS custom property
    htmlElement.style.removeProperty('--cm-current-font-family');
    
    console.log('Font family reset to default');
  },

  /**
   * Get the current font family setting
   * @returns {string|null} Current font family value or null if not set
   */
  getCurrent() {
    const htmlElement = document.documentElement;
    
    for (const [key, option] of Object.entries(this.options)) {
      if (htmlElement.classList.contains(option.className)) {
        return key;
      }
    }
    
    return null;
  },

  /**
   * Check if plugin is currently active
   * @returns {boolean} True if any font family setting is applied
   */
  isActive() {
    return this.getCurrent() !== null;
  },

  /**
   * Get CSS value for font family
   * @private
   * @param {string} value - Font family value
   * @returns {string} CSS font family value
   */
  _getFontFamilyValue(value) {
    const familyMap = {
      default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      hyperlegible: '"Atkinson Hyperlegible", Arial, sans-serif',
      dyslexic: '"OpenDyslexic", Arial, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: '"Consolas", "Monaco", "Courier New", monospace'
    };
    
    return familyMap[value] || familyMap.default;
  },

  /**
   * Load font if it's a web font
   * @private
   * @param {string} value - Font family value
   */
  _loadFont(value) {
    // Check if font needs to be loaded from Google Fonts or other CDN
    const fontUrls = {
      hyperlegible: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      // OpenDyslexic would need to be hosted separately or loaded from a CDN
      dyslexic: null // Placeholder - would need proper CDN link or local hosting
    };
    
    if (fontUrls[value] && !this._isFontLoaded(value)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrls[value];
      link.onload = () => {
        console.log(`Font loaded: ${value}`);
      };
      link.onerror = () => {
        console.warn(`Failed to load font: ${value}`);
      };
      document.head.appendChild(link);
    }
  },

  /**
   * Check if font is already loaded
   * @private
   * @param {string} value - Font family value
   * @returns {boolean} True if font is loaded
   */
  _isFontLoaded(value) {
    const fontUrls = {
      hyperlegible: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible',
      dyslexic: null
    };
    
    if (!fontUrls[value]) return true;
    
    // Check if link already exists in document
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    return Array.from(existingLinks).some(link => 
      link.href && link.href.includes('Atkinson+Hyperlegible')
    );
  },

  /**
   * Initialize the plugin
   */
  init() {
    console.log('Font Family plugin initialized');
  },

  /**
   * Get plugin metadata
   * @returns {object} Plugin metadata
   */
  getMetadata() {
    return {
      id: this.id,
      name: 'Font Family',
      description: 'Choose accessible and comfortable font families',
      category: 'Typography',
      version: '1.0.0'
    };
  }
};

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FontFamilyPlugin;
} else if (typeof window !== 'undefined') {
  window.FontFamilyPlugin = FontFamilyPlugin;
}

export default FontFamilyPlugin;