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
  usn:any;
  email:any;
  user:any;


  selectedYear;
  selectedTerm;

  termDetails=[]
  studentAttendanceDetails = []
  studentUEmarks = []

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.get_academic_year()
    this.get_term_details()

    this.email = localStorage.getItem("user")
    this.user = JSON.parse(this.email)
    
    
    // this.showColumnChart()
  }

  get_student_details(){
    console.log('hello')
    this.get_student_attendance_details("4MT15IS002",this.selectedTerm,this.selectedYear)
    this.get_student_UEmarks_details("4MT15IS002",this.selectedTerm,this.selectedYear)

    setTimeout(()=>{
      this.showColumnChart()
    }, 5000)
  
   
  }

  get_student_usn_by_email(email){
    this.analyticsService.get_usn_by_email(email).subscribe(res=>{
      this.usn = res["usn"]
    })
  }

  get_academic_year(){
    this.analyticsService.get_academic_year().subscribe(res=>{
      this.academicYear = res["res"]
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
  
    })
  }

  get_student_UEmarks_details(usn, term, academicYear){
    this.analyticsService.get_student_UEmarks_details(usn, term, academicYear).subscribe(res=>{
      this.studentUEmarks = res["res"]
    })
  }


  showColumnChart(){
    let data = []

    data.push(["CourseName","Attendance","Marks"]);
    
    setTimeout( ()=>{ 
      for(let s of this.studentAttendanceDetails ){
       
        data.push([s["courseName"],s['perc']])
    }
    let i =1
    for(let s of this.studentUEmarks){

        data[i][2] = s['perc']
        i++;
      } 
      
    this.showStudentDetailsChart(data)
    console.log(data)

    }, 5000 )
  }


  showStudentDetailsChart(data){
    
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: data,
      options:{
        'width': 1300,
        'height': 1000
      }
    };
  }

}
