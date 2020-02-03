import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-statement5',
  templateUrl: './statement2.component.html',
  styleUrls: ['./statement2.component.css']
})
export class Statement5Component implements OnInit {

  academicYear:string[] = [];
  termDetails=[]
  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.get_academic_year()
    this.get_term_details()
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
}
