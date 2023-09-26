import { Component } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  slot: string = '17:00-18:00';
  images: string[] = [];
  constructor(private readonly imageService:ImageService) {}

  ngOnInit(): void {
    this.imageService.getImagesBySlot(this.slot).subscribe((data: any) => {
      this.images = data;
    });
  }
}
