import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Constants } from 'src/app/core/constants';
import { NewContent } from 'src/app/core/models/NewContent';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DatePipe } from '@angular/common';
import { Content, UpdateContent } from 'src/app/core/models/Content';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-content-form',
  templateUrl: './content-form.component.html',
  styleUrls: ['./content-form.component.scss'],
})
export class ContentFormComponent {

  @Output() uploadSuccessEmitter = new EventEmitter<boolean>();
  @Output() modalCloseEmitter = new EventEmitter<boolean>();
  @Input() isVisible: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() content: Content = {} as Content;

  category: any[] = Constants.Category;

  contentForm: FormGroup = new FormGroup({
    category: new FormControl(this.category[0], [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    files: new FormControl([], [this.isEditing? null: Validators.required]),
    slideOrder: new FormControl(0, [Validators.required]),
  });

  ngOnInit(): void {
    this.contentForm.setValidators(this.setValidator);
  }

  ngOnChanges(changes:SimpleChanges): void {
    if(changes['isVisible'] && changes['isVisible'].currentValue){
      this.contentForm.reset();
    }
    if(changes['isEditing'] && changes['isEditing'].currentValue){
      this.contentForm.get('files')?.clearValidators();
      this.contentForm.get('files')?.updateValueAndValidity();
      this.mapValuesToForm(this.content);
    }
  }

  constructor(
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService,
    private readonly loaderService: LoaderService
  ) {}

  submit(isEditing:boolean): void {
    if(isEditing){
      this.updateContent();
    }
    else{
      this.addContent();
    }
  }

  addContent(): void {
    let newContent: NewContent = this.mapValues();
    let files = newContent.files;
    let formData: FormData = new FormData();
    formData.append('category', newContent.category);
    formData.append('slot', newContent.slot);
    formData.append('slideOrder', newContent.slideOrder.toString());
    for (const file of files) {
      formData.append('files', file, file.name); // Use 'files[]' to send multiple files
    }
    this.loaderService.show();
    this.adminService.upload(formData).subscribe((response: any) => {
      if (response.isSuccess) {
        this.notificationService.showSuccess('Content uploaded successfully');
        this.modalCloseEmitter.emit(true);
        this.uploadSuccessEmitter.emit(true);
        this.contentForm.reset();
      } else {
        this.notificationService.showError(response.error.message);
      }
      this.loaderService.hide();
    });
  }

  updateContent(): void {
    let content:UpdateContent = {
      id: this.content.id,
      category: this.contentForm.get('category')?.value.name,
      slot: this.formatTime(
        this.contentForm.get('startTime')?.value.toString(),
        this.contentForm.get('endTime')?.value.toString()
      ),
      slideOrder: this.contentForm.get('slideOrder')?.value,
    };
    this.loaderService.show();
    this.adminService.update(content).subscribe((response: any) => {
      if (response.isSuccess) {
        this.notificationService.showSuccess('Content updated successfully');
        this.modalCloseEmitter.emit(true);
        this.uploadSuccessEmitter.emit(true);
        this.contentForm.reset();
      } else {
        this.notificationService.showError(response.error.message);
      }
      this.loaderService.hide();
    });
  }

  selectCategory(event: any): void {
    let value: string = event.value;
    this.contentForm.get('category')?.setValue(value);
  }

  mapValues(): NewContent {
    return {
      category: this.contentForm.get('category')?.value.name,
      slot: this.formatTime(
        this.contentForm.get('startTime')?.value.toString(),
        this.contentForm.get('endTime')?.value.toString()
      ),
      files: this.contentForm.get('files')?.value,
      slideOrder: this.contentForm.get('slideOrder')?.value,
    };
  }

  mapValuesToForm(content: Content): void {

    let category = this.category.find((c) => c.name === content.category);
    let dates = content.slot.split('-');
    let startDate = dates[0].split('_')[0];
    let startTime = dates[0].split('_')[1];
    let endDate = dates[1].split('_')[0];
    let endTime = dates[1].split('_')[1];

    // Reformat the start and end date strings to 'MM/DD/YYYY' format
    let formattedStartDate = startDate.split('/').reverse().join('/');
    let formattedEndDate = endDate.split('/').reverse().join('/');

    let startTimeDate = new Date(`${formattedStartDate} ${startTime}`);
    let endTimeDate = new Date(`${formattedEndDate} ${endTime}`);

    this.contentForm.get('category')?.setValue(category);
    this.contentForm.get('startTime')?.setValue(startTimeDate);
    this.contentForm.get('endTime')?.setValue(endTimeDate);
    this.contentForm.get('slideOrder')?.setValue(content.slideOrder);
  }

  formatTime(startTime: string, endTime: string): string {
    let datePipe = new DatePipe('en-US');

    // Parse the startTime and endTime strings into JavaScript Date objects
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);

    // Format the date objects using the DatePipe
    let formattedStartTime = datePipe.transform(startDate, 'dd/MM/yyyy_HH:mm') || '';
    let formattedEndTime = datePipe.transform(endDate, 'dd/MM/yyyy_HH:mm') || '';

    // Concatenate the formatted strings
    return `${formattedStartTime}-${formattedEndTime}`;
  }

  onFileSelect(event: any): void {
    let files: FileList = event.target.files;
    let fileList: File[] = [];

    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i]);
    }

    this.contentForm.get('files')?.setValue(fileList);
  }

  setValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get('startTime').value;
    const endTime = control.get('endTime').value;

    if (startTime && endTime) {
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);

      if (startTimeDate >= endTimeDate) {
        return { endTimeBeforeStartTime: true };
      }
    }

    return null;
  }
}
