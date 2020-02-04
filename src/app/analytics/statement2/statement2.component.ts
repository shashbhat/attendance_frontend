import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';


@Component({
  selector: 'app-statement5',
  templateUrl: './statement2.component.html',
  styleUrls: ['./statement2.component.css']
})
export class Statement5Component implements OnInit {

  public columnChart: GoogleChartInterface;
  
  
  academicYear:string[] = [];
  term:string[] = [];
  usn:string[] = [];

  termDetails=[]
  studentAttendanceDetails = []
  studentUEmarks = []

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.get_academic_year()
    this.get_term_details()
    this.get_student_attendance_details("4MT15IS002","6","2017-18")
    this.get_student_UEmarks_details("4MT15IS002","6","2017-18")
  }

  get_academic_year(){
    this.analyticsService.get_academic_year().subscribe(res=>{
      this.academicYear = res["res"]
      console.log(this.academicYear)
    })
  }

  get_term_details(){
    this.analyticsService.get_term_details().subscribe(res=>{
      this.termDetails = res["res"]
      
    })
  }

  get_student_attendance_details(usn, term, academicYear){
    this.analyticsService.get_student_attendance_details(usn, term, academicYear).subscribe(res=>{
      this.studentAttendanceDetails = res["res"]
      let details = res["res"]
      console.log(this.studentAttendanceDetails)

    let data = []
    data.push(["CourseName","Percentage"]);
    for(let s of details){
      data.push([s["courseName"],s['perc']])
    }
    this.showStudentDetailsChart(data)
    console.log(data)

    })
  }


  get_student_UEmarks_details(usn, term, academicYear){
    this.analyticsService.get_student_UEmarks_details(usn, term, academicYear).subscribe(res=>{
      this.studentUEmarks = res["res"]
      console.log(this.studentUEmarks)
    
    })
  }

  showStudentDetailsChart(data){
    
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: data
    };
  }

}
