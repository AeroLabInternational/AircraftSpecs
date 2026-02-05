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

        // Create map centered on selected airport
        rangeMap = L.map('rangeMap').setView([lat, lng], 3);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(rangeMap);

        // Add marker for departure airport
        L.marker([lat, lng]).addTo(rangeMap)
            .bindPopup('<b>Departure Airport</b>')
            .openPopup();

        // Convert nautical miles to meters (1 NM = 1852 meters)
        const ferryRangeMeters = ferryRangeNM * 1852;
        const passengerRangeMeters = passengerRangeNM * 1852;

        // Add ferry range circle (blue)
        ferryCircle = L.circle([lat, lng], {
            color: 'rgba(54, 162, 235, 0.8)',
            fillColor: 'rgba(54, 162, 235, 0.2)',
            fillOpacity: 0.3,
            radius: ferryRangeMeters,
            weight: 2
        }).addTo(rangeMap);
        ferryCircle.bindPopup(`<b>Ferry Range</b><br>${ferryRangeNM.toLocaleString()} NM (${Math.round(ferryRangeNM * 1.852).toLocaleString()} km)`);

        // Add passenger range circle (red)
        passengerCircle = L.circle([lat, lng], {
            color: 'rgba(255, 99, 132, 0.8)',
            fillColor: 'rgba(255, 99, 132, 0.2)',
            fillOpacity: 0.3,
            radius: passengerRangeMeters,
            weight: 2
        }).addTo(rangeMap);
        passengerCircle.bindPopup(`<b>Max Range</b><br>${passengerRangeNM.toLocaleString()} NM (${Math.round(passengerRangeNM * 1.852).toLocaleString()} km)`);

        // Fit map to show both circles
        rangeMap.fitBounds(ferryCircle.getBounds(), { padding: [50, 50] });
    }

    // Initialize map with default location
    initializeMap(defaultLat, defaultLng);

    // Airport search functionality
    const airportSearch = document.getElementById('airportSearch');
    if (airportSearch) {
        airportSearch.addEventListener('change', function(e) {
            const coords = e.target.value.split(',');
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            initializeMap(lat, lng);
        });
    }
}

// Runway Length Horizontal Bar Chart
function initRunwayChart(balancedField, part91, part135, landing) {
    const runwayCtx = document.getElementById('runwayChart');
    if (!runwayCtx) return;

    new Chart(runwayCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Balanced Field Length', 'Part 91 Takeoff', 'Part 135 Takeoff', 'Landing Distance'],
            datasets: [{
                label: 'Distance (feet)',
                data: [balancedField, part91, part135, landing],
                backgroundColor: [
                    'rgba(0, 102, 204, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(102, 153, 255, 0.8)',
                    'rgba(153, 204, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 102, 204, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(102, 153, 255, 1)',
                    'rgba(153, 204, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.x || 0;
                            const meters = Math.round(value * 0.3048);
                            return [
                                label,
                                'Distance: ' + value.toLocaleString() + ' ft',
                                'Distance: ' + meters.toLocaleString() + ' m'
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Distance (feet)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    grid: {
                        display: false
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
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return [
                                    label,
                                    'Cost: $' + value.toLocaleString(),
                                    'Share: ' + percentage + '%'
                                ];
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
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(201, 203, 207, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)'
                    ],
                    borderColor: [
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(201, 203, 207, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return [
                                    label,
                                    'Cost: $' + value.toLocaleString(),
                                    'Share: ' + percentage + '%'
                                ];
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
