/**
 * AutoSave Utility - Google Forms-like auto-save behavior
 * 
 * Features:
 * - Automatically saves form data to browser localStorage while typing
 * - Restores form data from localStorage on page load
 * - Clears saved data after successful form submission
 * - Provides visual feedback (save status indicator)
 * - Debounces saves to avoid excessive storage writes
 * - Works with localStorage (survives browser close) or sessionStorage (session only)
 * 
 * Usage:
 * const autoSave = new AutoSave('formId', 'saveName', {
 *   debounceDelay: 1000,
 *   storageType: 'localStorage',
 *   onSave: callback,
 *   onRestore: callback
 * });
 */

class AutoSave {
  /**
   * Initialize AutoSave for a form
   * @param {string} formId - ID of the form element to auto-save
   * @param {string} saveName - Unique identifier for this form's saved data
   * @param {Object} options - Configuration options
   */
  constructor(formId, saveName, options = {}) {
    this.formId = formId;
    this.saveName = saveName;
    
    // Configuration options
    this.debounceDelay = options.debounceDelay || 1000; // Delay before saving (ms)
    this.storageType = options.storageType || 'localStorage'; // 'localStorage' or 'sessionStorage'
    this.onSave = options.onSave || (() => {}); // Callback when data is saved
    this.onRestore = options.onRestore || (() => {}); // Callback when data is restored
    this.showIndicator = options.showIndicator !== false; // Show save status indicator
    this.indicatorElementId = options.indicatorElementId || null; // Custom indicator element ID
    
    // Internal state
    this.debounceTimer = null;
    this.form = null;
    this.storage = this.storageType === 'sessionStorage' ? sessionStorage : localStorage;
    this.isSaving = false;
    
    // Initialize
    this.init();
  }

  /**
   * Initialize auto-save functionality
   */
  init() {
    this.form = document.getElementById(this.formId);
    
    if (!this.form) {
      console.error(`[AutoSave] Form with ID "${this.formId}" not found`);
      return;
    }

    // Create and inject status indicator if enabled
    if (this.showIndicator && !this.indicatorElementId) {
      this.createStatusIndicator();
    }

    // Restore previously saved data
    this.restoreFormData();

    // Attach event listeners to all form inputs
    this.attachEventListeners();

    console.log(`[AutoSave] Initialized for form "${this.formId}" with storage "${this.storageType}"`);
  }

