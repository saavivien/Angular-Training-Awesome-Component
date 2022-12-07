import { animate, query, state, style, transition, trigger, group, stagger, animateChild, sequence, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { flashAnimation } from '../../animations/flash.animation';
import { slideAndFadeAnimation } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  // https://openclassrooms.com/fr/courses/7471281-perfectionnez-vous-sur-angular/7718021-creez-des-animations-complexes
  animations: [
    //Ce premier trigger permet de définir l'ordre d'animation des éléments aimé par le second trigger
    trigger('list', [
      transition(':enter', [
        query('@listItem', [
          // stagger permet d'étaler les animations de liste 
          stagger(50, [
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('listItem', [
      // Animation pour changer d'état au survol de la souris
      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(201, 157, 242)',
        'z-index': 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
      // Animation depuis le vide lorsque l'élément est crée  
      transition(':enter', [
        // Animation sur un sous tag pour le rendre invisible avant le début de l'animation sur le comment(la fonction query permet de manipuler un sous tag)
        query('.comment-text, .comment-date', [
          style({
            opacity: 0
          }),
        ]),
        useAnimation(slideAndFadeAnimation),
        // Animation sur un sous tag pour le rendre visible à la fint de l'animation sur le comment
        // La fonction groupe permet de paralléliser les deux animations
        group([
          // par défaut, les animations se font en séquence, mais étant dans un "group" ce n'est plus le cas, alors pour retrouver ce comportement dans un groupe, on utilise a fonction séquence()
          useAnimation(flashAnimation, {
            params: {
              time: '500ms',
              flashColor: 'rgb(201, 157, 242)'
            }
          }),
          query('.comment-text', [
            animate('250ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('500ms', style({
              opacity: 1
            }))
          ])
        ]),
      ])
    ])]
})
export class CommentsComponent implements OnInit {

  @Input() comments!: Comment[]
  // animationState: { [key: number]: 'default' | 'active' } = {}
  animationState: ('default' | 'active')[] = []

  @Output() newComment = new EventEmitter<string>()

  commentCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)])
    for (let index in this.comments) {
      this.animationState[index] = 'default'
    }
  }

  onLeaveComment() {
    const maxId = Math.max(...this.comments.map(comment => comment.id))
    this.comments.unshift(
      {
        id: maxId + 1,
        userId: 1,
        comment: this.commentCtrl.value,
        createdDate: new Date().toISOString()
      }
    )
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }
  onListItemMouseEnter(index: number) {
    this.animationState[index] = 'active';
  }
  onListItemMouseLeave(index: number) {
    this.animationState[index] = 'default';

  }
}
