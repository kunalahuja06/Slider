import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  
  constructor() {}

  requestCount = 0;
  isLoading = new Subject<boolean>();

  show(): void {
    this.isLoading.next(true);
  }

  hide(): void {
    setTimeout(() => {
      if (this.requestCount <= 0) {
        this.isLoading.next(false);
      } else {
        this.show();
      }
    }, 0);
  }
}
