import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';



interface Users {
  name: string;
  email: string;
  contact: string;
  cities: string;
  university: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  barChart1: any;
  barChart2: any; 
  pieChart: any;  

  selectedYearBarChart1: string = '2022';
  selectedYearBarChart2: string = '2022'; 

  years = ['2022', '2023', '2024']; 

  
  dataBarChart1: { [key: string]: number[] } = {
    '2022': [120, 190, 300, 250, 200, 150, 180, 210, 240, 270, 300, 330],
    '2023': [150, 220, 350, 300, 250, 200, 230, 260, 290, 320, 350, 380],
    '2024': [180, 250, 400, 350, 300, 250, 280, 310, 340, 370, 400, 430]
  };

  
  dataBarChart2: { [key: string]: number[] } = {
    '2022': [400, 320, 230, 120, 300],
    '2023': [450, 350, 280, 150, 320],
    '2024': [500, 400, 330, 200, 350]
  };

  cards = [
    { title: 'New Users', value: 645, percentage: '+2.5%', trend: 'up' },
    { title: 'Business Query', value: 400, percentage: '+2.5%', trend: 'up' },
    { title: 'Education Query', value: 360, percentage: '+2.5%', trend: 'up' },
    { title: 'Politics Query', value: 26, percentage: '+2.5%', trend: 'up' },
    { title: 'Job Offers', value: 26, percentage: '+2.5%', trend: 'up' },
    { title: 'Training Offers', value: 645, percentage: '-1.5%', trend: 'down' }
  ];

 

  topCourses = [
    { name: 'BS Computer Science', percentage: 75, color: '#ef4444' }, // Red
    { name: 'BS English', percentage: 40, color: '#facc15' }, // Yellow
    { name: 'PHD Computer Science', percentage: 85, color: '#000000' }, // Black
    { name: 'PHD Economics', percentage: 25, color: '#3b82f6' }, // Blue
    { name: 'PHD Economics', percentage: 16, color: '#ec4899' },  // Pink
    { name: 'MS Computer Science', percentage: 16, color: '#ec4899' }  // Pink
  ];

  users: Users[] = [
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/images/abd.jpeg' },
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/images/abd.jpeg' }
  ];

  
  searchTerm: string = '';
  filteredUsers = [...this.users];

  filterUsers() {
    this.filteredUsers = []; // Reset before filtering
    this.filteredUsers = this.users.filter(users =>
      users.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.cities.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.university.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  constructor() {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit(): void {
    this.createBarChart1();
    this.createPieChart();
    this.createBarChart2();
  }

  createBarChart1(): void {
    const ctx = document.getElementById('barChart1') as HTMLCanvasElement;

    this.barChart1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Number of Students',
            data: this.dataBarChart1[this.selectedYearBarChart1],
            backgroundColor: '#009D77',
            borderColor: '#009D77',
            borderWidth: 1,
            barThickness: 30,
            categoryPercentage: 0.5,
            barPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
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
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Site Visitors', 'Leads'],
        datasets: [
          {
            label: 'Statistics',
            data: [2300, 1300],
            backgroundColor: ['#c4c4c4', '#009D77'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  createBarChart2(): void {
    const ctx = document.getElementById('barChart2') as HTMLCanvasElement;

    this.barChart2 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['UCP', 'COMSATS', 'IQRA University', 'LUMS', 'IUB'],
        datasets: [
          {
            label: 'Number of Students',
            data: this.dataBarChart2[this.selectedYearBarChart2],
            backgroundColor: '#009D77',
            borderColor: '#009D77',
            borderWidth: 1,
            barThickness: 20,
            categoryPercentage: 0.5,
            barPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
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

  onYearChangeBarChart1(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYearBarChart1 = target.value;
    this.barChart1.data.datasets[0].data = this.dataBarChart1[this.selectedYearBarChart1];
    this.barChart1.update();
  }

  onYearChangeBarChart2(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYearBarChart2 = target.value;
    this.barChart2.data.datasets[0].data = this.dataBarChart2[this.selectedYearBarChart2];
    this.barChart2.update();
  }
}