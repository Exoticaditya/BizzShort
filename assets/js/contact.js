// Contact Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!validateContactForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success simulation
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Optional: Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'engagement',
                        'event_label': data.subject || 'general'
                    });
                }
                
            }, 2000);
        });
    }
    
    // Form Validation
    function validateContactForm(data) {
        const errors = [];
        
        // Required fields validation
        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters long');
        }
        
        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters long');
        }
        
        if (!data.email || !validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject) {
            errors.push('Please select a subject');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        // Phone validation (if provided)
        if (data.phone && data.phone.length > 0 && !validatePhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return false;
        }
        
        return true;
    }
    
    // Phone number validation
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing error
        clearFieldError(field);
        
        let isValid = true;
        let errorMessage = '';
        
        switch(fieldName) {
            case 'firstName':
            case 'lastName':
                if (field.hasAttribute('required') && (!value || value.length < 2)) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters long';
                }
                break;
                
            case 'email':
                if (field.hasAttribute('required') && (!value || !validateEmail(value))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                if (value && !validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'message':
                if (field.hasAttribute('required') && (!value || value.length < 10)) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
                
            case 'subject':
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'Please select a subject';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Add error message if it doesn't exist
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.innerHTML = `0/${maxLength} characters`;
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.innerHTML = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
            
            if (length > maxLength) {
                counter.classList.add('error');
                this.value = this.value.substring(0, maxLength);
            } else {
                counter.classList.remove('error');
            }
        });
    }
    
    // Auto-resize textarea
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            autoResize(this);
        });
    }
    
    // WhatsApp contact functionality
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const message = "Hello! I'm interested in learning more about BizzShort's business news services.";
            const phoneNumber = "919999935011"; // Remove + and spaces
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
    
    // Copy contact info to clipboard
    const contactDetails = document.querySelectorAll('.contact-details p');
    contactDetails.forEach(detail => {
        detail.addEventListener('click', function() {
            const text = this.textContent.trim();
            if (text.includes('@') || text.includes('+91')) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('Contact info copied to clipboard!', 'info');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showNotification('Contact info copied!', 'info');
                });
            }
        });
        
        // Add visual feedback
        if (detail.textContent.includes('@') || detail.textContent.includes('+91')) {
            detail.style.cursor = 'pointer';
            detail.title = 'Click to copy';
        }
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item h4');
    faqItems.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            
            // Close all other answers
            document.querySelectorAll('.faq-item p').forEach(p => {
                p.style.display = 'none';
            });
            document.querySelectorAll('.faq-item h4').forEach(h => {
                h.classList.remove('active');
            });
            
            // Toggle current answer
            if (!isOpen) {
                answer.style.display = 'block';
                this.classList.add('active');
            }
        });
        
        question.style.cursor = 'pointer';
    });
    
    // Form field focus effects
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (field.value) {
            field.parentNode.classList.add('focused');
        }
    });
    
});

// Utility function for email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification function (if not already defined)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}