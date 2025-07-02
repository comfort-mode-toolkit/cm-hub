/**
 * Color Scheme Plugin
 * Controls color scheme adjustments for comfort mode
 */

const ColorSchemePlugin = {
  id: 'color-scheme',
  
  options: {
    light: {
      label: 'Light Mode (Default)',
      value: 'light',
      className: 'cm-color-scheme-light'
    },
    dark: {
      label: 'Dark Mode',
      value: 'dark',
      className: 'cm-color-scheme-dark'
    },
    'high-contrast': {
      label: 'High Contrast',
      value: 'high-contrast',
      className: 'cm-color-scheme-high-contrast'
    }
  },

  /**
   * Apply color scheme setting
   * @param {string} value - The color scheme value to apply
   */
  apply(value) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove any existing color-scheme classes
    this.reset();
    
    // Apply the new color scheme
    if (this.options[value]) {
      const className = this.options[value].className;
      htmlElement.classList.add(className);
      bodyElement.classList.add(className);
      
      // Set CSS custom properties for dynamic theming
      this._applyColorVariables(value);
      
      // Update meta theme-color for mobile browsers
      this._updateThemeColor(value);
      
      // Handle system preference changes
      this._updateSystemPreference(value);
      
      console.log(`Color scheme applied: ${value}`);
      return true;
    }
    
    console.warn(`Invalid color scheme value: ${value}`);
    return false;
  },

  /**
   * Reset color scheme to default
   */
  reset() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove all color-scheme classes
    Object.values(this.options).forEach(option => {
      htmlElement.classList.remove(option.className);
      bodyElement.classList.remove(option.className);
    });
    
    // Reset CSS custom properties
    htmlElement.style.removeProperty('--cm-current-bg-color');
    htmlElement.style.removeProperty('--cm-current-text-color');
    htmlElement.style.removeProperty('--cm-current-accent-color');
    htmlElement.style.removeProperty('--cm-current-border-color');
    htmlElement.style.removeProperty('--cm-current-hover-color');
    
    // Reset theme color
    this._updateThemeColor('light');
    
    console.log('Color scheme reset to default');
  },

  /**
   * Get the current color scheme setting
   * @returns {string|null} Current color scheme value or null if not set
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
   * @returns {boolean} True if any color scheme setting is applied
   */
  isActive() {
    return this.getCurrent() !== null;
  },

  /**
   * Apply color variables for the scheme
   * @private
   * @param {string} value - Color scheme value
   */
  _applyColorVariables(value) {
    const htmlElement = document.documentElement;
    const colorValues = this._getColorValues(value);
    
    htmlElement.style.setProperty('--cm-current-bg-color', colorValues.bg);
    htmlElement.style.setProperty('--cm-current-text-color', colorValues.text);
    htmlElement.style.setProperty('--cm-current-accent-color', colorValues.accent);
    htmlElement.style.setProperty('--cm-current-border-color', colorValues.border);
    htmlElement.style.setProperty('--cm-current-hover-color', colorValues.hover);
  },

  /**
   * Get color values for a scheme
   * @private
   * @param {string} value - Color scheme value
   * @returns {object} Color values
   */
  _getColorValues(value) {
    const colorSchemes = {
      light: {
        bg: '#ffffff',
        text: '#333333',
        accent: '#0066cc',
        border: '#e0e0e0',
        hover: '#f5f5f5'
      },
      dark: {
        bg: '#1a1a1a',
        text: '#e0e0e0',
        accent: '#4da6ff',
        border: '#404040',
        hover: '#2a2a2a'
      },
      'high-contrast': {
        bg: '#000000',
        text: '#ffffff',
        accent: '#ffff00',
        border: '#ffffff',
        hover: '#333333'
      }
    };
    
    return colorSchemes[value] || colorSchemes.light;
  },

  /**
   * Update theme color meta tag
   * @private
   * @param {string} value - Color scheme value
   */
  _updateThemeColor(value) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    const colorValues = this._getColorValues(value);
    themeColorMeta.content = colorValues.bg;
  },

  /**
   * Update system color scheme preference
   * @private
   * @param {string} value - Color scheme value
   */
  _updateSystemPreference(value) {
    const htmlElement = document.documentElement;
    
    // Set color-scheme CSS property for system integration
    if (value === 'dark') {
      htmlElement.style.setProperty('color-scheme', 'dark');
    } else if (value === 'light') {
      htmlElement.style.setProperty('color-scheme', 'light');
    } else {
      htmlElement.style.setProperty('color-scheme', 'light dark');
    }
  },

  /**
   * Get system color scheme preference
   * @returns {string} 'light' or 'dark'
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  /**
   * Auto-apply based on system preference
   */
  applySystemPreference() {
    const systemPreference = this.getSystemPreference();
    this.apply(systemPreference);
  },

  /**
   * Listen for system preference changes
   * @param {function} callback - Callback function to execute on change
   */
  watchSystemPreference(callback) {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        const newScheme = e.matches ? 'dark' : 'light';
        if (typeof callback === 'function') {
          callback(newScheme);
        }
      });
    }
  },

  /**
   * Initialize the plugin
   */
  init() {
    console.log('Color Scheme plugin initialized');
    
    // Watch for system preference changes
    this.watchSystemPreference((newScheme) => {
      console.log(`System color scheme changed to: ${newScheme}`);
    });
  },

  /**
   * Get plugin metadata
   * @returns {object} Plugin metadata
   */
  getMetadata() {
    return {
      id: this.id,
      name: 'Color Scheme',
      description: 'Switch between light, dark, and high contrast themes',
      category: 'Appearance',
      version: '1.0.0'
    };
  }
};

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorSchemePlugin;
} else if (typeof window !== 'undefined') {
  window.ColorSchemePlugin = ColorSchemePlugin;
}

export default ColorSchemePlugin;