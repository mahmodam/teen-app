import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/Services/account.service';
import { take } from 'rxjs';
import { Photo } from 'src/app/models/photo';
import { MemberService } from 'src/app/Services/member.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;
  baseUrl = environment.apiUrl;
  user: User;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean = false;

  constructor( private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user as User);
   }

  ngOnInit(): void {
    this.initializeUpload();
  }

  initializeUpload(){
    const options: FileUploaderOptions = {
      url: `${this.baseUrl}users/add-photo`,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    }
    this.uploader = new FileUploader(options);
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true;
      })
    });
    
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe(()=> {
      this.member.photos = this.member.photos.filter(p => p.id !== photoId)
    })
  }

}
