import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import { ChartSelectEvent } from 'ng2-google-charts';

@Component({
  selector: 'app-statement2',
  templateUrl: './statement2.component.html',
  styleUrls: ['./statement2.component.css']
})
export class Statement2Component implements OnInit {

  public columnChart: GoogleChartInterface;

  // Student vars
  academicYear: string[] = [];
  term: string[] = [];
  usn: any;
  email: any;
  user: string[] = [];
  studentAttendanceDetails = []
  studentUEmarks = []
  termDetails = []

  // Faculty vars
  facultyName: string[] = [];
  avgMarksFaculty
  courseCode
  usnList: string[] = []

  // Chart vars
  UE;
  chartTitle;
  course;
  courseAttendance: String[] = []
  present;
  total;

  showSpinner = false;
  chart_visibility: boolean = false;

  // Error handling
  error_flag
  error_message
  
  selectedYear;
  selectedTerm;

  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {

    this.user = this.authService.getUserInfo()
    this.get_academic_year()
    this.get_term_details()
    this.get_usn_by_email()

    this.get_student_avgMarks_faculty()

  }

  get_student_details() {

    this.error_flag = false;
    this.chart_visibility = false;
    this.showSpinner = true;
    if (!this.chart_visibility) {
      setTimeout(() => {
        this.showColumnChart()
      }, 2000)
    }
    this.get_student_attendance_details(this.usn[0]["usn"], this.selectedTerm, this.selectedYear)
    this.get_student_UEmarks_details(this.usn[0]["usn"], this.selectedTerm, this.selectedYear)

  }

//login

  get_usn_by_email() {

    this.analyticsService.get_usn_by_email(this.user['user']).subscribe(res => {
      this.usn = res['res']

      console.log(this.usn[0]["usn"])
    })
  }


  get_academic_year() {
    this.analyticsService.get_academic_year().subscribe(res => {
      this.academicYear = res["res"]
    })
  }

  get_term_details() {
    this.analyticsService.get_term_details().subscribe(res => {
      this.termDetails = res["res"]

    })
  }

  //student 

  get_student_attendance_details(usn, term, academicYear) {
    this.analyticsService.get_student_attendance_details(usn, term, academicYear).subscribe(res => {
      this.studentAttendanceDetails = res["res"]

    })
  }

  get_student_UEmarks_details(usn, term, academicYear) {
    this.analyticsService.get_student_UEmarks_details(usn, term, academicYear).subscribe(res => {
      this.studentUEmarks = res["res"]
    })
  }

  get_student_total_attendance() {
    this.analyticsService.getCourseAttendance(this.course, this.usn[0]['usn']).subscribe(res => {
      this.courseAttendance = res["res"]
      console.log(res)
    })
  }

  // Faculty

  get_student_avgMarks_faculty(){
    this.courseCode = "15ME53"
    this.usnList = ["4MT15ME008","4MT15ME013"]
      this.analyticsService.get_student_avgMarks_faculty().subscribe(res =>{
        this.avgMarksFaculty = res["res"]
        console.log(res)
      })
  }

// chart

  showColumnChart() {
    
    let data = []
  
    data.push(["CourseName", "Attendance", "Marks"]);

    setTimeout(() => {
      this.showSpinner = false
    
      for (let s of this.studentAttendanceDetails) {

        data.push([s["courseName"], s['perc']])
      }
      let i = 1
      for (let s of this.studentUEmarks) {
   
        data[i][2] = s['perc']
        i++;
      }

      if (data.length > 1) {
        this.chart_visibility = true
        this.error_flag = false
        this.showStudentDetailsChart(data)
      }
      else {

        this.error_flag = true
        this.error_message = "Data does not exist for the entered criteria"
      }

      


    }, 3000)
  }

  onChartSelect(event: ChartSelectEvent) {
    this.UE = event.selectedRowFormattedValues[2]
    this.course = event.selectedRowFormattedValues[0]

    this.get_student_total_attendance()

    setTimeout(() => {
      console.log(this.courseAttendance)
      this.present = this.courseAttendance["present"]
      this.total = this.courseAttendance["total"]
    }, 2000)

  }


  showStudentDetailsChart(data) {
    this.chartTitle = 'Course-wise Attendance %',
      this.columnChart = {
        chartType: "ColumnChart",
        dataTable: data,
        options: {
          bar: { groupWidth: "30%" },
          vAxis: {
            title: "Percentage",
          },

          height: 800,
          width: 1650,

          chartArea: {
            left: 80,
            right: 100,
            top: 100,
          },
          legend: {
            position: "top",
            alignment: "end"
          },
          seriesType: "bars",
          colors: ["#d3ad5d", "#789d96"],
          fontName: "Times New Roman",
          fontSize: 13,

        }

      } 

    }


    
  }
     


 // get_faculty_attendance_details(facultyName, term, academicYear){
        //   this.analyticsService.get_student_attendance_details(facultyName, term, academicYear).subscribe(res=>{
        //     this.facultyAttendanceDetails = res["res"]
        //   }
