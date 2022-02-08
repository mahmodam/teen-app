import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/Services/member.service';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  constructor(private memberService: MemberService, private route: ActivatedRoute) { }

  member! : Member;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ]
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username') as string;

    this.memberService.getMember(username).subscribe(member => {
      this.member = member;
      this.galleryImages = this.getImages();
    });
  }

  getImages(): NgxGalleryImage[]{
    const imgUrls = [];
    for (const photo of this.member.photos){
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
       
      });
    }
    return imgUrls;
    }
  

}
