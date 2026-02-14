import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { WhatsappFabComponent } from './core/components/whatsapp-fab/whatsapp-fab.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { ScrollService } from './core/services/scroll.service';
import { SearchOverlayComponent } from './core/components/search-overlay/search-overlay.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    WhatsappFabComponent, 
    ToastComponent, 
    SearchOverlayComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private scroll = inject(ScrollService);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.scroll.scrollToTop());
  }
}
