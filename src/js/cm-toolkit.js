/**
 * Comfort Mode Toolkit - Main Entry Point
 * Modular plugin architecture for accessible web experiences
 */

class ComfortModeToolkit {
  constructor(configPath = './cm-config.json') {
    this.config = null;
    this.plugins = new Map();
    this.isEnabled = false;
    this.activeSettings = {};
    this.configPath = configPath;
    
    this.init();
  }

  /**
   * Initialize the toolkit
   */
  async init() {
    try {
      await this.loadConfig();
      await this.loadPlugins();
      this.loadUserPreferences();
      this.setupEventListeners();
      this.createUI();
      
      console.log('Comfort Mode Toolkit initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Comfort Mode Toolkit:', error);
    }
  }

  /**
   * Load configuration from JSON file
   */
  async loadConfig() {
    try {
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      this.config = await response.json();
      console.log('Configuration loaded:', this.config);
    } catch (error) {
      console.warn('Using default configuration due to error:', error);
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * Load enabled plugins dynamically
   */
  async loadPlugins() {
    const pluginPromises = [];
    
    for (const [pluginId, pluginConfig] of Object.entries(this.config.plugins)) {
      if (pluginConfig.enabled) {
        pluginPromises.push(this.loadPlugin(pluginId));
      }
    }
    
    await Promise.all(pluginPromises);
    console.log(`Loaded ${this.plugins.size} plugins`);
  }

  /**
   * Load individual plugin
   * @param {string} pluginId - Plugin identifier
   */
  async loadPlugin(pluginId) {
    try {
      let plugin;
      
      // Dynamic import with fallback for different environments
      try {
        const module = await import(`./plugins/${pluginId}.js`);
        plugin = module.default;
      } catch (importError) {
        // Fallback for environments without ES modules support
        if (window[this.toCamelCase(pluginId) + 'Plugin']) {
          plugin = window[this.toCamelCase(pluginId) + 'Plugin'];
        } else {
          throw importError;
        }
      }
      
      if (plugin && plugin.id === pluginId) {
        this.plugins.set(pluginId, plugin);
        plugin.init();
        console.log(`Plugin loaded: ${pluginId}`);
      } else {
        throw new Error(`Invalid plugin structure: ${pluginId}`);
      }
    } catch (error) {
      console.error(`Failed to load plugin ${pluginId}:`, error);
    }
  }

  /**
   * Enable comfort mode
   * @param {string|array} plugins - Specific plugins to enable, or 'all'
   */
  enable(plugins = 'all') {
    this.isEnabled = true;
    
    const pluginsToEnable = this.resolvePluginList(plugins);
    
    pluginsToEnable.forEach(pluginId => {
      const plugin = this.plugins.get(pluginId);
      const pluginConfig = this.config.plugins[pluginId];
      
      if (plugin && pluginConfig && pluginConfig.enabled) {
        const value = pluginConfig.value;
        plugin.apply(value);
        this.activeSettings[pluginId] = value;
      }
    });
    
    // Update UI state
    this.updateUI();
    
    // Save preferences
    this.saveUserPreferences();
    
    // Announce change for accessibility
    this.announceChange(`Comfort mode enabled`);
    
    console.log('Comfort mode enabled with plugins:', pluginsToEnable);
  }

  /**
   * Disable comfort mode
   * @param {string|array} plugins - Specific plugins to disable, or 'all'
   */
  disable(plugins = 'all') {
    const pluginsToDisable = this.resolvePluginList(plugins);
    
    pluginsToDisable.forEach(pluginId => {
      const plugin = this.plugins.get(pluginId);
      if (plugin) {
        plugin.reset();
        delete this.activeSettings[pluginId];
      }
    });
    
    // Check if any plugins are still active
    this.isEnabled = Object.keys(this.activeSettings).length > 0;
    
    // Update UI state
    this.updateUI();
    
    // Save preferences
    this.saveUserPreferences();
    
    // Announce change for accessibility
    this.announceChange(`Comfort mode disabled`);
    
    console.log('Comfort mode disabled for plugins:', pluginsToDisable);
  }

  /**
   * Toggle comfort mode
   * @param {string|array} plugins - Specific plugins to toggle, or 'all'
   */
  toggle(plugins = 'all') {
    if (this.isEnabled) {
      this.disable(plugins);
    } else {
      this.enable(plugins);
    }
  }

  /**
   * Apply specific plugin setting
   * @param {string} pluginId - Plugin identifier
   * @param {string} value - Setting value to apply
   */
  applySetting(pluginId, value) {
    const plugin = this.plugins.get(pluginId);
    const pluginConfig = this.config.plugins[pluginId];
    
    if (plugin && pluginConfig && pluginConfig.enabled) {
      if (plugin.apply(value)) {
        this.activeSettings[pluginId] = value;
        this.isEnabled = Object.keys(this.activeSettings).length > 0;
        
        // Update config with new value
        this.config.plugins[pluginId].value = value;
        
        // Update UI and save
        this.updateUI();
        this.saveUserPreferences();
        
        console.log(`Applied setting: ${pluginId} = ${value}`);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Resolve plugin list from various formats
   * @param {string|array} plugins - Plugin specification
   * @returns {array} Array of plugin IDs
   */
  resolvePluginList(plugins) {
    if (plugins === 'all') {
      return Array.from(this.plugins.keys());
    }
    
    if (typeof plugins === 'string') {
      // Check if it's a group
      if (this.config.groups && this.config.groups[plugins]) {
        return this.config.groups[plugins].plugins;
      }
      // Single plugin
      return [plugins];
    }
    
    if (Array.isArray(plugins)) {
      return plugins;
    }
    
    return [];
  }

  /**
   * Create UI elements
   */
  createUI() {
    if (!this.config.ui.toggleButton.enabled) return;
    
    this.createToggleButton();
    
    if (this.config.ui.panel.enabled) {
      this.createControlPanel();
    }
  }

  /**
   * Create toggle button
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.id = 'cm-toggle-button';
    button.className = 'cm-toggle-button';
    button.innerHTML = `
      <span class="cm-toggle-icon">👁️</span>
      ${this.config.ui.toggleButton.showLabels ? 
        `<span class="cm-toggle-label">${this.config.ui.toggleButton.label}</span>` : ''}
    `;
    button.setAttribute('aria-label', 'Toggle Comfort Mode');
    button.setAttribute('aria-pressed', this.isEnabled);
    
    // Position button
    button.style.cssText = `
      position: fixed;
      ${this.config.ui.toggleButton.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${this.config.ui.toggleButton.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
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
    
    // Keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    document.body.appendChild(button);
    this.toggleButton = button;
  }

  /**
   * Create control panel
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'cm-control-panel';
    panel.className = 'cm-control-panel';
    panel.style.display = 'none';
    
    // Panel content will be populated based on enabled plugins
    let panelHTML = `
      <div class="cm-panel-header">
        <h3>Comfort Mode Settings</h3>
        <button class="cm-panel-close" aria-label="Close panel">×</button>
      </div>
      <div class="cm-panel-content">
    `;
    
    // Add controls for each enabled plugin
    for (const [pluginId, plugin] of this.plugins) {
      const pluginConfig = this.config.plugins[pluginId];
      if (pluginConfig.enabled) {
        panelHTML += this.createPluginControls(pluginId, plugin, pluginConfig);
      }
    }
    
    panelHTML += `
      </div>
      <div class="cm-panel-footer">
        <button class="cm-apply-all">Apply All</button>
        <button class="cm-reset-all">Reset All</button>
      </div>
    `;
    
    panel.innerHTML = panelHTML;
    
    // Style the panel
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 300px;
      max-height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 10001;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(panel);
    this.controlPanel = panel;
    
    // Set up panel event listeners
    this.setupPanelEventListeners();
  }

  /**
   * Create controls for a specific plugin
   * @param {string} pluginId - Plugin identifier
   * @param {object} plugin - Plugin instance
   * @param {object} pluginConfig - Plugin configuration
   * @returns {string} HTML string for plugin controls
   */
  createPluginControls(pluginId, plugin, pluginConfig) {
    const metadata = plugin.getMetadata();
    let controlsHTML = `
      <div class="cm-plugin-controls" data-plugin="${pluginId}">
        <h4>${metadata.name}</h4>
        <p class="cm-plugin-description">${metadata.description}</p>
        <div class="cm-plugin-options">
    `;
    
    // Create option buttons/select based on plugin options
    for (const [optionKey, option] of Object.entries(plugin.options)) {
      const isSelected = pluginConfig.value === optionKey;
      controlsHTML += `
        <label class="cm-option-label">
          <input type="radio" name="${pluginId}-option" value="${optionKey}" ${isSelected ? 'checked' : ''}>
          <span class="cm-option-text">${option.label}</span>
        </label>
      `;
    }
    
    controlsHTML += `
        </div>
      </div>
    `;
    
    return controlsHTML;
  }

  /**
   * Set up panel event listeners
   */
  setupPanelEventListeners() {
    // Close button
    const closeButton = this.controlPanel.querySelector('.cm-panel-close');
    closeButton.addEventListener('click', () => {
      this.hideControlPanel();
    });
    
    // Option changes
    const radioButtons = this.controlPanel.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const pluginId = e.target.name.replace('-option', '');
        const value = e.target.value;
        this.applySetting(pluginId, value);
      });
    });
    
    // Apply all button
    const applyAllButton = this.controlPanel.querySelector('.cm-apply-all');
    applyAllButton.addEventListener('click', () => {
      this.enable();
    });
    
    // Reset all button
    const resetAllButton = this.controlPanel.querySelector('.cm-reset-all');
    resetAllButton.addEventListener('click', () => {
      this.disable();
    });
  }

  /**
   * Update UI state
   */
  updateUI() {
    if (this.toggleButton) {
      this.toggleButton.setAttribute('aria-pressed', this.isEnabled);
      this.toggleButton.style.background = this.isEnabled ? '#28a745' : '#0066cc';
    }
  }

  /**
   * Show/hide control panel
   */
  showControlPanel() {
    if (this.controlPanel) {
      this.controlPanel.style.display = 'block';
    }
  }

  hideControlPanel() {
    if (this.controlPanel) {
      this.controlPanel.style.display = 'none';
    }
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Toggle panel on button click (if enabled)
    if (this.config.ui.panel.showOnToggle) {
      document.addEventListener('click', (e) => {
        if (e.target.id === 'cm-toggle-button' || e.target.closest('#cm-toggle-button')) {
          setTimeout(() => {
            if (this.controlPanel) {
              const isVisible = this.controlPanel.style.display === 'block';
              if (isVisible) {
                this.hideControlPanel();
              } else {
                this.showControlPanel();
              }
            }
          }, 100);
        }
      });
    }
    
    // Keyboard shortcuts
    if (this.config.accessibility.keyboardNavigation) {
      document.addEventListener('keydown', (e) => {
        // Alt + C to toggle comfort mode
        if (e.altKey && e.key === 'c') {
          e.preventDefault();
          this.toggle();
        }
        
        // Escape to close panel
        if (e.key === 'Escape' && this.controlPanel && this.controlPanel.style.display === 'block') {
          this.hideControlPanel();
        }
      });
    }
  }

  /**
   * Save user preferences to storage
   */
  saveUserPreferences() {
    if (!this.config.storage.remember) return;
    
    const preferences = {
      isEnabled: this.isEnabled,
      activeSettings: this.activeSettings,
      timestamp: Date.now()
    };
    
    try {
      if (this.config.storage.type === 'localStorage') {
        localStorage.setItem(this.config.storage.key, JSON.stringify(preferences));
      } else if (this.config.storage.type === 'sessionStorage') {
        sessionStorage.setItem(this.config.storage.key, JSON.stringify(preferences));
      }
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  /**
   * Load user preferences from storage
   */
  loadUserPreferences() {
    if (!this.config.storage.remember) return;
    
    try {
      let preferences = null;
      
      if (this.config.storage.type === 'localStorage') {
        const stored = localStorage.getItem(this.config.storage.key);
        preferences = stored ? JSON.parse(stored) : null;
      } else if (this.config.storage.type === 'sessionStorage') {
        const stored = sessionStorage.getItem(this.config.storage.key);
        preferences = stored ? JSON.parse(stored) : null;
      }
      
      if (preferences) {
        // Check expiry
        if (this.config.storage.expiry && preferences.timestamp) {
          const now = Date.now();
          const expiry = preferences.timestamp + (this.config.storage.expiry * 1000);
          if (now > expiry) {
            console.log('Preferences expired, using defaults');
            return;
          }
        }
        
        // Apply saved preferences
        this.activeSettings = preferences.activeSettings || {};
        this.isEnabled = preferences.isEnabled || false;
        
        if (this.isEnabled) {
          // Re-apply active settings
          for (const [pluginId, value] of Object.entries(this.activeSettings)) {
            const plugin = this.plugins.get(pluginId);
            if (plugin) {
              plugin.apply(value);
            }
          }
        }
        
        console.log('Loaded preferences:', preferences);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
  }

  /**
   * Announce changes for accessibility
   * @param {string} message - Message to announce
   */
  announceChange(message) {
    if (!this.config.accessibility.announceChanges) return;
    
    let announcer = document.getElementById('cm-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'cm-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }

  /**
   * Get default configuration
   * @returns {object} Default config object
   */
  getDefaultConfig() {
    return {
      plugins: {
        'font-size': { enabled: true, value: 'medium' },
        'font-family': { enabled: true, value: 'default' },
        'color-scheme': { enabled: true, value: 'light' }
      },
      ui: {
        toggleButton: { enabled: true, position: 'bottom-right', label: 'Comfort Mode', showLabels: true },
        panel: { enabled: true, position: 'right', showOnToggle: false }
      },
      storage: {
        type: 'localStorage',
        key: 'comfort-mode-preferences',
        remember: true
      },
      accessibility: {
        announceChanges: true,
        keyboardNavigation: true
      }
    };
  }

  /**
   * Utility: Convert kebab-case to camelCase
   * @param {string} str - String to convert
   * @returns {string} CamelCase string
   */
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * Get current toolkit state
   * @returns {object} Current state
   */
  getState() {
    return {
      isEnabled: this.isEnabled,
      activeSettings: { ...this.activeSettings },
      plugins: Array.from(this.plugins.keys()),
      config: this.config
    };
  }

  /**
   * Destroy the toolkit and clean up
   */
  destroy() {
    // Remove UI elements
    if (this.toggleButton) {
      this.toggleButton.remove();
    }
    if (this.controlPanel) {
      this.controlPanel.remove();
    }
    
    // Reset all plugins
    this.disable();
    
    // Clear plugins
    this.plugins.clear();
    
    console.log('Comfort Mode Toolkit destroyed');
  }
}

// Auto-initialize if not already done
if (typeof window !== 'undefined' && !window.ComfortModeToolkit) {
  window.ComfortModeToolkit = ComfortModeToolkit;
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.cmToolkit = new ComfortModeToolkit();
    });
  } else {
    window.cmToolkit = new ComfortModeToolkit();
  }
}

// Export for module systems
export default ComfortModeToolkit;