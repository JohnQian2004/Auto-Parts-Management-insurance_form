import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Note } from '../models/note.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class NoteService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/notes';

  constructor(private http: HttpClient) { }


  createNote(userId: any, note: Note): Observable<PaymentStatus> {

    return this.http.post<any>(this.API_URL + "/" + userId, note, httpOptions);
  }

  createNoteUuidEmployee(jobId: any, uuidEmployee: any, note: Note): Observable<Note> {

    return this.http.post<any>(this.API_URL + "/employee/" + jobId + "/" + uuidEmployee, note, httpOptions);
  }

  createNoteUserId(jobId: any, userId: any, note: Note): Observable<Note> {

    return this.http.post<any>(this.API_URL + "/user/" + jobId + "/" + userId, note, httpOptions);
  }


  getNote(noteId: any): Observable<Note> {

    return this.http.get<Note>(this.API_URL + "/" + noteId, httpOptions);
  }

  deleteNote(noteId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + noteId, httpOptions);
  }

  deleteNoteWithUserId(userId: any, noteId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + userId + "/" + noteId, httpOptions);
  }


  updateSeqence(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<Note[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + companyId, SequenceCarriers, httpOptions);
  }

  getAllCompanyNote(companyId: any): Observable<Note[]> {

    return this.http.get<Note[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
