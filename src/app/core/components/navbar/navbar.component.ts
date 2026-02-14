import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly cartService = inject(CartService);
  readonly searchService = inject(SearchService);
  readonly wishlistService = inject(WishlistService);
  readonly mobileOpen = signal(false);

  openSearch(): void {
    this.searchService.open();
    this.closeMobile();
  }

  readonly navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/greeting-cards', label: 'Corporate Gifting' },
    { path: '/customize-studio', label: 'Personalized' },
    { path: '/contact', label: 'About Us' },
  ];

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