  /**
   * Create a visual status indicator element
   */
  createStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = `${this.formId}-auto-save-indicator`;
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '<span class="auto-save-text">Saving...</span>';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 16px;
      background-color: rgba(76, 175, 80, 0.9);
      color: white;
      border-radius: 4px;
      font-size: 13px;
      display: none;
      z-index: 9999;
      font-family: 'Inter', Arial, sans-serif;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      animation: slideInUp 0.3s ease-out;
    `;

    document.body.appendChild(indicator);
    this.indicatorElementId = indicator.id;

    // Add animation styles if not already present
    if (!document.getElementById('auto-save-styles')) {
      const styles = document.createElement('style');
      styles.id = 'auto-save-styles';
      styles.innerHTML = `
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        .auto-save-indicator.saved {
          background-color: rgba(76, 175, 80, 0.9);
        }
        .auto-save-indicator.error {
          background-color: rgba(244, 67, 54, 0.9);
        }
        .auto-save-indicator.hide {
          animation: slideOutDown 0.3s ease-out forwards;
        }
      `;
      document.head.appendChild(styles);
    }
  }

  /**
   * Attach input event listeners to all form fields
   */
  attachEventListeners() {
    const inputs = this.form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      // Listen for input changes
      input.addEventListener('input', () => this.scheduleAutoSave());
      input.addEventListener('change', () => this.scheduleAutoSave());
    });

    // Prevent accidental data loss
    window.addEventListener('beforeunload', (e) => {
      const savedData = this.getFormData();
      if (Object.values(savedData).some(val => val)) {
        // Only warn if form has actual data
        e.preventDefault();
        e.returnValue = '';
      }
    });

    console.log(`[AutoSave] Attached listeners to ${inputs.length} form fields`);
  }

  /**
   * Schedule a save with debouncing to avoid excessive writes
   */
  scheduleAutoSave() {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = setTimeout(() => {
      this.saveFormData();
    }, this.debounceDelay);
  }

  /**
   * Get all form data as an object
   * @returns {Object} Form data keyed by input name
   */
  getFormData() {
    const formData = {};
    const inputs = this.form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        formData[input.name] = input.checked;
      } else {
        formData[input.name] = input.value;
      }
    });

    return formData;
  }

  /**
   * Save form data to browser storage
   */
  saveFormData() {
    try {
      const formData = this.getFormData();
      const saveKey = `autosave_${this.saveName}`;
      
      // Save data with timestamp
      const dataToStore = {
        data: formData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      this.storage.setItem(saveKey, JSON.stringify(dataToStore));
      this.isSaving = false;

      // Show save indicator
      this.showSaveIndicator('Saved', 'saved');

      // Call the save callback
      this.onSave(formData);

      console.log(`[AutoSave] Form data saved for "${this.saveName}"`);
    } catch (error) {
      console.error(`[AutoSave] Error saving form data:`, error);
      this.showSaveIndicator('Save failed', 'error');
    }
  }

  /**
   * Restore form data from browser storage
   */
  restoreFormData() {
    try {
      const saveKey = `autosave_${this.saveName}`;
      const savedContent = this.storage.getItem(saveKey);

      if (!savedContent) {
        console.log(`[AutoSave] No saved data found for "${this.saveName}"`);
        return false;
      }

      const dataToRestore = JSON.parse(savedContent);
      const formData = dataToRestore.data || {};

      // Restore each field
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.name && input.name in formData) {
          const value = formData[input.name];

          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = value;
          } else {
            input.value = value;
          }

          // Trigger change event for any dependent logic
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Call the restore callback
      this.onRestore(formData);

      console.log(`[AutoSave] Form data restored for "${this.saveName}":`, formData);
      return true;
    } catch (error) {
      console.error(`[AutoSave] Error restoring form data:`, error);
      return false;
    }
  }

  /**
   * Show the save status indicator
   * @param {string} message - Message to display
   * @param {string} status - Status type: 'saving', 'saved', 'error'
   * @param {number} duration - How long to show indicator (ms), 0 = indefinite
   */
  showSaveIndicator(message = 'Saved', status = 'saved', duration = 3000) {
    const indicator = document.getElementById(this.indicatorElementId);
    if (!indicator) return;

    indicator.className = `auto-save-indicator ${status}`;
    indicator.querySelector('.auto-save-text').textContent = message;
    indicator.style.display = 'block';

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        indicator.classList.add('hide');
        setTimeout(() => {
          indicator.style.display = 'none';
          indicator.classList.remove('hide');
        }, 300);
      }, duration);
    }
  }

  /**
   * Clear saved data (call after successful form submission)
   */
  clearSavedData() {
    try {
      const saveKey = `autosave_${this.saveName}`;
      this.storage.removeItem(saveKey);
      console.log(`[AutoSave] Saved data cleared for "${this.saveName}"`);
      return true;
    } catch (error) {
      console.error(`[AutoSave] Error clearing saved data:`, error);
      return false;
    }
  }

  /**
   * Check if there is saved data available
   * @returns {boolean}
   */
  hasSavedData() {
    const saveKey = `autosave_${this.saveName}`;
    return !!this.storage.getItem(saveKey);
  }

  /**
   * Get the timestamp of when data was last saved
   * @returns {string|null} ISO timestamp or null if no data
   */
  getLastSaveTime() {
    try {
      const saveKey = `autosave_${this.saveName}`;
      const savedContent = this.storage.getItem(saveKey);
      
      if (!savedContent) return null;

      const dataToRestore = JSON.parse(savedContent);
      return dataToRestore.timestamp || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Manually trigger a save (useful for buttons)
   */
  manualSave() {
    this.saveFormData();
  }

  /**
   * Destroy auto-save (remove listeners)
   */
  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    console.log(`[AutoSave] Auto-save destroyed for "${this.saveName}"`);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoSave;
}
