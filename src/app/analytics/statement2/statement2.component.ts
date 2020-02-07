import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  // Chart vars
  UE;
  chartTitle;
  course;
  courseAttendance: String[] = []
  present;
  total;
  charts: boolean = false;

  showSpinner = false;
  selectedYear;
  selectedTerm;

  constructor(private analyticsService: AnalyticsService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit() {

    this.user = this.authService.getUserInfo()
    this.get_academic_year()
    this.get_term_details()
    this.get_usn_by_email()

  }

  get_student_details() {
    this.showSpinner = true;
    if (!this.charts) {
      setTimeout(() => {
        this.showColumnChart()
      }, 1000)
    }
    this.get_student_attendance_details(this.usn[0]["usn"], this.selectedTerm, this.selectedYear)
    this.get_student_UEmarks_details(this.usn[0]["usn"], this.selectedTerm, this.selectedYear)

  }

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


  showColumnChart() {
    this.showSpinner = false;
    let data = []
    this.charts = true;
    data.push(["CourseName", "Attendance", "Marks"]);

    setTimeout(() => {
      for (let s of this.studentAttendanceDetails) {

        data.push([s["courseName"], s['perc']])
      }
      let i = 1
      for (let s of this.studentUEmarks) {

        data[i][2] = s['perc']
        i++;
      }

      this.showStudentDetailsChart(data)


    }, 1000)
  }

  onChartSelect(event: ChartSelectEvent) {
    this.UE = event.selectedRowFormattedValues[2]
    this.course = event.selectedRowFormattedValues[0]

    this.get_student_total_attendance()

    setTimeout(() => {
      console.log(this.courseAttendance)
      this.present = this.courseAttendance["present"]
      this.total = this.courseAttendance["total"]
    }, 1000)

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
          colors: ["#c8001d", "#0000cf"],
          fontName: "Times New Roman",
          fontSize: 13,

        }

        // get_faculty_attendance_details(facultyName, term, academicYear){
        //   this.analyticsService.get_student_attendance_details(facultyName, term, academicYear).subscribe(res=>{
        //     this.facultyAttendanceDetails = res["res"]
        //   }





      }
  }
}
