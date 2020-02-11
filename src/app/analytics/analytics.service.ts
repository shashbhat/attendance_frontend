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


  get_student_attendance_details(usn, term, academicYear):Observable<any>{
    let url = `${this.baseUrl}studentAttendanceDetails/${usn}/${term}/${academicYear}`
    return this.http.get<any>(url)
  }

  get_student_UEmarks_details(usn, term, academicYear):Observable<any>{
    let url = `${this.baseUrl}studentUEmarksDetails/${usn}/${term}/${academicYear}`
    return this.http.get<any>(url)
  }

  get_usn_by_email(email):Observable<any>{
    let url = `${this.baseUrl}studentUSNlogin/${email}`
    return this.http.get<any>(url)
 
  }
  

  getCourseAttendance(course,usn):Observable<any>{
    let url = `${this.baseUrl}getCourseAttendance/${course}/${usn}`   
    return this.http.get<any>(url)

   }
//faculty


  //  get_Faculties(dept):Observable<any>{
  //   let url = `${this.baseUrl}facultylogin/${dept}`
  //   return this.http.get<any>(url)
  //  }

 

  get_student_avgMarks_faculty(term, academicYear, eid):Observable<any>{
    let url = `${this.baseUrl}facultyMarksDetails/${term}/${academicYear}/${eid}`
    return this.http.get<any>(url)
  }

  get_student_avgAttendance_faculty(term, academicYear, eid):Observable<any>{
    let url = `${this.baseUrl}facultyAttendenceDetails/${term}/${academicYear}/${eid}`
    return this.http.get<any>(url)
  }

  get_eid_by_email(email):Observable<any>{
    let url = `${this.baseUrl}facultyEid/${email}`
    return this.http.get<any>(url)
  }

  get_dept_faculty(deptName):Observable<any>{
    let URL = `${this.baseUrl}getDeptFaculty/${deptName}`   
    return this.http.get(URL)
   }

   getFacultyName(deptId):Observable<any>{
    let URL = `${this.baseUrl}getFacultyNameByDeptId/${deptId}`   
    return this.http.get(URL)
   }
}
