import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Content } from 'src/app/core/models/Content';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminService } from '../../services/admin.service';
import { Constants } from 'src/app/core/constants';
import { FilterOptions } from 'src/app/core/models/Filter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
})
export class ContentsComponent {
  contents: Content[] = [];
  responsiveOptions: any[] | undefined;
  visible: boolean = false;
  isEditing: boolean = false;
  modalHeader: string = 'Add Content';
  content: Content = {} as Content;
  category: any[] = Constants.Category;
  timeSlots: any[] = [];
  filterOptions: FilterOptions = {
    category: '',
    slot: '',
  } as FilterOptions;

  filterOptionsForm: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    slot: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private readonly adminService: AdminService,
    private loaderService:LoaderService,
    private readonly authService:AuthService
  ) {}

  ngOnInit(): void {
    this.getContents();
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  getContents(): void {
    this.loaderService.show();
    this.adminService.getAll().subscribe((data: any) => {
      this.contents = data.data;
      this.setTimeSlots(this.contents as Content[]);
      this.loaderService.hide();
    });
  }

  setTimeSlots(contents: Content[]): void {
    let timeSlots: Set<string> = new Set();
    contents.forEach((content: Content) => {
      timeSlots.add(content.slot);
    });
    this.timeSlots = Array.from(timeSlots);
  }

  showDialog(isEditing: boolean) {
    if (isEditing) {
      this.modalHeader = 'Edit Content';
      this.isEditing = true;
    } else {
      this.modalHeader = 'Add Content';
      this.isEditing = false;
    }
    this.visible = true;
  }

  onCategoryChange() {
    let value= this.filterOptionsForm.value.category;
    this.filterOptions.category = value.name
  }

  onSlotChange() {
    this.filterOptions.slot = this.filterOptionsForm.value.slot;
  }

  resetFilterOptions() {
    this.filterOptions = {
      category: '',
      slot: '',
    };
    this.filterOptionsForm.reset();
    this.getContents();
  }

  closeDialog() {
    this.visible = false;
    this.isEditing = false;
  }

  updateContent(content: Content) {
    this.content = content;
    this.showDialog(true);
  }

  onVisibleChange(event: any) {
    this.visible = event.visible;
    this.isEditing = false;
    this.getContents();
    this.filterOptionsForm.reset();
  }

  openConfirmDeletePopup(id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Item?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger m-3',
      rejectButtonStyleClass: 'p-button-secondary m-3',
      accept: () => {
        this.adminService.delete(id).subscribe((response: any) => {
          if (response.isSuccess) {
            this.notificationService.showSuccess(
              'Content deleted successfully'
            );
            this.getContents();
            this.filterOptionsForm.reset();
          } else {
            this.notificationService.showError(response.error.message);
          }
        });
      },
      reject: (type: any) => {},
    });
  }

  filterContent(): void {
    if(this.filterOptions.category === '' && this.filterOptions.slot === '' || !this.filterOptions){
      this.notificationService.showWarn('Please select category or slot');
      return;
    }
    this.loaderService.show();
    this.adminService.getFilteredContent(this.filterOptions).subscribe((data: any) => {
      this.contents = data.data;
      this.loaderService.hide();
    });
  }
}
