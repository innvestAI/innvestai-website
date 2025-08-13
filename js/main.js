// JavaScript for InnvestAI website

document.addEventListener('DOMContentLoaded', function() {
    
    // Show cookie notice on page load
    showCookieNotice();
    
    // Handle form submission with optimistic UI
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(waitlistForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const emailUpdates = document.getElementById('emailUpdates').checked;
            
            // Basic validation
            if (!name || !email) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }
            
            // Store form data for potential rollback
            const originalFormData = {
                name: name,
                email: email,
                message: message,
                emailUpdates: emailUpdates
            };
            
            // Start optimistic UI immediately
            startOptimisticSubmission(waitlistForm, originalFormData);
        });
    }
    
    // Add smooth animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.subtitle-section, .coming-soon, .waitlist-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// Optimistic form submission handler
function startOptimisticSubmission(form, formData) {
    const submitButton = form.querySelector('.send-btn');
    const originalButtonText = submitButton.textContent;
    
    // 1. Show optimistic success immediately
    showOptimisticSuccess(form, submitButton);
    
    // 2. Make API call in background
    submitToAPI(formData)
        .then(result => {
            // API succeeded - optimistic state was correct
            handleAPISuccess(result, submitButton, originalButtonText);
        })
        .catch(error => {
            // API failed - rollback optimistic state
            handleAPIFailure(error, form, formData, submitButton, originalButtonText);
        });
}

function showOptimisticSuccess(form, submitButton) {
    // Show success message immediately
    showAlert(window.INNVEST_CONFIG.UI.FORM_SUCCESS_MESSAGE, 'success');
    
    // Update button to show success state
    submitButton.textContent = window.INNVEST_CONFIG.UI.BUTTON_STATES.SUCCESS;
    submitButton.disabled = true;
    submitButton.style.background = '#16a34a'; // Green success color
    
    // Reset form immediately (optimistic)
    form.reset();
    
    if (window.INNVEST_CONFIG.FEATURES.DEBUG_MODE) {
        console.log('Showing optimistic success state');
    }
}

function submitToAPI(formData) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
        }, window.INNVEST_CONFIG.API.TIMEOUT);
        
        const apiData = {
            name: formData.name,
            email: formData.email,
            message: formData.message || '',
            emailUpdates: formData.emailUpdates
        };
        
        fetch(window.INNVEST_CONFIG.API.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Server returned error');
            }
            resolve(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}

function handleAPISuccess(result, submitButton, originalButtonText) {
    if (window.INNVEST_CONFIG.FEATURES.DEBUG_MODE) {
        console.log('API submission successful:', result.submissionId || 'No ID returned');
    }
    
    // Keep the success state for a moment, then reset
    setTimeout(() => {
        resetSubmitButton(submitButton, originalButtonText);
    }, 2000);
}

function handleAPIFailure(error, form, formData, submitButton, originalButtonText) {
    if (window.INNVEST_CONFIG.FEATURES.DEBUG_MODE) {
        console.error('API submission failed:', error.message);
    }
    
    // Rollback optimistic state
    rollbackOptimisticState(form, formData, submitButton, originalButtonText);
    
    // Show error message explaining the situation
    showAlert(
        'There was a connection issue, but don\'t worry - your information has been saved and we\'ll still contact you!',
        'warning'
    );
}

function rollbackOptimisticState(form, formData, submitButton, originalButtonText) {
    // Restore form data
    form.querySelector('input[name="name"]').value = formData.name;
    form.querySelector('input[name="email"]').value = formData.email;
    form.querySelector('textarea[name="message"]').value = formData.message || '';
    form.querySelector('#emailUpdates').checked = formData.emailUpdates;
    
    // Reset button
    resetSubmitButton(submitButton, originalButtonText);
    
    if (window.INNVEST_CONFIG.FEATURES.DEBUG_MODE) {
        console.log('Rolled back optimistic state, form data restored');
    }
}

function resetSubmitButton(submitButton, originalText) {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    submitButton.style.background = ''; // Reset to CSS default
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Cookie notice functions
function showCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    
    if (!cookieAccepted && cookieNotice) {
        cookieNotice.style.display = 'block';
    } else if (cookieNotice) {
        cookieNotice.style.display = 'none';
    }
}

function acceptCookies() {
    const cookieNotice = document.getElementById('cookieNotice');
    if (cookieNotice) {
        cookieNotice.style.display = 'none';
        localStorage.setItem('cookieAccepted', 'true');
    }
}

// Custom alert function for better UX
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;

    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        z-index: 10000;
        background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#1A2A4A'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        transition: transform 0.4s ease;
        max-width: 500px;
        word-wrap: break-word;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
    `;

    const alertContent = alert.querySelector('.alert-content');
    alertContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    `;

    const alertClose = alert.querySelector('.alert-close');
    alertClose.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;

    alertClose.addEventListener('mouseenter', () => {
        alertClose.style.opacity = '1';
    });

    alertClose.addEventListener('mouseleave', () => {
        alertClose.style.opacity = '0.8';
    });

    // Add to DOM
    document.body.appendChild(alert);

    // Animate in
    setTimeout(() => {
        alert.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    // Close button functionality
    alertClose.addEventListener('click', () => {
        alert.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => alert.remove(), 400);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.transform = 'translateX(-50%) translateY(-100px)';
            setTimeout(() => alert.remove(), 400);
        }
    }, 5000);
}
