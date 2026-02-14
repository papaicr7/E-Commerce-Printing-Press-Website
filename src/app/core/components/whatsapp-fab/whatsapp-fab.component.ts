import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  template: `
    <a href="https://wa.me/8801234567890" target="_blank" rel="noopener" class="fab" aria-label="Chat on WhatsApp">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </a>
  `,
  styles: [`
    .fab {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 90;
      background: #25D366;
      color: #fff;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      transition: transform 0.3s ease, background 0.3s ease;
      &:hover {
        transform: scale(1.1);
        background: #128C7E;
      }
    }
  `],
})
export class WhatsappFabComponent {}
