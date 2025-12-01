// Advertising Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize advertising page features
    initCharts();
    initContactForm();
    initPricingCalculator();
    initScrollAnimations();
});

// Initialize Charts for Demographics
function initCharts() {
    // Age Demographics Chart
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
        new Chart(ageCtx, {
            type: 'doughnut',
            data: {
                labels: ['25-34', '35-44', '45-54', '55-64', '18-24'],
                datasets: [{
                    data: [35, 28, 20, 12, 5],
                    backgroundColor: [
                        '#1e3c72',
                        '#2a5298',
                        '#64b5f6',
                        '#90caf9',
                        '#bbdefb'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Roboto',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Professional Roles Chart
    const rolesCtx = document.getElementById('rolesChart');
    if (rolesCtx) {
        new Chart(rolesCtx, {
            type: 'bar',
            data: {
                labels: ['CEOs', 'Managers', 'Directors', 'Entrepreneurs', 'Consultants', 'Others'],
                datasets: [{
                    label: 'Percentage',
                    data: [22, 18, 15, 20, 12, 13],
                    backgroundColor: 'rgba(30, 60, 114, 0.8)',
                    borderColor: '#1e3c72',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('advertisingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! We\'ll contact you within 24 hours with a custom quote.', 'success');
                form.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Track conversion (analytics)
                trackAdvertisingInquiry(data);
            }, 1500);
        });
    }
}

// Pricing Calculator
function initPricingCalculator() {
    const packages = document.querySelectorAll('.package-btn');
    packages.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const packageType = this.closest('.pricing-card').querySelector('h3').textContent;
            showPricingModal(packageType);
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.option-card, .pricing-card, .story-card, .stat-box, .chart-container'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Show Pricing Modal
function showPricingModal(packageType) {
    const modal = document.createElement('div');
    modal.className = 'pricing-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${packageType} Package Details</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you for your interest in our ${packageType} package!</p>
                <p>Our team will contact you within 2 hours to discuss:</p>
                <ul>
                    <li>Custom pricing based on your requirements</li>
                    <li>Available advertising slots</li>
                    <li>Campaign timeline and objectives</li>
                    <li>Analytics and reporting setup</li>
                </ul>
                <div class="quick-contact">
                    <p><strong>Quick Contact:</strong></p>
                    <p><i class="fas fa-phone"></i> +91 98765-43210</p>
                    <p><i class="fas fa-envelope"></i> advertising@bizzshort.com</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cta-button primary" onclick="scrollToContact()">Contact Now</button>
                <button class="cta-button secondary close-modal">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close any open modals
    const modals = document.querySelectorAll('.pricing-modal');
    modals.forEach(modal => modal.remove());
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Track advertising inquiry (analytics)
function trackAdvertisingInquiry(data) {
    // Store inquiry data for analytics
    const inquiries = JSON.parse(localStorage.getItem('advertisingInquiries') || '[]');
    inquiries.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
    });
    localStorage.setItem('advertisingInquiries', JSON.stringify(inquiries));
    
    // Update inquiry counter
    const inquiryCount = inquiries.length;
    localStorage.setItem('totalInquiries', inquiryCount.toString());
    
    console.log('Advertising inquiry tracked:', data);
}

// Real-time visitor counter
function updateVisitorCounter() {
    const counterElement = document.querySelector('.visitor-counter');
    if (counterElement) {
        let count = parseInt(localStorage.getItem('pageVisits') || '0');
        count++;
        localStorage.setItem('pageVisits', count.toString());
        counterElement.textContent = count.toLocaleString();
    }
}

// Initialize visitor counter
updateVisitorCounter();

// Package comparison functionality
function initPackageComparison() {
    const compareButtons = document.querySelectorAll('.compare-package');
    const selectedPackages = new Set();
    
    compareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const packageName = this.dataset.package;
            
            if (selectedPackages.has(packageName)) {
                selectedPackages.delete(packageName);
                this.textContent = 'Compare';
                this.classList.remove('selected');
            } else if (selectedPackages.size < 3) {
                selectedPackages.add(packageName);
                this.textContent = 'Remove';
                this.classList.add('selected');
            }
            
            updateComparisonView(selectedPackages);
        });
    });
}

// Update comparison view
function updateComparisonView(selectedPackages) {
    const comparisonSection = document.querySelector('.package-comparison');
    
    if (selectedPackages.size > 1 && !comparisonSection) {
        createComparisonSection(Array.from(selectedPackages));
    } else if (selectedPackages.size <= 1 && comparisonSection) {
        comparisonSection.remove();
    }
}

// ROI Calculator
function initROICalculator() {
    const calculatorBtn = document.querySelector('.roi-calculator-btn');
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', showROICalculator);
    }
}

function showROICalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'roi-calculator-modal';
    calculator.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>ROI Calculator</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="calculator-form">
                    <div class="form-group">
                        <label>Monthly Advertising Budget (₹)</label>
                        <input type="number" id="adBudget" placeholder="50000" min="1000">
                    </div>
                    <div class="form-group">
                        <label>Average Order Value (₹)</label>
                        <input type="number" id="orderValue" placeholder="5000" min="100">
                    </div>
                    <div class="form-group">
                        <label>Expected Conversion Rate (%)</label>
                        <input type="number" id="conversionRate" placeholder="2.5" min="0.1" max="100" step="0.1">
                    </div>
                    <button class="calculate-btn" onclick="calculateROI()">Calculate ROI</button>
                </div>
                <div class="roi-results" id="roiResults" style="display: none;">
                    <h4>Projected Results</h4>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="result-label">Monthly Visitors</span>
                            <span class="result-value" id="monthlyVisitors">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Expected Conversions</span>
                            <span class="result-value" id="expectedConversions">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Revenue Generated</span>
                            <span class="result-value" id="revenueGenerated">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">ROI Percentage</span>
                            <span class="result-value" id="roiPercentage">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(calculator);
    
    // Close functionality
    const closeBtn = calculator.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => calculator.remove());
    
    calculator.addEventListener('click', function(e) {
        if (e.target === calculator) {
            calculator.remove();
        }
    });
}

// Calculate ROI
function calculateROI() {
    const budget = parseFloat(document.getElementById('adBudget').value) || 0;
    const orderValue = parseFloat(document.getElementById('orderValue').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    
    if (budget && orderValue && conversionRate) {
        // Estimated monthly visitors based on budget (₹1 = 1 visitor)
        const monthlyVisitors = Math.round(budget);
        
        // Calculate conversions
        const conversions = Math.round(monthlyVisitors * (conversionRate / 100));
        
        // Calculate revenue
        const revenue = conversions * orderValue;
        
        // Calculate ROI
        const roi = ((revenue - budget) / budget) * 100;
        
        // Display results
        document.getElementById('monthlyVisitors').textContent = monthlyVisitors.toLocaleString();
        document.getElementById('expectedConversions').textContent = conversions.toLocaleString();
        document.getElementById('revenueGenerated').textContent = '₹' + revenue.toLocaleString();
        document.getElementById('roiPercentage').textContent = roi.toFixed(1) + '%';
        
        document.getElementById('roiResults').style.display = 'block';
    }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initPackageComparison();
    initROICalculator();
});