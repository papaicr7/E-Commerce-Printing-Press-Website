import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
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
              (click)="goToStep(step.num)"
            >
              @if (activeStep() > step.num) {
                <span class="co__step-num"><span class="material-icons-outlined" style="font-size:0.85rem">check</span></span>
              } @else {
                <span class="co__step-num">{{ step.num }}</span>
              }
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

          <!-- ═══ STEP 1: Shipping ═══ -->
          @if (activeStep() === 1) {
            <div class="co__card">
              <div class="co__card-header">
                <div class="co__card-header-left">
                  <span class="material-icons-outlined co__card-icon">local_shipping</span>
                  <h2 class="co__card-title">Shipping Address</h2>
                </div>
              </div>

              <div class="co__form">
                <div class="co__field">
                  <label class="co__label">FULL NAME</label>
                  <div class="co__input-wrap">
                    <input type="text" class="co__input" placeholder="Your full name" [(ngModel)]="shippingName" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label">ADDRESS LINE 1</label>
                  <div class="co__input-wrap">
                    <input type="text" class="co__input" placeholder="Street address" [(ngModel)]="addressLine1" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label">ADDRESS LINE 2</label>
                  <div class="co__input-wrap">
                    <input type="text" class="co__input" placeholder="Apartment, suite, etc." [(ngModel)]="addressLine2" />
                  </div>
                </div>
                <div class="co__field-row">
                  <div class="co__field">
                    <label class="co__label">CITY</label>
                    <div class="co__input-wrap">
                      <input type="text" class="co__input" placeholder="City" [(ngModel)]="city" />
                    </div>
                  </div>
                  <div class="co__field">
                    <label class="co__label">PIN CODE</label>
                    <div class="co__input-wrap">
                      <input type="text" class="co__input" placeholder="110001" [(ngModel)]="pinCode" maxlength="6" />
                    </div>
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label">PHONE NUMBER</label>
                  <div class="co__input-wrap co__input-wrap--icon">
                    <span class="material-icons-outlined co__input-icon">phone</span>
                    <input type="tel" class="co__input" placeholder="+91 98765 43210" [(ngModel)]="phone" />
                  </div>
                </div>
              </div>

              <div class="co__nav-buttons">
                <span></span>
                <button class="co__next-btn" (click)="nextStep()">
                  Continue to Payment
                  <span class="material-icons-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          }

          <!-- ═══ STEP 2: Payment ═══ -->
          @if (activeStep() === 2) {
            <!-- Show saved address -->
            <div class="co__card co__card--compact">
              <div class="co__card-header">
                <div class="co__card-header-left">
                  <span class="material-icons-outlined co__card-icon co__card-icon--done">check_circle</span>
                  <h2 class="co__card-title">Shipping Address</h2>
                </div>
                <button class="co__edit-btn" (click)="activeStep.set(1)">Edit</button>
              </div>
              <div class="co__address">
                <p class="co__address-name">{{ shippingName || 'Jonathan Doe' }}</p>
                <p class="co__address-line">{{ addressLine1 || '123 Luxury Lane, Penthouse Suite 4B' }}</p>
                <p class="co__address-line">{{ city || 'New York' }}, {{ pinCode || '10012' }}</p>
              </div>
            </div>

            <!-- Payment form -->
            <div class="co__card">
              <div class="co__card-header">
                <div class="co__card-header-left">
                  <span class="material-icons-outlined co__card-icon">credit_card</span>
                  <h2 class="co__card-title">Payment Method</h2>
                </div>
              </div>

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

              @if (paymentMethod() === 'card') {
                <div class="co__form">
                  <div class="co__field">
                    <label class="co__label">CARD NUMBER</label>
                    <div class="co__input-wrap co__input-wrap--icon">
                      <span class="material-icons-outlined co__input-icon">credit_card</span>
                      <input type="text" class="co__input" placeholder="0000 0000 0000 0000"
                        [(ngModel)]="cardNumber" maxlength="19" />
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
                        <input type="text" class="co__input" placeholder="MM / YY"
                          [(ngModel)]="expiry" maxlength="5" />
                      </div>
                    </div>
                    <div class="co__field">
                      <label class="co__label">
                        CVC
                        <a class="co__cvc-help">
                          <span class="material-icons-outlined">info</span> What's this?
                        </a>
                      </label>
                      <div class="co__input-wrap co__input-wrap--icon-right">
                        <input type="text" class="co__input" placeholder="123"
                          [(ngModel)]="cvc" maxlength="4" />
                        <span class="material-icons-outlined co__input-icon-r">lock</span>
                      </div>
                    </div>
                  </div>
                  <div class="co__field">
                    <label class="co__label">CARDHOLDER NAME</label>
                    <div class="co__input-wrap">
                      <input type="text" class="co__input" placeholder="Name on card" [(ngModel)]="cardName" />
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
                      <input type="text" class="co__input" placeholder="yourname&#64;upi" />
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

              <div class="co__nav-buttons">
                <button class="co__back-btn" (click)="prevStep()">
                  <span class="material-icons-outlined">arrow_back</span>
                  Back
                </button>
                <button class="co__next-btn" (click)="nextStep()">
                  Pay ₹{{ grandTotal().toFixed(2) }}
                  <span class="material-icons-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          }

          <!-- ═══ STEP 3: Confirmation ═══ -->
          @if (activeStep() === 3) {
            <div class="co__card co__confirmation">
              <div class="co__confirm-icon-wrap">
                <span class="material-icons-outlined co__confirm-icon">check_circle</span>
              </div>
              <h2 class="co__confirm-title">Order Confirmed!</h2>
              <p class="co__confirm-sub">Thank you for your purchase. Your order <strong>#HM-{{ orderId }}</strong> has been placed successfully.</p>

              <div class="co__confirm-details">
                <div class="co__confirm-row">
                  <span>Shipping to</span>
                  <span>{{ shippingName || 'Jonathan Doe' }}</span>
                </div>
                <div class="co__confirm-row">
                  <span>Address</span>
                  <span>{{ city || 'New York' }}, {{ pinCode || '10012' }}</span>
                </div>
                <div class="co__confirm-row">
                  <span>Payment</span>
                  <span>{{ paymentMethod() === 'card' ? 'Credit/Debit Card' : paymentMethod() === 'upi' ? 'UPI' : 'Net Banking' }}</span>
                </div>
                <div class="co__confirm-row co__confirm-row--total">
                  <span>Amount Paid</span>
                  <span>₹{{ grandTotal().toFixed(2) }}</span>
                </div>
              </div>

              <p class="co__confirm-email">A confirmation email has been sent to your registered email.</p>

              <button class="co__next-btn co__continue-shopping" (click)="goHome()">
                Continue Shopping
                <span class="material-icons-outlined">storefront</span>
              </button>
            </div>
          }
        </div>

        <!-- Right Column: Order Summary (visible on steps 1 & 2) -->
        @if (activeStep() < 3) {
          <aside class="co__summary">
            <h3 class="co__summary-title">Order Summary</h3>
            <p class="co__order-id">Order: #HM-{{ orderId }}</p>

            @for (item of cartService.items(); track item.product.id) {
              <div class="co__summary-item">
                <img [src]="item.product.imageUrl" [alt]="item.product.name" class="co__summary-img" />
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

            <div class="co__help-card">
              <span class="material-icons-outlined co__help-icon">support_agent</span>
              <div>
                <strong>Need help with your order?</strong>
                <p>Chat with our luxury concierge.</p>
              </div>
            </div>
          </aside>
        }
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

    /* ── Root ─────────────────────────────────── */
    .co {
      min-height: 100vh;
      background: $bg-light;
      color: $text-light;
      font-family: $font-body;

      :host-context(.dark) & {
        background: $bg-dark;
        color: $text-dark;
      }
    }

    /* ── Stepper Bar ─────────────────────────── */
    .co__stepper-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-4 $space-8;
      background: $surface-light;
      border-bottom: 1px solid $border-light;
      flex-wrap: wrap;
      gap: $space-4;

      :host-context(.dark) & {
        background: $surface-dark;
        border-color: rgba(255,255,255,0.06);
      }
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
      color: $primary;
      letter-spacing: 0.05em;
      :host-context(.dark) & { color: #fff; }
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
      color: $text-muted-light;
      font-size: $fs-sm;
      font-weight: 500;
      cursor: pointer;
      transition: color 200ms ease;
      :host-context(.dark) & { color: $text-muted-dark; }
    }

    .co__step-num {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 1.5px solid $text-muted-light;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      transition: all 200ms ease;
      :host-context(.dark) & { border-color: $text-muted-dark; }
    }

    .co__step--active {
      color: $primary;
      :host-context(.dark) & { color: $secondary; }
      .co__step-num {
        border-color: $primary;
        background: $primary;
        color: #fff;
        :host-context(.dark) & {
          border-color: $secondary;
          background: $secondary;
          color: $bg-dark;
        }
      }
    }

    .co__step--done {
      color: $success;
      .co__step-num {
        border-color: $success;
        background: $success;
        color: #fff;
      }
    }

    .co__stepper-secure {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: $text-muted-light;
      font-size: $fs-sm;
      :host-context(.dark) & { color: $text-muted-dark; }
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
      background: $surface-light;
      border: 1px solid $border-light;
      border-radius: $radius-xl;
      padding: $space-6;
      margin-bottom: $space-6;

      :host-context(.dark) & {
        background: $surface-dark;
        border-color: rgba(255,255,255,0.06);
      }
    }

    .co__card--compact {
      padding: $space-4 $space-6;
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
      color: $primary;
      font-size: 1.3rem;
      :host-context(.dark) & { color: $secondary; }

      &--done { color: $success !important; }
    }

    .co__card-title {
      font-family: $font-display;
      font-size: $fs-xl;
      font-weight: 700;
      color: #111;
      :host-context(.dark) & { color: #fff; }
    }

    .co__edit-btn {
      background: transparent;
      border: none;
      color: $primary;
      font-weight: 600;
      font-size: $fs-sm;
      cursor: pointer;
      :host-context(.dark) & { color: $secondary; }
      &:hover { text-decoration: underline; }
    }

    .co__address {
      padding-left: 2rem;
    }

    .co__address-name {
      font-weight: 600;
      color: #333;
      margin-bottom: $space-1;
      :host-context(.dark) & { color: #e2e8f0; }
    }

    .co__address-line {
      color: $text-muted-light;
      font-size: $fs-sm;
      line-height: 1.6;
      :host-context(.dark) & { color: $text-muted-dark; }
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
      border: 1.5px solid $border-light;
      background: transparent;
      color: $text-muted-light;
      cursor: pointer;
      font-size: $fs-sm;
      font-weight: 500;
      transition: all 200ms ease;

      :host-context(.dark) & {
        border-color: rgba(255,255,255,0.08);
        color: $text-muted-dark;
      }

      .material-icons-outlined { font-size: 1.5rem; }

      &:hover {
        border-color: rgba($primary, 0.3);
        color: $primary;
        :host-context(.dark) & { color: $secondary; border-color: rgba($secondary, 0.3); }
      }

      &--active {
        border-color: $primary !important;
        color: $primary !important;
        background: rgba($primary, 0.04);
        :host-context(.dark) & {
          border-color: $secondary !important;
          color: $secondary !important;
          background: rgba($secondary, 0.06);
        }
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
      color: $text-muted-light;
      display: flex;
      align-items: center;
      gap: $space-3;
      :host-context(.dark) & { color: $text-muted-dark; }
    }

    .co__cvc-help {
      display: flex;
      align-items: center;
      gap: $space-1;
      color: $primary;
      font-weight: 500;
      font-size: 0.7rem;
      cursor: pointer;
      text-transform: none;
      letter-spacing: normal;
      :host-context(.dark) & { color: $secondary; }
      .material-icons-outlined { font-size: 0.85rem; }
    }

    .co__input-wrap {
      background: $bg-light;
      border: 1px solid $border-light;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      padding: 0 $space-4;
      transition: border-color 200ms ease;

      :host-context(.dark) & {
        background: $surface-dark-alt;
        border-color: rgba(255,255,255,0.08);
      }

      &:focus-within {
        border-color: $primary;
        :host-context(.dark) & { border-color: $secondary; }
      }

      &--icon { gap: $space-3; }
      &--icon-right { justify-content: space-between; }
    }

    .co__input-icon {
      color: $text-muted-light;
      font-size: 1.2rem;
      :host-context(.dark) & { color: $text-muted-dark; }
    }
    .co__input-icon-r {
      color: $text-muted-light;
      font-size: 1.1rem;
      :host-context(.dark) & { color: $text-muted-dark; }
    }

    .co__input {
      background: transparent;
      border: none;
      outline: none;
      color: #111;
      font-size: $fs-base;
      padding: $space-3 0;
      width: 100%;
      font-family: $font-body;

      :host-context(.dark) & { color: #e2e8f0; }
      &::placeholder {
        color: $text-muted-light;
        :host-context(.dark) & { color: rgba(255,255,255,0.25); }
      }
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
      &--mc { background: #eb001b; }
    }

    .co__save-card {
      display: flex;
      align-items: center;
      gap: $space-3;
      color: $text-muted-light;
      font-size: $fs-sm;
      cursor: pointer;
      :host-context(.dark) & { color: $text-muted-dark; }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: $primary;
        :host-context(.dark) & { accent-color: $secondary; }
        cursor: pointer;
      }
    }

    /* ── Navigation Buttons ──────────────────── */
    .co__nav-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-8;
      padding-top: $space-5;
      border-top: 1px solid $border-light;
      :host-context(.dark) & { border-color: rgba(255,255,255,0.06); }
    }

    .co__next-btn {
      display: flex;
      align-items: center;
      gap: $space-2;
      padding: $space-3 $space-6;
      background: $primary;
      color: #fff;
      font-weight: 700;
      font-size: $fs-sm;
      border: none;
      border-radius: $radius-full;
      cursor: pointer;
      transition: all 200ms ease;

      :host-context(.dark) & {
        background: $secondary;
        color: $bg-dark;
      }

      &:hover { opacity: 0.9; transform: translateY(-1px); }
      .material-icons-outlined { font-size: 1.1rem; }
    }

    .co__back-btn {
      display: flex;
      align-items: center;
      gap: $space-2;
      padding: $space-3 $space-5;
      background: transparent;
      border: 1px solid $border-light;
      color: $text-muted-light;
      font-weight: 600;
      font-size: $fs-sm;
      border-radius: $radius-full;
      cursor: pointer;
      transition: all 200ms ease;

      :host-context(.dark) & {
        border-color: rgba(255,255,255,0.1);
        color: $text-muted-dark;
      }

      &:hover { border-color: $primary; color: $primary; }
      .material-icons-outlined { font-size: 1.1rem; }
    }

    /* ── Order Summary ─────────────────────────── */
    .co__summary {
      background: $surface-light;
      border: 1px solid $border-light;
      border-radius: $radius-xl;
      padding: $space-6;
      height: fit-content;
      position: sticky;
      top: $space-4;

      :host-context(.dark) & {
        background: $surface-dark;
        border-color: rgba(255,255,255,0.06);
      }
    }

    .co__summary-title {
      font-family: $font-display;
      font-size: $fs-xl;
      font-weight: 700;
      color: #111;
      margin-bottom: $space-1;
      :host-context(.dark) & { color: #fff; }
    }

    .co__order-id {
      font-size: $fs-sm;
      color: $text-muted-light;
      margin-bottom: $space-6;
      :host-context(.dark) & { color: $text-muted-dark; }
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
      color: #111;
      font-size: $fs-sm;
      :host-context(.dark) & { color: #e2e8f0; }
    }

    .co__summary-item-desc {
      font-size: $fs-xs;
      color: $text-muted-light;
      :host-context(.dark) & { color: $text-muted-dark; }
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
      background: rgba($primary, 0.08);
      color: $primary;
      font-weight: 600;
      :host-context(.dark) & {
        background: rgba($secondary, 0.12);
        color: $secondary;
      }
    }

    .co__summary-item-price {
      font-weight: 700;
      color: #111;
      white-space: nowrap;
      :host-context(.dark) & { color: #e2e8f0; }
    }

    .co__divider {
      height: 1px;
      background: $border-light;
      margin: $space-4 0;
      :host-context(.dark) & { background: rgba(255,255,255,0.06); }
    }

    .co__summary-row {
      display: flex;
      justify-content: space-between;
      font-size: $fs-sm;
      color: $text-muted-light;
      padding: $space-2 0;
      :host-context(.dark) & { color: $text-muted-dark; }

      &--discount { color: $success; :host-context(.dark) & { color: $success; } }
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
      color: $text-muted-light;
      font-size: $fs-sm;
      :host-context(.dark) & { color: $text-muted-dark; }
    }

    .co__total-sub { font-size: $fs-xs; }

    .co__total-value {
      font-family: $font-display;
      font-size: $fs-3xl;
      font-weight: 800;
      color: $primary;
      :host-context(.dark) & { color: $secondary; }
    }

    .co__help-card {
      display: flex;
      align-items: center;
      gap: $space-4;
      background: $bg-light;
      border: 1px solid $border-light;
      border-radius: $radius-lg;
      padding: $space-4 $space-5;
      margin-top: $space-5;

      :host-context(.dark) & {
        background: $surface-dark-alt;
        border-color: rgba(255,255,255,0.06);
      }

      .co__help-icon {
        font-size: 1.75rem;
        color: $primary;
        :host-context(.dark) & { color: $secondary; }
      }

      strong {
        color: #111;
        font-size: $fs-sm;
        :host-context(.dark) & { color: #e2e8f0; }
      }
      p {
        color: $text-muted-light;
        font-size: $fs-xs;
        margin-top: 2px;
        :host-context(.dark) & { color: $text-muted-dark; }
      }
    }

    /* ── Confirmation ───────────────────────────── */
    .co__confirmation {
      text-align: center;
      padding: $space-12 $space-6;
    }

    .co__confirm-icon-wrap {
      margin-bottom: $space-4;
    }

    .co__confirm-icon {
      font-size: 4rem;
      color: $success;
    }

    .co__confirm-title {
      font-family: $font-display;
      font-size: $fs-3xl;
      font-weight: 700;
      color: #111;
      margin-bottom: $space-3;
      :host-context(.dark) & { color: #fff; }
    }

    .co__confirm-sub {
      color: $text-muted-light;
      font-size: $fs-base;
      line-height: 1.7;
      margin-bottom: $space-8;
      :host-context(.dark) & { color: $text-muted-dark; }
      strong { color: $primary; :host-context(.dark) & { color: $secondary; } }
    }

    .co__confirm-details {
      background: $bg-light;
      border: 1px solid $border-light;
      border-radius: $radius-lg;
      padding: $space-5;
      margin-bottom: $space-6;
      text-align: left;

      :host-context(.dark) & {
        background: $surface-dark-alt;
        border-color: rgba(255,255,255,0.06);
      }
    }

    .co__confirm-row {
      display: flex;
      justify-content: space-between;
      padding: $space-3 0;
      font-size: $fs-sm;
      color: $text-muted-light;
      border-bottom: 1px solid $border-light;

      :host-context(.dark) & {
        color: $text-muted-dark;
        border-color: rgba(255,255,255,0.04);
      }

      &:last-child { border-bottom: none; }

      span:last-child {
        font-weight: 600;
        color: #111;
        :host-context(.dark) & { color: #fff; }
      }

      &--total span:last-child {
        color: $primary;
        font-size: $fs-lg;
        font-weight: 800;
        :host-context(.dark) & { color: $secondary; }
      }
    }

    .co__confirm-email {
      font-size: $fs-sm;
      color: $text-muted-light;
      margin-bottom: $space-6;
      :host-context(.dark) & { color: $text-muted-dark; }
    }

    .co__continue-shopping {
      margin: 0 auto;
    }

    /* ── Trust Footer ────────────────────────── */
    .co__trust {
      display: flex;
      justify-content: center;
      gap: $space-12;
      padding: $space-10 $space-8;
      border-top: 1px solid $border-light;
      :host-context(.dark) & { border-color: rgba(255,255,255,0.04); }
    }

    .co__trust-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-2;
      color: $text-muted-light;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      :host-context(.dark) & { color: $text-muted-dark; }

      .material-icons-outlined { font-size: 1.5rem; }
    }

    .co__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $space-6 $space-8;
      border-top: 1px solid $border-light;
      font-size: $fs-xs;
      color: $text-muted-light;
      flex-wrap: wrap;
      gap: $space-4;

      :host-context(.dark) & {
        border-color: rgba(255,255,255,0.04);
        color: $text-muted-dark;
      }
    }

    .co__footer-links {
      display: flex;
      gap: $space-6;
      a {
        color: $text-muted-light;
        :host-context(.dark) & { color: $text-muted-dark; }
        &:hover { color: $primary; :host-context(.dark) & { color: $secondary; } }
      }
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
      .co__nav-buttons { flex-direction: column-reverse; gap: $space-3; }
      .co__next-btn, .co__back-btn { width: 100%; justify-content: center; }
    }
  `],
})
export class CheckoutComponent {
  private router = inject(Router);
  readonly cartService = inject(CartService);

  readonly steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Confirmation' },
  ];

  readonly activeStep = signal(1);
  readonly paymentMethod = signal<'card' | 'upi' | 'netbanking'>('card');

  readonly paymentTabs = [
    { id: 'card' as const, icon: 'credit_card', label: 'Card' },
    { id: 'upi' as const, icon: 'qr_code_scanner', label: 'UPI' },
    { id: 'netbanking' as const, icon: 'account_balance', label: 'Net Banking' },
  ];

  // Shipping fields
  shippingName = '';
  addressLine1 = '';
  addressLine2 = '';
  city = '';
  pinCode = '';
  phone = '';

  // Card fields
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

  nextStep(): void {
    if (this.activeStep() < 3) {
      this.activeStep.set(this.activeStep() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.activeStep() > 1) {
      this.activeStep.set(this.activeStep() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): void {
    if (step < this.activeStep()) {
      this.activeStep.set(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goHome(): void {
    this.cartService.clearCart();
    this.router.navigate(['/products']);
  }
}
