import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'greeting-cards',
    loadComponent: () =>
      import('./features/greeting-cards/greeting-cards.component').then(m => m.GreetingCardsComponent),
  },
  {
    path: 'customize-studio',
    loadComponent: () =>
      import('./features/customize-studio/customize-studio.component').then(m => m.CustomizeStudioComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
  },
  { path: '**', redirectTo: 'home' },
];
