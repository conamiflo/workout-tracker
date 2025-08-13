import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {UserRegistrationRequest} from '../../../core/models/user-registration-request.model';
import {UserResponse} from '../../../core/models/user-response.model';
import {SuccessPopupComponent} from '../../../shared/components/success-popup/success-popup.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuccessPopupComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  globalError = '';
  successMessage = '';
  showSuccessPopup = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator]]
    });
  }

  // Custom validator for phone number
  phoneNumberValidator(control: any) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (control.value && !phoneRegex.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.globalError = '';
      this.successMessage = '';

      const registerData: UserRegistrationRequest = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        phoneNumber: this.registerForm.value.phoneNumber
      };

      this.authService.register(registerData).subscribe({
        next: (response: UserResponse) => {
          this.isLoading = false;
          this.showSuccessPopup = true;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            this.globalError = error.error?.message || 'Username already exists. Please choose a different username.';
          } else if (error.status === 400) {
            this.globalError = error.error?.message || 'Invalid data provided. Please check your input.';
          } else {
            this.globalError = error.error?.message || 'Registration failed. Please try again.';
          }

          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  onPopupClose(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['invalidPhone']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      password: 'Password',
      firstName: 'First name',
      lastName: 'Last name',
      phoneNumber: 'Phone number'
    };
    return displayNames[fieldName] || fieldName;
  }
}
