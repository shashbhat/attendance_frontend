import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { 
  }

  get_academic_year():Observable<any>{

    let url = `${this.baseUrl}academicYear`
    return this.http.get<any>(url)
  }

  get_term_details():Observable<any>{
    let url = `${this.baseUrl}termDetails`
    return this.http.get<any>(url)
  }
}
