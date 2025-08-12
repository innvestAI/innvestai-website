// JavaScript for InnvestAI website

document.addEventListener('DOMContentLoaded', function() {
    
    // Show cookie notice on page load
    showCookieNotice();
    
    // Handle form submission with API
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
            
            // Show loading state
            const submitButton = waitlistForm.querySelector('.send-btn');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'SENDING...';
            submitButton.disabled = true;
            
            // Prepare data for API
            const apiData = {
                name: name,
                email: email,
                message: message || '',
                emailUpdates: emailUpdates
            };
            
            // Send to Lambda Function URL
            fetch('https://mzkdnfb43hmilf2gfsbg6d5lgq0jajdu.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(data.message || 'Thank you for joining our waitlist! We will be in touch soon.', 'success');
                    waitlistForm.reset();
                } else {
                    throw new Error(data.error || 'An error occurred');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert(error.message || 'An error occurred while submitting the form. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
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
        background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#1A2A4A'};
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
