import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChartSelectEvent } from 'ng2-google-charts';



@Component({
  selector: 'app-statement2',
  templateUrl: './statement2.component.html',
  styleUrls: ['./statement2.component.css']
})
export class Statement2Component implements OnInit {

  public columnChart: GoogleChartInterface;
  
  animal: string;
  name: string;
  
  academicYear:string[] = [];
  term:string[] = [];
  usn:any;
  email:any;
  user:string[]=[];
  facultyName:string[] = [];
  UE;
  title;
  course;
  courseAttendance:String[] = []
  present;
  total;

  charts : boolean = false;


  selectedYear;
  selectedTerm;

  termDetails=[]
  studentAttendanceDetails = []
  studentUEmarks = []

  constructor(private analyticsService: AnalyticsService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit() {

    this.user = this.authService.getUserInfo()
    this.get_academic_year()
    this.get_term_details()
    this.get_usn_by_email()
  
  }

  get_student_details(){
  
    if(!this.charts){
      setTimeout(()=>{
        this.showColumnChart()
      }, 5000)
    }
    this.get_student_attendance_details(this.usn[0]["usn"],this.selectedTerm,this.selectedYear)
    this.get_student_UEmarks_details(this.usn[0]["usn"],this.selectedTerm,this.selectedYear)

  }

  get_usn_by_email(){
  
    this.analyticsService.get_usn_by_email(this.user['user']).subscribe(res=>{
      this.usn=res['res']
      console.log(this.usn[0]["usn"])
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
    this.charts = true;
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

  onChartSelect(event:ChartSelectEvent){
    this.UE = event.selectedRowFormattedValues[2]
   this.course = event.selectedRowFormattedValues[0]
   console.log(this.UE)
   console.log(this.course)
   this.analyticsService.getCourseAttendance(this.course,this.usn).subscribe(res=>{
     this.courseAttendance = res["res"]
   })
   this.present = this.courseAttendance["present"]
   this.total = this.courseAttendance["total"]
 }
 showStudentDetailsChart(data){
  this.title = 'Course-wise Attendance %',
  this.columnChart={
    chartType:"ColumnChart",
    dataTable:data,
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


// showStudentDetailsChart(data){
  
//   this.columnChart = {
//     chartType: 'ColumnChart',
//     dataTable: data,
//     options:{
//       'width': 1300,
//       'height': 1000,
//       hAxis:{
//         textStyle:{
//           fontSize:10
//         }
//       }
//     }
//   };
// }
  // get_faculty_attendance_details(facultyName, term, academicYear){
  //   this.analyticsService.get_student_attendance_details(facultyName, term, academicYear).subscribe(res=>{
  //     this.facultyAttendanceDetails = res["res"]
  //   }
  
  

 
  // onChartSelect(event){
  //   console.log('selected')
  //   }




  }
}
}
