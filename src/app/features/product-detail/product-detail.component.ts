import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  readonly product = signal<Product | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly quantity = signal(1);
  readonly activeImageIdx = signal(0);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.productService.getById(id);
        if (found) {
          this.product.set(found);
          this.relatedProducts.set(this.productService.getRelated(id, 4));
          this.quantity.set(1);
        } else {
          this.router.navigate(['/products']);
        }
      }
    });
  }

  incrementQty(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQty(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addItem(p, this.quantity());
    }
  }

  buyNow(): void {
    const p = this.product();
    if (p) {
      this.cartService.addItem(p, this.quantity());
      this.router.navigate(['/checkout']);
    }
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) {
      this.wishlistService.toggle(p);
    }
  }

  getRatingStars(rating: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push('star');
    if (half) stars.push('star_half');
    while (stars.length < 5) stars.push('star_outline');
    return stars;
  }
}
