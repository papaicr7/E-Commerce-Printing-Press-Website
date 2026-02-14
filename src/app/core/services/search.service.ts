import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  readonly query = signal('');
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.query.set('');
  }

  setQuery(q: string): void {
    this.query.set(q);
  }
}
