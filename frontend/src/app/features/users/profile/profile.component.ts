// profile-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const username = this.tokenService.getUsername();

    if (!username) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userService.getUserByUsername(username).subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        if (error.status === 404) {
          this.error = 'User not found';
        } else {
          this.error = 'Failed to load user profile';
        }
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/workouts']);
  }

  getInitials(): string {
    if (!this.user) return 'U';
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }


  formatPhoneNumber(phone: string): string {
    if (phone.startsWith('+381')) {
      const digits = phone.substring(4);
      return `+381 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
    }
    return phone;
  }

}
