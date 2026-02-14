import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent {
  searchService = inject(SearchService);
  productService = inject(ProductService);

  results = signal<Product[]>([]);

  constructor() {
    effect(() => {
      const query = this.searchService.query();
      if (query.length > 2) {
        this.results.set(this.productService.searchProducts(query));
      } else {
        this.results.set([]);
      }
    });
  }

  close(): void {
    this.searchService.close();
  }
}
