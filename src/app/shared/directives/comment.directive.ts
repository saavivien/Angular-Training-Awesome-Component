import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[comment]'
})
export class CommentDirective implements AfterViewInit {
    @Input() size: 1 | 2 = 1;
    previousSize!: 1 | 2;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }
    ngAfterViewInit(): void {
        this.setCommentStyle(this.size);
    }
    setCommentStyle(size: 1 | 2) {
        this.renderer.setStyle(this.el.nativeElement, 'font-size', size === 1 ? 'small' : 'x-small')
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.previousSize = this.size;
        this.size = 1
        this.setCommentStyle(this.size);
    }
    @HostListener('mouseleave') onMouseLeave() {
        this.size = this.previousSize;
        this.setCommentStyle(this.size);
    }
}