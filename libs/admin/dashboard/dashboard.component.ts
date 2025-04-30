import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environments';
import { DashboardService } from "libs/service/dashboard/dashboard.service";
import { addprogramService } from 'libs/service/addprogram/addProgram.service';
import { LoaderService } from 'libs/service/Loader/loader.service';

interface Users {
  name: string;
  email: string;
  contact: string;
  cities: string;
  university: string;
  image: string;
}

interface EducationType {
  educationTypeID: number;
  educationTypeTitle: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  barChart1: any;
  barChart2: any;
  pieChart: any;
  totalUniversity: any = 0;
  totalPrograms: any = 0;
  totalUsers: any = 0;
  totalStudents: any = 0;
  currentMonthStudents: number = 0;
  public apiUrl = environment.apiUrl;

  cardConfig: { title: string; key: string }[] = [];

  selectedYearBarChart1: string = '2022';
  selectedYearBarChart2: string = '2022';
  years = ["2025"];

  dataBarChart1: { [key: string]: number[] } = {};

  dataBarChart2: { [key: string]: number[] } = {
    '2022': [400, 320, 230, 120, 300],
    '2023': [450, 350, 280, 150, 320],
    '2024': [500, 400, 330, 200, 350]
  };

  cards: any[] = [];
  educationTypes: EducationType[] = [];
  programCounts: { [key: string]: string } = {};

  topCourses = [
    { name: 'BS Computer Science', percentage: 75, color: '#ef4444' },
    { name: 'BS English', percentage: 40, color: '#facc15' },
    { name: 'PHD Computer Science', percentage: 85, color: '#000000' },
    { name: 'PHD Economics', percentage: 25, color: '#3b82f6' },
    { name: 'PHD Economics', percentage: 16, color: '#ec4899' },
    { name: 'MS Computer Science', percentage: 16, color: '#ec4899' }
  ];

  users: Users[] = [
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/user.png' },
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/user.png' }
  ];

  searchTerm: string = '';
  filteredUsers = [...this.users];

  constructor(
    private dashboardService: DashboardService,
    private programService: addprogramService,
    private loaderService: LoaderService
  ) {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit(): void {
    this.createBarChart1();
    this.createPieChart();
    this.createBarChart2();
    this.loadEducationTypes();
    this.loadMonthlyStudentData();
  }

  loadEducationTypes(): void {
    this.loaderService.show();
    this.programService.getEducationType().subscribe({
      next: (types: EducationType[]) => {
        this.loaderService.hide();


        this.educationTypes = types;
        types.forEach(type => {
          this.programCounts[type.educationTypeTitle] = '0';
        });
        this.loadProgramCounts();
        this.initializeCardConfig();
        console.log(this.educationTypes);
      },
      error: (err) => {
        console.error('Error loading education types:', err);
        this.loaderService.hide();
      }
    });
  }

  loadMonthlyStudentData(): void {
    this.loaderService.show();
    this.dashboardService.getMonthlyStudentData().subscribe({
      next: (data) => {
        this.loaderService.hide();

        this.processMonthlyStudentData(data);
        this.updateBarChart1Data();
      },
      error: (err) => {
        this.loaderService.hide();
        console.error('Error loading monthly student data:', err);
        this.dataBarChart1 = {};
        this.updateBarChart1Data();
      }
    });
  }


  processMonthlyStudentData(apiData: any[]): void {
    const processedData: { [key: string]: number[] } = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = currentDate.getMonth() + 1; // Months are 1-12 in the API

    // Reset current month count
    this.currentMonthStudents = 0;

    // Group data by year
    apiData.forEach(item => {
      const year = item.year;
      const month = parseInt(item.month); // Note: Now using 1-based index for comparison
      const count = parseInt(item.totalApplications);

      if (!processedData[year]) {
        // Initialize with zeros for all months (0-11 for chart)
        processedData[year] = new Array(12).fill(0);
      }

      // Store in chart data (using 0-based index)
      processedData[year][month - 1] = count;

      // Check if this is the current month's data
      if (year === currentYear && month === currentMonth) {
        this.currentMonthStudents = count;
      }
    });

    this.dataBarChart1 = processedData;

    // Update the years array based on available data
    this.years = Object.keys(processedData).sort();
    if (this.years.length > 0) {
      this.selectedYearBarChart1 = this.years[this.years.length - 1]; // Default to most recent year
    }
  }

  updateBarChart1Data(): void {
    if (this.barChart1) {
      const dataForYear = this.dataBarChart1[this.selectedYearBarChart1] || new Array(12).fill(0);
      this.barChart1.data.datasets[0].data = dataForYear;
      this.barChart1.update();
    }
  }


  initializeCardConfig(): void {
    const baseCards = [
      { title: 'New Users', key: 'users' },
      { title: 'Total University', key: 'university' },
      { title: 'Total Programs', key: 'programs' }
    ];

    const educationTypeCards = this.educationTypes.map(type => ({
      title: type.educationTypeTitle,
      key: type.educationTypeTitle,
    }));

    this.cardConfig = [...baseCards, ...educationTypeCards];
  }


  private loadProgramCounts() {
    if (this.educationTypes.length === 0) return;

    this.loaderService.show();

    const basicDataRequests = [
      this.dashboardService.getApplicationStatus('pending'),
      this.dashboardService.getUniversityCount(),
      this.dashboardService.getProgramCount(),
      this.dashboardService.getTotalStudentCount(),
    ];

    const requests = this.educationTypes.map(type => {
      return this.dashboardService.getProgramCountByName(type.educationTypeTitle);
    });

    forkJoin([...basicDataRequests, ...requests]).subscribe({
      next: (results) => {
        this.loaderService.hide();
        this.totalUsers = results[0][0]?.totalApplicants;
        this.totalUniversity = results[1][0]?.universityName;
        this.totalPrograms = results[2][0]?.programname;
        this.totalStudents = results[3][0]?.totalStudentCount;

        const programCountResults = results.slice(4);

        this.educationTypes.forEach((type, index) => {
          const programCount = programCountResults[index][0]?.programname || '0';
          this.programCounts[type.educationTypeTitle] = programCount;
        });


        console.log(" this.programCounts", this.programCounts)

        this.updateCards();
  
      },
      error: (err) => {
        this.loaderService.hide();
        console.error('Error loading data:', err);
        this.totalUsers = '0';
        this.totalUniversity = '0';
        this.totalPrograms = '0';
        this.totalStudents = '0';
        this.educationTypes.forEach(type => {
          this.programCounts[type.educationTypeTitle] = '0';
        });
        
        this.updateCards();
      }
    });
  }

  updateCards() {
    this.cards = this.cardConfig.map(card => ({
      title: card.title,
      value:
        card.key === 'users' ? this.totalUsers :
          card.key === 'university' ? this.totalUniversity :
            card.key === 'programs' ? this.totalPrograms :
              this.programCounts[card.key] || '0',
    }));
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(users =>
      users.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.cities.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.university.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }



  createBarChart1(): void {
    const ctx = document.getElementById('barChart1') as HTMLCanvasElement;

    // Use empty data initially - it will be updated when API data loads
    const initialData = new Array(12).fill(0);

    this.barChart1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Number of Students',
            data: initialData,
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
    this.updateBarChart1Data();
  }

  onYearChangeBarChart2(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYearBarChart2 = target.value;
    this.barChart2.data.datasets[0].data = this.dataBarChart2[this.selectedYearBarChart2];
    this.barChart2.update();
  }
}