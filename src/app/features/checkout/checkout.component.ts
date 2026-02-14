import { Component, inject, signal, computed } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="co">
      <!-- ── Stepper Header ─────────────────────────── -->
      <div class="co__stepper-bar">
        <div class="co__stepper-brand">
          <span class="co__stepper-logo">H</span>
          <span class="co__stepper-name">HARANO MAGAZINE</span>
        </div>
        <div class="co__stepper-steps">
          @for (step of steps; track step.num) {
            <div
              class="co__step"
              [class.co__step--active]="activeStep() === step.num"
              [class.co__step--done]="activeStep() > step.num"
            >
              <span class="co__step-num">{{ step.num }}</span>
              <span class="co__step-label">{{ step.label }}</span>
            </div>
          }
        </div>
        <div class="co__stepper-secure">
          <span class="material-icons-outlined">lock</span>
          Secure Checkout
        </div>
      </div>

      <!-- ── Main ───────────────────────────────────── -->
      <div class="co__main">
        <!-- Left Column -->
        <div class="co__left">
          <!-- Shipping Address -->
          <div class="co__card">
            <div class="co__card-header">
              <div class="co__card-header-left">
                <span class="material-icons-outlined co__card-icon">check_circle</span>
                <h2 class="co__card-title">Shipping Address</h2>
              </div>
              <button class="co__edit-btn">Edit</button>
            </div>
            <div class="co__address">
              <p class="co__address-name">Jonathan Doe</p>
              <p class="co__address-line">123 Luxury Lane, Penthouse Suite 4B</p>
              <p class="co__address-line">New York, NY 10012</p>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="co__card co__card--payment">
            <div class="co__card-header">
              <div class="co__card-header-left">
                <span class="material-icons-outlined co__card-icon">credit_card</span>
                <h2 class="co__card-title">Payment Method</h2>
              </div>
            </div>

            <!-- Tabs -->
            <div class="co__pay-tabs">
              @for (tab of paymentTabs; track tab.id) {
                <button
                  class="co__pay-tab"
                  [class.co__pay-tab--active]="paymentMethod() === tab.id"
                  (click)="paymentMethod.set(tab.id)"
                >
                  <span class="material-icons-outlined">{{ tab.icon }}</span>
                  <span>{{ tab.label }}</span>
                </button>
              }
            </div>

            <!-- Card Form -->
            @if (paymentMethod() === 'card') {
              <div class="co__form">
                <div class="co__field">
                  <label class="co__label">CARD NUMBER</label>
                  <div class="co__input-wrap co__input-wrap--icon">
                    <span class="material-icons-outlined co__input-icon">credit_card</span>
                    <input
                      type="text"
                      class="co__input"
                      placeholder="0000 0000 0000 0000"
                      [(ngModel)]="cardNumber"
                      maxlength="19"
                    />
                    <div class="co__card-brands">
                      <span class="co__brand-dot co__brand-dot--visa"></span>
                      <span class="co__brand-dot co__brand-dot--mc"></span>
                    </div>
                  </div>
                </div>

                <div class="co__field-row">
                  <div class="co__field">
                    <label class="co__label">EXPIRY DATE</label>
                    <div class="co__input-wrap">
                      <input
                        type="text"
                        class="co__input"
                        placeholder="MM / YY"
                        [(ngModel)]="expiry"
                        maxlength="5"
                      />
                    </div>
                  </div>
                  <div class="co__field">
                    <label class="co__label">
                      CVC
                      <a class="co__cvc-help">
                        <span class="material-icons-outlined">info</span>
                        What's this?
                      </a>
                    </label>
                    <div class="co__input-wrap co__input-wrap--icon-right">
                      <input
                        type="text"
                        class="co__input"
                        placeholder="123"
                        [(ngModel)]="cvc"
                        maxlength="4"
                      />
                      <span class="material-icons-outlined co__input-icon-r">lock</span>
                    </div>
                  </div>
                </div>

                <div class="co__field">
                  <label class="co__label">CARDHOLDER NAME</label>
                  <div class="co__input-wrap">
                    <input
                      type="text"
                      class="co__input"
                      placeholder="Name on card"
                      [(ngModel)]="cardName"
                    />
                  </div>
                </div>

                <label class="co__save-card">
                  <input type="checkbox" [(ngModel)]="saveCard" />
                  <span>Save this card securely for future purchases</span>
                </label>
              </div>
            }

            @if (paymentMethod() === 'upi') {
              <div class="co__form">
                <div class="co__field">
                  <label class="co__label">UPI ID</label>
                  <div class="co__input-wrap">
                    <input type="text" class="co__input" placeholder="yourname@upi" />
                  </div>
                </div>
              </div>
            }

            @if (paymentMethod() === 'netbanking') {
              <div class="co__form">
                <div class="co__field">
                  <label class="co__label">SELECT YOUR BANK</label>
                  <div class="co__input-wrap">
                    <select class="co__input co__select">
                      <option value="">Choose a bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <aside class="co__summary">
          <h3 class="co__summary-title">Order Summary</h3>
          <p class="co__order-id">Order: #HM-{{ orderId }}</p>

          @for (item of cartService.items(); track item.product.id) {
            <div class="co__summary-item">
              <img
                [src]="item.product.imageUrl"
                [alt]="item.product.name"
                class="co__summary-img"
              />
              <div class="co__summary-item-info">
                <span class="co__summary-item-name">{{ item.product.name }}</span>
                <span class="co__summary-item-desc">{{ item.product.shortDescription }}</span>
                @if (item.product.tags.length > 0) {
                  <div class="co__summary-tags">
                    @for (tag of item.product.tags.slice(0, 2); track tag) {
                      <span class="co__tag">{{ tag }}</span>
                    }
                  </div>
                }
              </div>
              <span class="co__summary-item-price">₹{{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          }

          <div class="co__divider"></div>

          <div class="co__summary-row">
            <span>Subtotal</span>
            <span>₹{{ subtotal().toFixed(2) }}</span>
          </div>
          <div class="co__summary-row">
            <span>Shipping (Express)</span>
            <span>₹15.00</span>
          </div>
          <div class="co__summary-row">
            <span>Taxes (VAT 10%)</span>
            <span>₹{{ taxes().toFixed(2) }}</span>
          </div>
          <div class="co__summary-row co__summary-row--discount">
            <span>Discount (FirstOrder)</span>
            <span>-₹{{ discount().toFixed(2) }}</span>
          </div>

          <div class="co__divider"></div>

          <div class="co__total-section">
            <div class="co__total-label">
              <span>Total Amount</span>
              <span class="co__total-sub">Including taxes</span>
            </div>
            <span class="co__total-value">₹{{ grandTotal().toFixed(2) }}</span>
          </div>

          <button class="co__pay-btn">
            Pay ₹{{ grandTotal().toFixed(2) }} →
          </button>

          <p class="co__terms">
            By clicking the button, you agree to our
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <div class="co__help-card">
            <span class="material-icons-outlined co__help-icon">support_agent</span>
            <div>
              <strong>Need help with your order?</strong>
              <p>Chat with our luxury concierge.</p>
            </div>
          </div>
        </aside>
      </div>

      <!-- ── Trust Footer ───────────────────────────── -->
      <div class="co__trust">
        <div class="co__trust-item">
          <span class="material-icons-outlined">verified_user</span>
          <span>SECURE SSL</span>
        </div>
        <div class="co__trust-item">
          <span class="material-icons-outlined">lock</span>
          <span>ENCRYPTED</span>
        </div>
        <div class="co__trust-item">
          <span class="material-icons-outlined">headset_mic</span>
          <span>24/7 SUPPORT</span>
        </div>
      </div>

      <footer class="co__footer">
        <span>© 2025 Harano Magazine. All rights reserved.</span>
        <div class="co__footer-links">
          <a href="#">Returns & Refunds</a>
          <a href="#">Shipping Policy</a>
          <a href="#">FAQ</a>
        </div>
      </footer>
    </section>
  `,
  styles: [`
    @use 'variables' as *;
    @use 'mixins' as *;

    .co {
      min-height: 100vh;
      background: #0b1120;
      color: #c8d0df;
      font-family: $font-body;
    }

    /* ── Stepper Bar ─────────────────────────── */
    .co__stepper-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-4 $space-8;
      background: #0d1529;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-wrap: wrap;
      gap: $space-4;
    }

    .co__stepper-brand {
      display: flex;
      align-items: center;
      gap: $space-3;
    }

    .co__stepper-logo {
      width: 2.25rem;
      height: 2.25rem;
      background: $primary;
      color: #fff;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-weight: 700;
      font-size: $fs-lg;
    }

    .co__stepper-name {
      font-family: $font-display;
      font-weight: 700;
      font-size: $fs-lg;
      color: #fff;
      letter-spacing: 0.05em;
    }

    .co__stepper-steps {
      display: flex;
      align-items: center;
      gap: $space-8;
    }

    .co__step {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: #4a5568;
      font-size: $fs-sm;
      font-weight: 500;
    }

    .co__step-num {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 1.5px solid #4a5568;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .co__step--active {
      color: $secondary;
      .co__step-num {
        border-color: $secondary;
        background: $secondary;
        color: #0b1120;
      }
    }

    .co__step--done {
      color: #25d366;
      .co__step-num {
        border-color: #25d366;
        background: #25d366;
        color: #0b1120;
      }
    }

    .co__stepper-secure {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: #4a5568;
      font-size: $fs-sm;
      .material-icons-outlined { font-size: 1rem; }
    }

    /* ── Main Layout ─────────────────────────── */
    .co__main {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-8;
      padding: $space-8;

      @include respond($bp-md) {
        grid-template-columns: 1.2fr 1fr;
      }
    }

    /* ── Cards ────────────────────────────────── */
    .co__card {
      background: #111b2e;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: $radius-xl;
      padding: $space-6;
      margin-bottom: $space-6;
    }

    .co__card--payment {
      background: #0f1829;
    }

    .co__card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-5;
    }

    .co__card-header-left {
      display: flex;
      align-items: center;
      gap: $space-3;
    }

    .co__card-icon {
      color: $secondary;
      font-size: 1.3rem;
    }

    .co__card-title {
      font-family: $font-display;
      font-size: $fs-xl;
      font-weight: 700;
      color: #fff;
    }

    .co__edit-btn {
      background: transparent;
      border: none;
      color: $secondary;
      font-weight: 600;
      font-size: $fs-sm;
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }

    .co__address {
      padding-left: 2rem;
    }

    .co__address-name {
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: $space-1;
    }

    .co__address-line {
      color: #7a879a;
      font-size: $fs-sm;
      line-height: 1.6;
    }

    /* ── Payment Tabs ────────────────────────── */
    .co__pay-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-4;
      margin-bottom: $space-6;
    }

    .co__pay-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-2;
      padding: $space-4 $space-3;
      border-radius: $radius-lg;
      border: 1.5px solid rgba(255,255,255,0.08);
      background: transparent;
      color: #7a879a;
      cursor: pointer;
      font-size: $fs-sm;
      font-weight: 500;
      transition: all 200ms ease;

      .material-icons-outlined { font-size: 1.5rem; }

      &:hover {
        border-color: rgba(255,255,255,0.15);
        color: #c8d0df;
      }

      &--active {
        border-color: $secondary;
        color: $secondary;
        background: rgba($secondary, 0.06);
      }
    }

    /* ── Form ─────────────────────────────────── */
    .co__form {
      display: flex;
      flex-direction: column;
      gap: $space-5;
    }

    .co__field { display: flex; flex-direction: column; gap: $space-2; }

    .co__field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;
    }

    .co__label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #7a879a;
      display: flex;
      align-items: center;
      gap: $space-3;
    }

    .co__cvc-help {
      display: flex;
      align-items: center;
      gap: $space-1;
      color: #3b82f6;
      font-weight: 500;
      font-size: 0.7rem;
      cursor: pointer;
      text-transform: none;
      letter-spacing: normal;
      .material-icons-outlined { font-size: 0.85rem; }
    }

    .co__input-wrap {
      background: #1a2640;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      padding: 0 $space-4;
      transition: border-color 200ms ease;

      &:focus-within { border-color: $secondary; }

      &--icon { gap: $space-3; }
      &--icon-right { justify-content: space-between; }
    }

    .co__input-icon { color: #4a5568; font-size: 1.2rem; }
    .co__input-icon-r { color: #4a5568; font-size: 1.1rem; }

    .co__input {
      background: transparent;
      border: none;
      outline: none;
      color: #e2e8f0;
      font-size: $fs-base;
      padding: $space-3 0;
      width: 100%;
      font-family: $font-body;

      &::placeholder { color: #4a5568; }
    }

    .co__select {
      appearance: none;
      cursor: pointer;
    }

    .co__card-brands {
      display: flex;
      gap: $space-2;
    }

    .co__brand-dot {
      width: 28px;
      height: 20px;
      border-radius: 4px;
      &--visa { background: #1a1f71; }
      &--mc { background: #2b2d42; }
    }

    .co__save-card {
      display: flex;
      align-items: center;
      gap: $space-3;
      color: #7a879a;
      font-size: $fs-sm;
      cursor: pointer;

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: $secondary;
        cursor: pointer;
      }
    }

    /* ── Order Summary ─────────────────────────── */
    .co__summary {
      background: #111b2e;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: $radius-xl;
      padding: $space-6;
      height: fit-content;
      position: sticky;
      top: $space-4;
    }

    .co__summary-title {
      font-family: $font-display;
      font-size: $fs-xl;
      font-weight: 700;
      color: #fff;
      margin-bottom: $space-1;
    }

    .co__order-id {
      font-size: $fs-sm;
      color: #4a5568;
      margin-bottom: $space-6;
    }

    .co__summary-item {
      display: flex;
      align-items: flex-start;
      gap: $space-4;
      margin-bottom: $space-5;
    }

    .co__summary-img {
      width: 4rem;
      height: 4rem;
      object-fit: cover;
      border-radius: $radius-md;
      flex-shrink: 0;
    }

    .co__summary-item-info {
      display: flex;
      flex-direction: column;
      gap: $space-1;
      flex: 1;
    }

    .co__summary-item-name {
      font-weight: 600;
      color: #e2e8f0;
      font-size: $fs-sm;
    }

    .co__summary-item-desc {
      font-size: $fs-xs;
      color: #7a879a;
    }

    .co__summary-tags {
      display: flex;
      gap: $space-2;
      margin-top: $space-1;
    }

    .co__tag {
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: $radius-full;
      background: rgba($secondary, 0.12);
      color: $secondary;
      font-weight: 600;
    }

    .co__summary-item-price {
      font-weight: 700;
      color: #e2e8f0;
      white-space: nowrap;
    }

    .co__divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: $space-4 0;
    }

    .co__summary-row {
      display: flex;
      justify-content: space-between;
      font-size: $fs-sm;
      color: #7a879a;
      padding: $space-2 0;

      &--discount { color: $success; }
    }

    .co__total-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: $space-4 0;
    }

    .co__total-label {
      display: flex;
      flex-direction: column;
      gap: $space-1;
      color: #7a879a;
      font-size: $fs-sm;
    }

    .co__total-sub { font-size: $fs-xs; }

    .co__total-value {
      font-family: $font-display;
      font-size: $fs-3xl;
      font-weight: 800;
      color: #fff;
    }

    .co__pay-btn {
      width: 100%;
      padding: $space-4;
      background: $secondary;
      color: #0b1120;
      font-weight: 700;
      font-size: $fs-base;
      border: none;
      border-radius: $radius-full;
      cursor: pointer;
      margin-top: $space-4;
      transition: opacity 200ms ease, transform 200ms ease;

      &:hover { opacity: 0.9; transform: translateY(-1px); }
    }

    .co__terms {
      text-align: center;
      font-size: $fs-xs;
      color: #4a5568;
      margin-top: $space-4;
      line-height: 1.6;

      a { color: #3b82f6; text-decoration: underline; }
    }

    .co__help-card {
      display: flex;
      align-items: center;
      gap: $space-4;
      background: #0d1529;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: $radius-lg;
      padding: $space-4 $space-5;
      margin-top: $space-5;

      .co__help-icon {
        font-size: 1.75rem;
        color: $secondary;
      }

      strong { color: #e2e8f0; font-size: $fs-sm; }
      p { color: #7a879a; font-size: $fs-xs; margin-top: 2px; }
    }

    /* ── Trust Footer ────────────────────────── */
    .co__trust {
      display: flex;
      justify-content: center;
      gap: $space-12;
      padding: $space-10 $space-8;
      border-top: 1px solid rgba(255,255,255,0.04);
    }

    .co__trust-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-2;
      color: #4a5568;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;

      .material-icons-outlined { font-size: 1.5rem; }
    }

    .co__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $space-6 $space-8;
      border-top: 1px solid rgba(255,255,255,0.04);
      font-size: $fs-xs;
      color: #4a5568;
      flex-wrap: wrap;
      gap: $space-4;
    }

    .co__footer-links {
      display: flex;
      gap: $space-6;
      a { color: #7a879a; &:hover { color: #e2e8f0; } }
    }

    /* ── Responsive ──────────────────────────── */
    @media (max-width: 768px) {
      .co__stepper-bar {
        flex-direction: column;
        align-items: flex-start;
        padding: $space-4;
      }
      .co__stepper-steps { gap: $space-4; }
      .co__main { padding: $space-4; }
      .co__field-row { grid-template-columns: 1fr; }
      .co__trust { gap: $space-6; }
      .co__footer { flex-direction: column; text-align: center; }
    }
  `],
})
export class CheckoutComponent {
  readonly cartService = inject(CartService);

  readonly steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Confirmation' },
  ];

  readonly activeStep = signal(2); // Payment step active
  readonly paymentMethod = signal<'card' | 'upi' | 'netbanking'>('card');

  readonly paymentTabs = [
    { id: 'card' as const, icon: 'credit_card', label: 'Card' },
    { id: 'upi' as const, icon: 'qr_code_scanner', label: 'UPI' },
    { id: 'netbanking' as const, icon: 'account_balance', label: 'Net Banking' },
  ];

  cardNumber = '';
  expiry = '';
  cvc = '';
  cardName = '';
  saveCard = false;

  orderId = Math.random().toString(36).substring(2, 8).toUpperCase();

  readonly subtotal = computed(() => this.cartService.totalPrice());
  readonly taxes = computed(() => this.subtotal() * 0.1);
  readonly discount = computed(() => Math.min(this.subtotal() * 0.08, 12));
  readonly grandTotal = computed(
    () => this.subtotal() + 15 + this.taxes() - this.discount()
  );
}
