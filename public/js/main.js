/**
 * Fusion CMS - Main JavaScript File
 * This file contains all client-side logic for the EJS templates
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initializeModals();
  initializeToasts();
  initializeThemeToggle();
  initializeFormFields();
  initializeTableActions();
});

/**
 * Modal functionality
 */
function initializeModals() {
  // Toggle modal visibility
  document.querySelectorAll('[data-modal-toggle]').forEach((button) => {
    const modalId = button.getAttribute('data-modal-toggle');
    const modal = document.getElementById(modalId);

    if (modal) {
      button.addEventListener('click', () => {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
      });
    }
  });

  // Open modals
  document.querySelectorAll('[data-modal-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        // Handle modal close with escape key
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeModal(modalId);
        });
      }
    });
  });

  // Close modals
  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-close');
      closeModal(modalId);
    });
  });

  // Close when clicking overlay
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        const modalId = overlay.getAttribute('id');
        closeModal(modalId);
      }
    });
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

/**
 * Toast notification functionality
 */
function initializeToasts() {
  // Close toast notifications
  document.querySelectorAll('[data-toast-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const toastId = button.getAttribute('data-toast-close');
      const toast = document.getElementById(toastId);
      if (toast) {
        toast.classList.add('opacity-0');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }
    });
  });
}

// Show a toast notification
function showToast(message, type = 'success', duration = 5000) {
  const id = 'toast-' + Date.now();
  let toastContainer = document.getElementById('toast-container');

  if (!toastContainer) {
    // Create toast container if it doesn't exist
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(container);
    toastContainer = container;
  }

  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast ${type} flex items-center justify-between p-4 rounded-md shadow-md transition-all transform translate-x-0 opacity-100`;
  toast.style.minWidth = '300px';

  // Add color based on type
  if (type === 'success') {
    toast.classList.add('bg-green-100', 'border-l-4', 'border-green-500', 'text-green-700');
  } else if (type === 'error') {
    toast.classList.add('bg-red-100', 'border-l-4', 'border-red-500', 'text-red-700');
  } else if (type === 'warning') {
    toast.classList.add('bg-yellow-100', 'border-l-4', 'border-yellow-500', 'text-yellow-700');
  } else {
    toast.classList.add('bg-blue-100', 'border-l-4', 'border-blue-500', 'text-blue-700');
  }

  toast.innerHTML = `
    <span>${message}</span>
    <button data-toast-close="${id}" class="ml-4 text-gray-500 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Add event listener to close button
  toast.querySelector('[data-toast-close]').addEventListener('click', () => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });

  // Auto-close after duration
  if (duration > 0) {
    setTimeout(() => {
      if (document.getElementById(id)) {
        toast.classList.add('opacity-0');
        setTimeout(() => {
          if (document.getElementById(id)) {
            toast.remove();
          }
        }, 300);
      }
    }, duration);
  }

  return toast;
}

/**
 * Theme toggling functionality
 */
function initializeThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Update button state
  updateThemeToggleButton();

  // Toggle theme
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';

      // Update UI immediately for better UX
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateThemeToggleButton();

      // Save theme preference to server via fetch
      fetch('/preferences/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ theme: newTheme }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            console.error('Failed to save theme preference');
          }
        })
        .catch((error) => {
          console.error('Error saving theme preference:', error);
        });
    });
  }
}

function updateThemeToggleButton() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-toggle-sun-icon');
  const moonIcon = document.getElementById('theme-toggle-moon-icon');

  if (themeToggleBtn && sunIcon && moonIcon) {
    if (document.documentElement.classList.contains('dark')) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
}

/**
 * Form field functionality
 */
function initializeFormFields() {
  // Handle schema field addition in add schema form
  const addFieldButton = document.getElementById('add-schema-field');
  if (addFieldButton) {
    addFieldButton.addEventListener('click', () => {
      const fieldsContainer = document.getElementById('schema-fields-container');
      const fieldCount = fieldsContainer.querySelectorAll('.schema-field').length;

      const newField = document.createElement('div');
      newField.className = 'schema-field flex items-center gap-4 mb-4';
      newField.innerHTML = `
        <input type="text" name="fields[${fieldCount}][name]" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Field name">
        <select name="fields[${fieldCount}][type]" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="date">Date</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
        <button type="button" class="remove-field inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      `;

      fieldsContainer.appendChild(newField);

      // Add event listener to remove button
      newField.querySelector('.remove-field').addEventListener('click', () => {
        newField.remove();
        // Renumber remaining fields
        renumberSchemaFields();
      });
    });
  }

  // Initialize remove field buttons
  document.querySelectorAll('.remove-field').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.schema-field').remove();
      renumberSchemaFields();
    });
  });

  // Handle form submissions with AJAX
  document.querySelectorAll('form[data-ajax="true"]').forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const url = form.getAttribute('action');
      const method = form.getAttribute('method') || 'POST';

      fetch(url, {
        method: method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showToast(data.message, 'success');

            // Close modal if form is in a modal
            const modalId = form.closest('.modal')?.id;
            if (modalId) {
              closeModal(modalId);
            }

            // Redirect if specified
            if (data.redirect) {
              setTimeout(() => {
                window.location.href = data.redirect;
              }, 1000);
            }
          } else {
            showToast(data.message || 'An error occurred', 'error');
          }
        })
        .catch((error) => {
          showToast('An error occurred while submitting the form', 'error');
          console.error('Form submission error:', error);
        });
    });
  });
}

function renumberSchemaFields() {
  const fieldsContainer = document.getElementById('schema-fields-container');
  if (!fieldsContainer) return;

  const fields = fieldsContainer.querySelectorAll('.schema-field');
  fields.forEach((field, index) => {
    const nameInput = field.querySelector('input[name^="fields["]');
    const typeSelect = field.querySelector('select[name^="fields["]');

    if (nameInput) nameInput.name = `fields[${index}][name]`;
    if (typeSelect) typeSelect.name = `fields[${index}][type]`;
  });
}

/**
 * Table functionality
 */
function initializeTableActions() {
  // Handle delete buttons in tables
  document.querySelectorAll('[data-delete-url]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        const url = button.getAttribute('data-delete-url');

        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              showToast(data.message, 'success');

              // Remove the table row
              const row = button.closest('tr');
              if (row) {
                row.style.opacity = '0';
                setTimeout(() => {
                  row.remove();
                }, 300);
              }

              // Redirect if specified
              if (data.redirect) {
                setTimeout(() => {
                  window.location.href = data.redirect;
                }, 1000);
              }
            } else {
              showToast(data.message || 'An error occurred', 'error');
            }
          })
          .catch((error) => {
            showToast('An error occurred while processing your request', 'error');
            console.error('Delete request error:', error);
          });
      }
    });
  });

  // Copy API key functionality
  window.copyApiKey = function () {
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
      apiKeyInput.select();
      document.execCommand('copy');
      showToast('API key copied to clipboard', 'success');
    }
  };
}
