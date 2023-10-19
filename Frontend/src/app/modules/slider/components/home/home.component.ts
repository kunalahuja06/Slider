import { Component } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Content } from 'src/app/core/models/Content';
import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  slot: string = this.getFormattedTimeSlot(new Date());
  contents: Content[] = [];
  private dataSubscription: Subscription;

  constructor(private readonly contentService: ContentService) {
    this.refreshData();
  }

  ngOnInit(): void {
    this.contentService.startConnection();
    this.contentService.content.subscribe((content: any) => {
      if (content.type === 'new') {
        if (content.data.slot === this.slot) {
          this.contents.push(content.data);
        }
      }
      if (content.type === 'update') {
        if (content.data.slot === this.slot) {
          const index = this.contents.findIndex(
            (c) => c.id === content.data.id
          );
          if (index !== -1) {
            this.contents[index] = content.data;
          } else {
            this.contents.push(content.data);
          }
        }
      }
      if (content.type === 'delete') {
        const index = this.contents.findIndex((c) => c.id === content.data);
        if (index !== -1) {
          this.contents.splice(index, 1);
          this.contents = [...this.contents];
        }
      }
    });
  }

  private getFormattedTimeSlot(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const nextHour = (date.getHours() + 1).toString().padStart(2, '0');
    return `${day}/${month}/${year}_${hour}:00-${day}/${month}/${year}_${nextHour}:00`;
  }

  private refreshData() {
    // Fetch data initially
    this.fetchData();

    // Set up a timer to fetch data every hour
    this.dataSubscription = interval(3600000) // 3600000 milliseconds = 1 hour
      .pipe(
        switchMap(() => {
          this.slot = this.getFormattedTimeSlot(new Date()); // Update time slot
          return this.contentService.getContentBySlot(this.slot);
        })
      )
      .subscribe((data: any) => {
        this.contents = data.data;
      });
  }

  private fetchData() {
    this.contentService.getContentBySlot(this.slot).subscribe((data: any) => {
      this.contents = data.data;
      this.contents.sort((a, b) => a.slideOrder - b.slideOrder);
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
