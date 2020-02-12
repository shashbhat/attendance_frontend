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

  userName
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
  totalMarks
  totalAttendance
  totalClassTaken

  user_roles

  // Chart vars
  UE;
  chartTitle;
  course;
  courseAttendance: String[] = []
  present;
  total;

  showSpinner = false;
  chart_visibility: boolean = false;
  selectedDept
  hod_display_names: boolean = false;
  principal_display_names: boolean = false;
  // Error handling
  error_flag
  error_message

  selectedYear;
  selectedTerm;
  Faculties: any;



  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUserInfo()
    this.get_usn_by_email()
    this.get_eid_by_email()
    this.user_roles = this.user['roles']
  
    this.roles = ""
    setTimeout(() => {
      for (let i = 0; i < this.user['roles'].length; i++) {

        if (this.user['roles'][i] == "FACULTY") {
          this.roles = "faculty"

        }

        else if (this.user['roles'][i] == 'STUDENT') {
          this.roles = "student"
        }

        if (this.user['roles'][i] == "HOD") {
          this.roles = "hod"

          let patt = new RegExp("[a-zA-z]*");
          let res = patt.exec(this.eid);
          this.deptName = res[0];

          this.analyticsService.get_dept_faculty(this.deptName).subscribe(res => {
            this.facultyNames = res['res']

          })
        }

        if (this.user['roles'][i] == "PRINCIPAL") {
          this.get_principal_dept_names()
          this.roles = "principal"
        }
      }


    }, 1000)

    this.get_academic_year()
    this.get_term_details()
  }

  get_user_role_type() {
    if (this.roles == "student") {
      this.get_student_details()
    }
    else if (this.roles == "faculty") {
      this.get_faculty_details(this.selectedTerm, this.selectedYear, this.eid)
    }
    else if (this.roles == 'hod') {
      this.hod_display_names = true;
    }
    else if (this.roles == "principal") {
      this.principal_display_names = true;

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

  get_faculty_details(term, academicYear, eid) {
    this.error_flag = false;
    this.chart_visibility = false;
    this.showSpinner = true;
    this.eid = eid

    if (!this.chart_visibility) {
      setTimeout(() => {
        this.showFacultyColumnChart()
      }, 2000)
    }
    this.get_student_avgAttendance_faculty(term, academicYear, eid)
    this.get_student_avgMarks_faculty(term, academicYear, eid)

  }

  get_hod_details(eid, facultyName) {
    this.facultyName = facultyName['name']
    console.log(this.facultyName)
    console.log('hello')
    this.get_faculty_details(this.selectedTerm, this.selectedYear, eid)
  }

  get_principal_dept_names() {
    this.analyticsService.get_dept_names().subscribe(res => {
      this.deptName = res['res']
    })
  }

  get_principal_details(eid, facultyName) {
    this.facultyName = facultyName['name']
    this.get_faculty_details(this.selectedTerm, this.selectedYear, eid)
    console.log(this.facultyName)
    console.log('hello')

  }

  get_principal_faculty_names(deptName) {
    this.principal_display_names = true;
    this.analyticsService.get_dept_faculty(this.selectedDept).subscribe(res => {
      this.facultyNames = res['res']

    })
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

  get_total_class_taken(eid, courseCode) {


    this.analyticsService.get_total_class_taken(eid, courseCode).subscribe(res => {
      this.totalClassTaken = res['res']

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
  showFacultyColumnChart() {
    let data = []

    data.push(["CourseName", "Attendance", "Marks"]);

    setTimeout(() => {
      try {

        this.showSpinner = false


        for (let s of this.avgAttendanceDetails) {

          data.push([s["course"], s['Avg']])
        }
        let i = 1

        for (let s of this.avgMarksFaculty) {

          data[i][2] = s['avg']
          i++;
        }

        if (data.length > 1) {
          this.chart_visibility = true
          this.error_flag = false
          this.showFacultyDetailsChart(data)
        }
        else {

          this.error_flag = true
          this.error_message = "Data does not exist for the entered criteria"
        }


      } catch (e) {

        this.error_flag = true
        this.error_message = "Data does not exist for the entered criteria"
      }

    }, 3000)
  }


  onFacultyChartSelect(event: ChartSelectEvent) {
    this.UE = event.selectedRowFormattedValues[2]
    this.course = event.selectedRowFormattedValues[0]

    setTimeout(() => {
      this.get_total_class_taken(this.eid, this.course)
      this.totalAttendance = this.avgAttendanceDetails["Avg"]
      this.totalMarks = this.avgMarksFaculty["avg"]
    }, 1000)

  }

  showStudentDetailsChart(data) {
    this.chartTitle = 'Course-wise Attendance %',
      this.columnChart = {
        chartType: "ColumnChart",
        dataTable: data,
        options: {
          bar: { groupWidth: "20%" },
          vAxis: {
            title: "Percentage",
            scaleType: 'linear',
            minValue: 0,
            maxValue: 100
          },
          height: 800,
          width: 1600,
          hAxis: {
            title: "Courses",
            titleTextStyle: {
            }
          },

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


  showFacultyDetailsChart(data) {
    this.chartTitle = 'Course-wise Attendance %',
      this.columnChart = {
        chartType: "ColumnChart",
        dataTable: data,
        options: {
          bar: { groupWidth: "20%" },
          vAxis: {
            title: "Percentage",
            scaleType: 'linear',
            minValue: 0,
            maxValue: 100
          },
          height: 600,
          width: 1000,
          hAxis: {
            title: "Courses",
            titleTextStyle: {
            }
          },

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



