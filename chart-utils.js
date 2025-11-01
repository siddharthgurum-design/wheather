/**
 * CHART UTILITIES MODULE
 * Demonstrates: Data Visualization, Chart.js Integration, Data Transformation
 * 
 * This module handles all chart-related operations for visualizing weather data.
 * It uses Chart.js library to create interactive and responsive charts.
 */

const ChartUtils = {
  // Store chart instances to allow updates and cleanup
  chartInstances: {},

  /**
   * Initialize or update a temperature forecast chart
   * Demonstrates: Chart.js configuration, gradient fills, responsive design
   */
  createTemperatureChart(canvasId, forecastData, isDarkMode = false) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.error(`Canvas element ${canvasId} not found`);
      return null;
    }

    // Destroy existing chart if it exists
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }

    // Extract data from forecast
    const labels = forecastData.map(day => day.date);
    const maxTemps = forecastData.map(day => day.maxTemp);
    const minTemps = forecastData.map(day => day.minTemp);
    const avgTemps = forecastData.map(day => day.avgTemp);

    // Create gradient for better visual appeal
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isDarkMode ? 'rgba(109, 213, 250, 0.4)' : 'rgba(41, 128, 185, 0.4)');
    gradient.addColorStop(1, isDarkMode ? 'rgba(109, 213, 250, 0.0)' : 'rgba(41, 128, 185, 0.0)');

    // Chart configuration
    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Max Temperature',
            data: maxTemps,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#e74c3c',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Average Temperature',
            data: avgTemps,
            borderColor: isDarkMode ? '#6dd5fa' : '#2980b9',
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: isDarkMode ? '#6dd5fa' : '#2980b9',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Min Temperature',
            data: minTemps,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3498db',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: isDarkMode ? '#fff' : '#333',
              font: {
                size: 12,
                weight: '600'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(42, 42, 62, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDarkMode ? '#fff' : '#333',
            bodyColor: isDarkMode ? '#fff' : '#333',
            borderColor: isDarkMode ? '#6dd5fa' : '#2980b9',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}°C`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666',
              font: {
                size: 11
              },
              callback: function(value) {
                return value + '°C';
              }
            }
          }
        }
      }
    };

    // Create and store the chart instance
    this.chartInstances[canvasId] = new Chart(ctx, config);
    return this.chartInstances[canvasId];
  },

  /**
   * Create a humidity and precipitation chart
   * Demonstrates: Mixed chart types (bar + line), dual y-axes
   */
  createHumidityChart(canvasId, forecastData, isDarkMode = false) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }

    const labels = forecastData.map(day => day.date);
    const humidity = forecastData.map(day => day.humidity);
    const precipitation = forecastData.map(day => day.precipitation || 0);

    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Humidity (%)',
            data: humidity,
            backgroundColor: isDarkMode ? 'rgba(109, 213, 250, 0.6)' : 'rgba(41, 128, 185, 0.6)',
            borderColor: isDarkMode ? '#6dd5fa' : '#2980b9',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: 'Precipitation (mm)',
            data: precipitation,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: isDarkMode ? '#fff' : '#333',
              font: {
                size: 12,
                weight: '600'
              },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(42, 42, 62, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDarkMode ? '#fff' : '#333',
            bodyColor: isDarkMode ? '#fff' : '#333',
            borderColor: isDarkMode ? '#6dd5fa' : '#2980b9',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Humidity (%)',
              color: isDarkMode ? '#fff' : '#333'
            },
            grid: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Precipitation (mm)',
              color: isDarkMode ? '#fff' : '#333'
            },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666'
            }
          }
        }
      }
    };

    this.chartInstances[canvasId] = new Chart(ctx, config);
    return this.chartInstances[canvasId];
  },

  /**
   * Create a wind speed chart
   * Demonstrates: Radar/polar chart type
   */
  createWindChart(canvasId, forecastData, isDarkMode = false) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }

    const labels = forecastData.map(day => day.date);
    const windSpeed = forecastData.map(day => day.windSpeed);

    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Wind Speed (km/h)',
          data: windSpeed,
          borderColor: '#16a085',
          backgroundColor: 'rgba(22, 160, 133, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#16a085',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: isDarkMode ? '#fff' : '#333',
              font: {
                size: 12,
                weight: '600'
              }
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(42, 42, 62, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDarkMode ? '#fff' : '#333',
            bodyColor: isDarkMode ? '#fff' : '#333',
            borderColor: '#16a085',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: isDarkMode ? '#aaa' : '#666',
              callback: function(value) {
                return value + ' km/h';
              }
            }
          }
        }
      }
    };

    this.chartInstances[canvasId] = new Chart(ctx, config);
    return this.chartInstances[canvasId];
  },

  /**
   * Update existing chart with new data
   * Demonstrates: Chart updates, animation
   */
  updateChart(canvasId, newData) {
    const chart = this.chartInstances[canvasId];
    if (!chart) {
      console.warn(`No chart found with id: ${canvasId}`);
      return;
    }

    chart.data = newData;
    chart.update('active'); // Animate the update
  },

  /**
   * Destroy a specific chart
   */
  destroyChart(canvasId) {
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
      delete this.chartInstances[canvasId];
    }
  },

  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    Object.keys(this.chartInstances).forEach(id => {
      this.destroyChart(id);
    });
  }
};

// Export for browser use
if (typeof window !== 'undefined') {
  window.ChartUtils = ChartUtils;
}
