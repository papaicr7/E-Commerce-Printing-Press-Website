import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective {
  @Input() parallaxSpeed = 0.3;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('window:scroll')
  onScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const scrolled = window.scrollY;
    const offset = (scrolled - rect.top - window.scrollY) * this.parallaxSpeed;
    this.el.nativeElement.style.transform = `translateY(${offset}px)`;
  }
}
