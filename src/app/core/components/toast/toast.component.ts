import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type">
          <span class="toast__icon material-icons-outlined">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" (click)="toastService.dismiss(toast.id)">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`

    .toast-container {
      position: fixed;
      top: 6rem;
      right: 1.5rem;
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
      animation: slideIn 0.3s ease;
      min-width: 280px;
      font-size: 0.875rem;

      :host-context(.dark) & {
        background: #2D1B2D;
        color: #E5E5E5;
      }

      &--success .toast__icon { color: #25D366; }
      &--error .toast__icon   { color: #EF4444; }
      &--info .toast__icon    { color: #3B82F6; }
    }

    .toast__message { flex: 1; }
    .toast__close {
      opacity: 0.5;
      transition: opacity 0.2s;
      &:hover { opacity: 1; }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
