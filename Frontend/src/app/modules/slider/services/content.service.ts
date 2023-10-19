import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject, catchError } from 'rxjs';
import { Content } from 'src/app/core/models/Content';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {

  private hubConnection: HubConnection;
  content = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}`)
      .build();
   this.addNewContentListener();
  }

  getContentBySlot(slot: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/content?slot=${slot}`)
      .pipe(
        catchError((error: any) => {
          throw error.message;
        })
      );
  }

  startConnection() {
    this.hubConnection.start().catch((err) => console.error(err));
  }

  addNewContentListener() {
    this.hubConnection.on('ReceiveContent', (newContent: Content) => {
      this.content.next({
        type: 'new',
        data: newContent,
      });
    });

    this.hubConnection.on('ReceiveUpdatedContent',(updatedContent:Content)=>{
      this.content.next({
        type:'update',
        data:updatedContent
      });
    })

    this.hubConnection.on('ReceiveDeletedContent',(deletedContentId:string)=>{
      this.content.next({
        type:'delete',
        data:deletedContentId
      });
    })
  }
}
