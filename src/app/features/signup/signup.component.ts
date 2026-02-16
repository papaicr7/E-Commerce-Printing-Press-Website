import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  formData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
  };

  showPassword = false;
  subscribeNewsletter = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    console.log('Signup submitted:', this.formData, { newsletter: this.subscribeNewsletter });
  }
}
