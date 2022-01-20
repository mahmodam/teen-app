import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { QuestionsComponent } from './questions/questions.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    pathMatch:'full'
  },
  {
    path:'',
    canActivate:[AuthGuard],
    runGuardsAndResolvers:'always',
    children:[
      {path:'members',
        loadChildren: () => import('./modules/members.module').then(m => m.MembersModule)
      },
      {path:'lists',component:ListsComponent},
      {path:'messages',component: MessagesComponent},
      {path:'questions',component: QuestionsComponent},
      {path:'videos',component:VideosComponent},
      {path:'meetings',component:MeetingsComponent}
    ]
  },
  
  {
    path:'**',
    pathMatch:'full',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
