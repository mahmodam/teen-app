import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [],
  imports: [
    BsDatepickerModule.forRoot(),
    FileUploadModule,
    NgxSpinnerModule,
    NgxGalleryModule,
    TabsModule.forRoot(),
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({positionClass:'toast-bottom-right'})
  ],
  exports:[
    BsDatepickerModule,
    FileUploadModule,
    NgxSpinnerModule,
    NgxGalleryModule,
    TabsModule,
    BsDropdownModule,
    ToastrModule
  ]
})
export class SharedModule { }
