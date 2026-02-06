// Common Chart.js configuration and utilities

// Default chart colors
const chartColors = {
    primary: 'rgb(0, 102, 204)',
    secondary: 'rgb(0, 73, 153)',
    accent: 'rgb(255, 107, 53)',
    success: 'rgb(75, 192, 192)',
    warning: 'rgb(255, 205, 86)',
    danger: 'rgb(255, 99, 132)',
    info: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)'
};

// Default chart options
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    family: 'Inter',
                    size: 12
                },
                padding: 15
            }
        },
        tooltip: {
            backgroundColor: 'rgba(26, 26, 46, 0.9)',
            titleFont: {
                family: 'Inter',
                size: 14
            },
            bodyFont: {
                family: 'Inter',
                size: 13
            },
            padding: 12,
            cornerRadius: 6
        }
    }
};

// Function to create a comparison chart
function createComparisonChart(canvasId, aircraftData) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Speed', 'Range', 'Capacity', 'Efficiency', 'Reliability', 'Comfort'],
            datasets: aircraftData.map((aircraft, index) => ({
                label: aircraft.name,
                data: aircraft.metrics,
                fill: true,
                backgroundColor: `${Object.values(chartColors)[index % 8]}33`,
                borderColor: Object.values(chartColors)[index % 8],
                pointBackgroundColor: Object.values(chartColors)[index % 8],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: Object.values(chartColors)[index % 8]
            }))
        },
        options: {
            ...defaultChartOptions,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// Function to create a performance trend chart
function createTrendChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                borderColor: Object.values(chartColors)[index % 8],
                backgroundColor: `${Object.values(chartColors)[index % 8]}1A`,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }))
        },
        options: {
            ...defaultChartOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Function to create a specifications bar chart
function createSpecsBarChart(canvasId, labels, data, label = 'Value') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: Object.values(chartColors).map(color => `${color}B3`),
                borderColor: Object.values(chartColors),
                borderWidth: 2
            }]
        },
        options: {
            ...defaultChartOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Animation utility
Chart.defaults.animation = {
    duration: 1000,
    easing: 'easeInOutQuart'
};

Chart.defaults.font.family = 'Inter';

// ===========================
// AIRCRAFT-SPECIFIC CHARTS
// ===========================

// Interactive Range Map with Leaflet
let rangeMap;
let ferryCircle;
let passengerCircle;

function initRangeMap(defaultLat, defaultLng, ferryRangeNM, passengerRangeNM, aircraftName) {
    function initializeMap(lat, lng) {
        // Remove existing map if it exists
        if (rangeMap) {
            rangeMap.remove();
        }

        // Check if the map container exists
        const mapContainer = document.getElementById('rangeMap');
        if (!mapContainer) {
            console.error('rangeMap container not found');
            return;
        }

        // Create map centered on selected airport
        rangeMap = L.map('rangeMap', {
            center: [lat, lng],
            zoom: 3,
            scrollWheelZoom: true,
            preferCanvas: false
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            minZoom: 2,
            crossOrigin: true
        }).addTo(rangeMap);

        // Add marker for departure airport
        const marker = L.marker([lat, lng]).addTo(rangeMap);
        marker.bindPopup('<b>Departure Airport</b><br>Tokyo Haneda (HND)')
            .openPopup();

        // Convert nautical miles to meters (1 NM = 1852 meters)
        const ferryRangeMeters = ferryRangeNM * 1852;
        const passengerRangeMeters = passengerRangeNM * 1852;

        // Add ferry range circle (blue)
        ferryCircle = L.circle([lat, lng], {
            color: '#3690eb',
            fillColor: '#3690eb',
            fillOpacity: 0.15,
            radius: ferryRangeMeters,
            weight: 2
        }).addTo(rangeMap);
        ferryCircle.bindPopup(`<b>Ferry Flight Range</b><br>${ferryRangeNM.toLocaleString()} NM (${Math.round(ferryRangeNM * 1.852).toLocaleString()} km)<br><small>0 passengers, pilots only</small>`);

        // Add passenger range circle (red)
        passengerCircle = L.circle([lat, lng], {
            color: '#ff6384',
            fillColor: '#ff6384',
            fillOpacity: 0.15,
            radius: passengerRangeMeters,
            weight: 2
        }).addTo(rangeMap);
        passengerCircle.bindPopup(`<b>Full Seat Range</b><br>${passengerRangeNM.toLocaleString()} NM (${Math.round(passengerRangeNM * 1.852).toLocaleString()} km)<br><small>With 18 passengers</small>`);

        // Fit map to show both circles
        rangeMap.fitBounds(ferryCircle.getBounds(), { padding: [50, 50] });
        
        // Force map to invalidate size with multiple attempts to ensure proper rendering
        setTimeout(function() {
            if (rangeMap) rangeMap.invalidateSize();
        }, 100);
        
        setTimeout(function() {
            if (rangeMap) rangeMap.invalidateSize();
        }, 300);
        
        setTimeout(function() {
            if (rangeMap) rangeMap.invalidateSize();
        }, 500);
    }

    // Wait a bit before initializing to ensure the DOM is ready
    setTimeout(function() {
        initializeMap(defaultLat, defaultLng);
    }, 250);

    // Return the initializeMap function so it can be called from the search
    return initializeMap;
}

// Runway Length Horizontal Bar Chart
function initRunwayChart(balancedField, part91, part135, landing) {
    const runwayCtx = document.getElementById('runwayChart');
    if (!runwayCtx) {
        console.error('runwayChart canvas not found');
        return;
    }

    // Convert feet to meters
    const balancedFieldM = Math.round(balancedField * 0.3048);
    const part91M = Math.round(part91 * 0.3048);
    const part135M = Math.round(part135 * 0.3048);
    const landingM = Math.round(landing * 0.3048);

    new Chart(runwayCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Balanced Field Length', 'Part 91 Takeoff', 'Part 135 Takeoff', 'Landing Distance'],
            datasets: [{
                label: 'Distance',
                data: [balancedFieldM, part91M, part135M, landingM],
                backgroundColor: [
                    'rgba(0, 51, 153, 0.8)',
                    'rgba(0, 102, 204, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(102, 178, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 51, 153, 1)',
                    'rgba(0, 102, 204, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(102, 178, 255, 1)'
                ],
                borderWidth: 2,
                barPercentage: 0.8,
                categoryPercentage: 0.9
            }]
        },
        options: {
            indexAxis: 'y', // This makes the bars horizontal
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 20
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 15,
                    cornerRadius: 6,
                    titleFont: {
                        family: 'Inter',
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 13
                    },
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const meters = context.parsed.x || 0;
                            const feet = Math.round(meters / 0.3048);
                            return meters.toLocaleString() + ' m (' + feet.toLocaleString() + ' ft)';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Distance (meters)',
                        font: {
                            family: 'Inter',
                            size: 13,
                            weight: 'bold'
                        },
                        padding: { top: 10 }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        maxRotation: 0,
                        minRotation: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.08)',
                        drawBorder: true
                    }
                },
                y: {
                    position: 'left',
                    grid: {
                        display: false,
                        drawBorder: true
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 10
                    }
                }
            }
        }
    });
}

