import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wishlist-page">
      <div class="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{{ wishlist.count() }} items saved</p>
      </div>

      @if (wishlist.count() === 0) {
        <div class="empty-state">
          <span class="material-icons-outlined empty-icon">favorite_border</span>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to revisit them later.</p>
          <a routerLink="/products" class="btn-primary">Start Shopping</a>
        </div>
      } @else {
        <div class="wishlist-grid">
          @for (product of wishlist.items(); track product.id) {
            <div class="wishlist-card">
              <div class="wishlist-card__img">
                <img [src]="product.imageUrl" [alt]="product.name" />
                <button class="remove-btn" (click)="wishlist.toggle(product)">
                  <span class="material-icons-outlined">close</span>
                </button>
              </div>
              <div class="wishlist-card__content">
                <h3>{{ product.name }}</h3>
                <p class="price">₹{{ product.price }}</p>
                <button class="btn-add" (click)="cart.addItem(product)">
                  Add to Cart
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: 60vh;
    }

    .wishlist-header {
      margin-bottom: 3rem;
      text-align: center;

      h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 0.5rem; }
      p { color: #666; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      
      .empty-icon { font-size: 4rem; color: #ccc; margin-bottom: 1rem; }
      h2 { font-size: 1.5rem; margin-bottom: 1rem; }
      p { color: #666; margin-bottom: 2rem; }
    }

    .btn-primary {
      display: inline-block;
      background: #5d1b5d;
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 99px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
      
      &:hover { background: #3d0b3d; }
    }

    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .wishlist-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: transform 0.3s;

      &:hover { transform: translateY(-4px); }

      &__img {
        position: relative;
        height: 300px;
        
        img { width: 100%; height: 100%; object-fit: cover; }
        
        .remove-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          
          &:hover { color: #ef4444; }
        }
      }

      &__content {
        padding: 1.5rem;
        text-align: center;

        h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
        .price { font-weight: bold; color: #5d1b5d; margin-bottom: 1rem; }
        
        .btn-add {
          width: 100%;
          background: #f5b82e;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          
          &:hover { background: #f9d06a; }
        }
      }
    }
  `]
})
export class WishlistComponent {
  wishlist = inject(WishlistService);
  cart = inject(CartService);
}
