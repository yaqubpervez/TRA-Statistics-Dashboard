import { Directive, ElementRef, Input, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appBreakTextAtPoint]'
})
export class BreakTextAtPointDirective implements AfterViewInit {
  @Input() breakWords: string[] = [];
  private resizeObserver: ResizeObserver;

  constructor(private el: ElementRef) {
    this.resizeObserver = new ResizeObserver(() => this.breakText());
  }

  ngAfterViewInit() {
    this.resizeObserver.observe(this.el.nativeElement);
    this.breakText();
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.el.nativeElement);
  }

  private breakText() {
    const container = this.el.nativeElement;
    const originalText = container.textContent;
    const containerWidth = container.clientWidth;
    const context = document.createElement('canvas').getContext('2d');
    context.font = window.getComputedStyle(container).font;

    let newText = originalText;

    this.breakWords.forEach(word => {
      const wordWidth = context.measureText(word).width;
      if (wordWidth > containerWidth) {
        const regex = new RegExp(word, 'gi');
        newText = newText.replace(regex, (match) => {
          const breakPoint = Math.ceil(match.length / 2);
          return match.substring(0, breakPoint) + '<br>' + match.substring(breakPoint);
        });
      }
    });

    container.innerHTML = newText;
  }
}