import { AfterViewInit, Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective implements AfterViewInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }
    ngAfterViewInit(): void {
        this.setBackgroundColor('yellow');
    }

    setBackgroundColor(color: string): void {
        this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    }
}