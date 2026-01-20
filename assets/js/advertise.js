/**
 * Advertise Page - Chart.js Initialization
 * Displays audience demographics and professional roles data
 */

document.addEventListener('DOMContentLoaded', function () {
    // Age Demographics Chart
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
        new Chart(ageCtx, {
            type: 'doughnut',
            data: {
                labels: ['25-34', '35-44', '45-54', '55+', '18-24'],
                datasets: [{
                    label: 'Age Distribution',
                    data: [35, 30, 20, 10, 5],
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#f39c12',
                        '#27ae60',
                        '#9b59b6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                family: "'Poppins', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
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
                labels: ['C-Level', 'Directors', 'Managers', 'Entrepreneurs', 'Professionals'],
                datasets: [{
                    label: 'Percentage',
                    data: [25, 20, 18, 22, 15],
                    backgroundColor: '#3498db',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + '% of audience';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Form Submission Handler
    const advertisingForm = document.getElementById('advertisingForm');
    if (advertisingForm) {
        advertisingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                companyName: document.getElementById('companyName').value,
                contactName: document.getElementById('contactName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                adType: document.getElementById('adType').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value
            };

            console.log('Form submitted:', formData);

            // Show success message
            alert('Thank you for your interest! Our advertising team will contact you within 24 hours.');

            // Reset form
            advertisingForm.reset();
        });
    }
});
