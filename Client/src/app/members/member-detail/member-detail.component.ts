import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/Services/member.service';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/models/message';
import { MessagesService } from 'src/app/Services/messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  constructor(private memberService: MemberService, private route: ActivatedRoute, private messagesService: MessagesService) { }

  member! : Member;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective;
  messages : Message[] = [];

  subscribtion: Subscription;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
      this.galleryImages = this.getImages();
    });

    this.subscribtion = this.route.queryParams.subscribe((params: Params) => {
      const selectedTab = params['tab'];
      this.selectTab(selectedTab ? selectedTab : 0);
    })

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
  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
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


    onTabActivated(data: TabDirective){
      this.activeTab = data;
      if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
        this.loadMessages();
        }
      }

      loadMessages(){
        this.messagesService.getMessageThread(this.member.username).subscribe(messages => {
          this.messages = messages;
        });
      }


      selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true;
      }
 
  

}
