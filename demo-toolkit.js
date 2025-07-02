/**
 * Comfort Mode Toolkit - Demo Version
 * Simplified version for demonstration purposes
 */

class ComfortModeToolkitDemo {
  constructor() {
    this.config = {
      plugins: {
        'font-size': { enabled: true, value: 'large' },
        'font-family': { enabled: true, value: 'hyperlegible' },
        'color-scheme': { enabled: true, value: 'light' }
      }
    };
    
    this.plugins = new Map();
    this.isEnabled = false;
    this.activeSettings = {};
    
    this.init();
  }

  /**
   * Initialize the toolkit
   */
  init() {
    // Load plugins from global variables
    if (window.FontSizePlugin) {
      this.plugins.set('font-size', window.FontSizePlugin);
      window.FontSizePlugin.init();
    }
    
    if (window.FontFamilyPlugin) {
      this.plugins.set('font-family', window.FontFamilyPlugin);
      window.FontFamilyPlugin.init();
    }
    
    if (window.ColorSchemePlugin) {
      this.plugins.set('color-scheme', window.ColorSchemePlugin);
      window.ColorSchemePlugin.init();
    }
    
    this.createToggleButton();
    console.log('Comfort Mode Toolkit Demo initialized with plugins:', Array.from(this.plugins.keys()));
  }

  /**
   * Enable comfort mode
   */
  enable() {
    this.isEnabled = true;
    
    for (const [pluginId, pluginConfig] of Object.entries(this.config.plugins)) {
      const plugin = this.plugins.get(pluginId);
      if (plugin && pluginConfig.enabled) {
        plugin.apply(pluginConfig.value);
        this.activeSettings[pluginId] = pluginConfig.value;
      }
    }
    
    this.updateToggleButton();
    console.log('Comfort mode enabled');
  }

  /**
   * Disable comfort mode
   */
  disable() {
    this.isEnabled = false;
    
    for (const plugin of this.plugins.values()) {
      plugin.reset();
    }
    
    this.activeSettings = {};
    this.updateToggleButton();
    console.log('Comfort mode disabled');
  }

  /**
   * Toggle comfort mode
   */
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Apply specific plugin setting
   */
  applySetting(pluginId, value) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      if (plugin.apply(value)) {
        this.activeSettings[pluginId] = value;
        this.config.plugins[pluginId].value = value;
        this.isEnabled = Object.keys(this.activeSettings).length > 0;
        this.updateToggleButton();
        return true;
      }
    }
    return false;
  }

  /**
   * Create toggle button
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.id = 'cm-toggle-button';
    button.innerHTML = `
      <span>👁️</span>
      <span>Comfort Mode</span>
    `;
    button.setAttribute('aria-label', 'Toggle Comfort Mode');
    button.setAttribute('aria-pressed', this.isEnabled);
    
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    `;
    
    button.addEventListener('click', () => {
      this.toggle();
    });
    
    document.body.appendChild(button);
    this.toggleButton = button;
  }

  /**
   * Update toggle button state
   */
  updateToggleButton() {
    if (this.toggleButton) {
      this.toggleButton.setAttribute('aria-pressed', this.isEnabled);
      this.toggleButton.style.background = this.isEnabled ? '#28a745' : '#0066cc';
    }
  }

  /**
   * Get current state
   */
  getState() {
    return {
      isEnabled: this.isEnabled,
      activeSettings: { ...this.activeSettings },
      plugins: Array.from(this.plugins.keys()),
      config: this.config
    };
  }
}

// Initialize demo version
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.cmToolkit = new ComfortModeToolkitDemo();
  });
}