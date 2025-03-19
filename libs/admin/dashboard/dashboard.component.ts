import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  chart: any;
  selectedYear: string = '2022';
  years = ['2022', '2023', '2024'];
  data: { [key: string]: number[] } = {
    '2022': [120, 190, 300, 250, 200, 150, 180, 210, 240, 270, 300, 330],
    '2023': [150, 220, 350, 300, 250, 200, 230, 260, 290, 320, 350, 380],
    '2024': [180, 250, 400, 350, 300, 250, 280, 310, 340, 370, 400, 430]
  };

  constructor() {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit(): void {
    this.createBarChart();
    this.createPieChart();
  }

  createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Number of Students',
                data: this.data[this.selectedYear],
                backgroundColor: '#009D77', 
                borderColor: '#009D77', 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Remove grid lines for y-axis
                    },
                    border: {
                      display: false // Remove y-axis line
                  }
                },
                x: {
                    grid: {
                        display: false // Remove grid lines for x-axis
                    },
                    border: {
                      display: false // Remove y-axis line
                  }
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value,
                    color: 'black'
                }
            }
        }
    });
  }


  createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Site Visitors', 'Leads'],
        datasets: [{
          label: 'Statistics',
          data: [2300, 1300],
          backgroundColor: [
            '#c4c4c4', // Grey color for Site Visitors
            '#009D77'  // Green color for Leads
          ],
          borderColor: [
            '#ffffff', // White border for Site Visitors
            '#ffffff'  // White border for Leads
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = target.value;
    this.chart.data.datasets[0].data = this.data[this.selectedYear];
    this.chart.update();
  }
}