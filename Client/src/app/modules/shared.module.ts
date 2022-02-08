import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

@NgModule({
  declarations: [],
  imports: [
    NgxGalleryModule,
    TabsModule.forRoot(),
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({positionClass:'toast-bottom-right'})
  ],
  exports:[
    NgxGalleryModule,
    TabsModule,
    BsDropdownModule,
    ToastrModule
  ]
})
export class SharedModule { }
