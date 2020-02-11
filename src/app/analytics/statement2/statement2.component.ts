import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import { ChartSelectEvent } from 'ng2-google-charts';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  facultyNames
  facultyName: string[] = [];
  avgMarksFaculty
  avgAttendanceDetails
  courseCode
  roles;
  usnList: string[] = []
  eid
  set_role: any = "STUDENT"
  user_info: any;
  deptName

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
  Faculties: any;



  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUserInfo()
    console.log(this.user)
    this.roles = ""

    console.log(this.user['roles'])
    for (let i = 0; i < this.user['roles'].length; i++) {

      if (this.user['roles'][i] == "FACULTY") {
        this.roles = "faculty"
        console.log('faculty')
      }
      else if(this.user['roles'].includes('STUDENT')){
        this.roles = "student"
      }

      else if(this.user['roles'][2] == "HOD") {
        this.roles = "hod"
        let patt = new RegExp("[a-zA-z]*");
        let res = patt.exec(this.eid);
        this.deptName =res[0];
        this.analyticsService.get_dept_faculty(this.deptName).subscribe(res => {
          this.facultyNames = res['res']
        })
        }
    }


    this.get_academic_year()
    this.get_term_details()
    this.get_usn_by_email()
    this.get_eid_by_email()
  }


  get_user_role_type() {
    if (this.roles == "student") {
      this.get_student_details()
    }
    else if (this.roles == "faculty") {
      this.get_faculty_details()
    }
    else if( this.roles == 'hod'){
      this.get_hod_details()
    }
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

  get_faculty_details() {
    this.error_flag = false;
    this.chart_visibility = false;
    this.showSpinner = true;
 
    if (!this.chart_visibility) {
      setTimeout(() => {
        this.showFacultyColumnChart()
      }, 2000)
    }
    this.get_student_avgAttendance_faculty(this.selectedTerm, this.selectedYear, this.eid)
    this.get_student_avgMarks_faculty(this.selectedTerm, this.selectedYear, this.eid)
  }


  get_hod_details(){
    
  }

  //login

  get_usn_by_email() {

    this.analyticsService.get_usn_by_email(this.user['user']).subscribe(res => {
      this.usn = res['res']
    })
  }

  get_eid_by_email() {
    this.analyticsService.get_eid_by_email(this.user['user']).subscribe(res => {
      this.eid = res['res'][0]['employeeGivenId']
      
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
  get_student_avgAttendance_faculty(term, academicYear, eid) {
    this.analyticsService.get_student_avgAttendance_faculty(term, academicYear, eid).subscribe(res => {
      this.avgMarksFaculty = res["res"]

    })
  }

  get_student_avgMarks_faculty(term, academicYear, eid) {
    this.analyticsService.get_student_avgMarks_faculty(term, academicYear, eid).subscribe(res => {
      this.avgAttendanceDetails = res["res"]
    })
  }



  // student chart

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

  // Faculty Chart
  showFacultyColumnChart(){
    let data = []

    data.push(["CourseName", "Attendance", "Marks"]);

    setTimeout(() => {
      this.showSpinner = false
      console.log(this.avgAttendanceDetails)
      for (let s of this.avgAttendanceDetails) {

        data.push([s["course"], s['Avg']])
      }
      let i = 1
      console.log(this.avgMarksFaculty)
      for (let s of this.avgMarksFaculty) {

        data[i][2] = s['avg']
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