// Cost Breakdown Pie Charts
function initCostCharts(variableCosts, fixedCosts) {
    // Variable Cost Breakdown Pie Chart
    const variableCostCtx = document.getElementById('variableCostChart');
    if (variableCostCtx) {
        new Chart(variableCostCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Fuel', 'Airframe Maintenance', 'Engine/APU Maintenance', 'Crew/Catering/Misc'],
                datasets: [{
                    data: [variableCosts.fuel, variableCosts.airframe, variableCosts.engine, variableCosts.misc],
                    backgroundColor: [
                        'rgba(0, 51, 153, 0.8)',
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(102, 178, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 51, 153, 1)',
                        'rgba(0, 102, 204, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(102, 178, 255, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: true
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            padding: 10,
                            boxWidth: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        cornerRadius: 6,
                        titleFont: {
                            family: 'Inter',
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        },
                        bodySpacing: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    // Fixed Cost Breakdown Pie Chart
    const fixedCostCtx = document.getElementById('fixedCostChart');
    if (fixedCostCtx) {
        new Chart(fixedCostCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Crew Salary & Benefits', 'Crew Training', 'Hangar', 'Insurance', 'Miscellaneous Fixed'],
                datasets: [{
                    data: [fixedCosts.crew, fixedCosts.training, fixedCosts.hangar, fixedCosts.insurance, fixedCosts.misc],
                    backgroundColor: [
                        'rgba(0, 51, 153, 0.8)',
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(102, 178, 255, 0.8)',
                        'rgba(153, 204, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 51, 153, 1)',
                        'rgba(0, 102, 204, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(102, 178, 255, 1)',
                        'rgba(153, 204, 255, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: true
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            padding: 10,
                            boxWidth: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        cornerRadius: 6,
                        titleFont: {
                            family: 'Inter',
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        },
                        bodySpacing: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Dynamic Cost Calculator
function initCostCalculator(hourlyVariableCost, annualFixedCost, defaultHours = 450) {
    function updateCosts() {
        const hoursInput = document.getElementById('annualHours');
        if (!hoursInput) return;

        const hours = parseInt(hoursInput.value) || defaultHours;
        
        // Calculate costs
        const annualVariableCost = hours * hourlyVariableCost;
        const totalAnnualBudget = annualVariableCost + annualFixedCost;
        const costPerHour = totalAnnualBudget / hours;
        
        // Format numbers with commas
        const formatCurrency = (num) => {
            return '$' + num.toLocaleString('en-US');
        };
        
        // Update display
        const annualVarElement = document.getElementById('annualVariableCost');
        const totalBudgetElement = document.getElementById('totalAnnualBudget');
        const costPerHourElement = document.getElementById('costPerHour');

        if (annualVarElement) annualVarElement.textContent = formatCurrency(annualVariableCost);
        if (totalBudgetElement) totalBudgetElement.textContent = formatCurrency(totalAnnualBudget);
        if (costPerHourElement) costPerHourElement.textContent = formatCurrency(Math.round(costPerHour));
    }

    // Initialize with default values
    updateCosts();

    // Add event listener
    const hoursInput = document.getElementById('annualHours');
    if (hoursInput) {
        hoursInput.addEventListener('input', updateCosts);
    }

    return updateCosts;
}
