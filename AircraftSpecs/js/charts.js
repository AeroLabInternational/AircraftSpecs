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
