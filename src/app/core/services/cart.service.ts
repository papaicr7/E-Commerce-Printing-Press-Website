import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { Product } from '../../shared/interfaces/product.interface';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private toast = inject(ToastService);

  readonly items = signal<CartItem[]>([]);

  readonly totalCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  addItem(product: Product, quantity = 1): void {
    this.items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { product, quantity }];
    });
    this.toast.show(`${product.name} added to cart ✓`, 'success');
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(i => i.product.id !== productId));
    this.toast.show('Item removed from cart', 'info');
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
    this.toast.show('Cart cleared', 'info');
  }
}
