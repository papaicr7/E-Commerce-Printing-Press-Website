import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private toast = inject(ToastService);
  
  readonly items = signal<Product[]>([]);

  readonly count = computed(() => this.items().length);

  toggle(product: Product): void {
    const current = this.items();
    const exists = current.some(p => p.id === product.id);

    if (exists) {
      this.items.set(current.filter(p => p.id !== product.id));
      this.toast.show('Removed from wishlist', 'info');
    } else {
      this.items.set([...current, product]);
      this.toast.show('Added to wishlist', 'success');
    }
  }

  isInWishlist(productId: string): boolean {
    return this.items().some(p => p.id === productId);
  }
}
