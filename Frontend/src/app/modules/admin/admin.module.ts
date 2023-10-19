import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ContentsComponent } from './components/contents/contents.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentFormComponent } from './components/content-form/content-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [HomeComponent, ContentsComponent, NavbarComponent, ContentFormComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ButtonModule,
    CarouselModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    DialogModule,
    FileUploadModule,
    ImageModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
})
export class AdminModule {}
