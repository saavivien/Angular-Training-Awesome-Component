import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component'
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortenPipe } from './pipes/shorten.pipe';
import { NamingPipe } from './pipes/naming.pipe';
import { SinceDatePipe } from './pipes/since-date.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { CommentDirective } from './directives/comment.directive';



@NgModule({
  declarations: [
    CommentsComponent,
    ShortenPipe,
    NamingPipe,
    SinceDatePipe,
    HighlightDirective,
    CommentDirective
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    MaterialModule,
    CommentsComponent,
    ReactiveFormsModule,
    ShortenPipe,
    NamingPipe,
    SinceDatePipe,
    HighlightDirective,
    CommentDirective
  ]
})
export class SharedModule { }
