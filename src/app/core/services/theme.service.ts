import { Injectable, Renderer2, RendererFactory2, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  readonly isDark = signal(false);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const stored = localStorage.getItem('harano-theme');
    if (stored === 'dark') {
      this.isDark.set(true);
    } else if (!stored) {
      this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    effect(() => {
      const html = document.documentElement;
      if (this.isDark()) {
        this.renderer.addClass(html, 'dark');
        localStorage.setItem('harano-theme', 'dark');
      } else {
        this.renderer.removeClass(html, 'dark');
        localStorage.setItem('harano-theme', 'light');
      }
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
