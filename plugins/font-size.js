/**
 * Font Size Plugin
 * Controls font size adjustments for comfort mode
 */

const FontSizePlugin = {
  id: 'font-size',
  
  options: {
    small: {
      label: 'Small Text',
      value: 'small',
      className: 'cm-font-size-small'
    },
    medium: {
      label: 'Medium Text (Default)',
      value: 'medium',
      className: 'cm-font-size-medium'
    },
    large: {
      label: 'Large Text',
      value: 'large',
      className: 'cm-font-size-large'
    },
    xl: {
      label: 'Extra Large Text',
      value: 'xl',
      className: 'cm-font-size-xl'
    },
    xxl: {
      label: 'Extra Extra Large Text',
      value: 'xxl',
      className: 'cm-font-size-xxl'
    }
  },

  /**
   * Apply font size setting
   * @param {string} value - The font size value to apply
   */
  apply(value) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove any existing font-size classes
    this.reset();
    
    // Apply the new font size
    if (this.options[value]) {
      const className = this.options[value].className;
      htmlElement.classList.add(className);
      bodyElement.classList.add(className);
      
      // Also set CSS custom property for dynamic scaling
      const cssValue = this._getFontSizeValue(value);
      htmlElement.style.setProperty('--cm-current-font-size', cssValue);
      
      console.log(`Font size applied: ${value} (${cssValue})`);
      return true;
    }
    
    console.warn(`Invalid font size value: ${value}`);
    return false;
  },

  /**
   * Reset font size to default
   */
  reset() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove all font-size classes
    Object.values(this.options).forEach(option => {
      htmlElement.classList.remove(option.className);
      bodyElement.classList.remove(option.className);
    });
    
    // Reset CSS custom property
    htmlElement.style.removeProperty('--cm-current-font-size');
    
    console.log('Font size reset to default');
  },

  /**
   * Get the current font size setting
   * @returns {string|null} Current font size value or null if not set
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
   * @returns {boolean} True if any font size setting is applied
   */
  isActive() {
    return this.getCurrent() !== null;
  },

  /**
   * Get CSS value for font size
   * @private
   * @param {string} value - Font size value
   * @returns {string} CSS font size value
   */
  _getFontSizeValue(value) {
    const sizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem'
    };
    
    return sizeMap[value] || '1rem';
  },

  /**
   * Initialize the plugin
   */
  init() {
    console.log('Font Size plugin initialized');
  },

  /**
   * Get plugin metadata
   * @returns {object} Plugin metadata
   */
  getMetadata() {
    return {
      id: this.id,
      name: 'Font Size',
      description: 'Adjust text size for better readability',
      category: 'Typography',
      version: '1.0.0'
    };
  }
};

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FontSizePlugin;
} else if (typeof window !== 'undefined') {
  window.FontSizePlugin = FontSizePlugin;
}

export default FontSizePlugin;