import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';

import { SliderRoutingModule } from './slider-routing.module';
import { HomeComponent } from './components/home/home.component';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SliderRoutingModule,
    GalleriaModule
  ]
})
export class SliderModule { }
