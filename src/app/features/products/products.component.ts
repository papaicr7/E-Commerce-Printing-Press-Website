import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly activeFilter = signal('All Items');

  readonly categories = [
    'All Items', 'Drinkware', 'Apparel', 'Stationery', 'Accessories', 'Frames', 'Bags', 'Tech'
  ];

  readonly filteredProducts = signal<Product[]>(this.productService.products());

  setFilter(category: string): void {
    this.activeFilter.set(category);
    if (category === 'All Items') {
      this.filteredProducts.set(this.productService.products());
    } else {
      this.filteredProducts.set(this.productService.products().filter(p => p.category === category));
    }
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    this.cartService.addItem(product);
  }
}
