import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path
import { TokenStorageService } from '../../../core/services/token-storage.service'; // Adjust path

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  showMobileMenu = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.username = this.tokenService.getUsername() || 'User';
    }
  }

  signOut(): void {
      this.authService.logout().subscribe({
        next: () => {
          this.finishLogout();
        },
        error: (error) => {
          console.error('Backend logout failed:', error);
        }
      });
  }

  private finishLogout(): void {
    this.isAuthenticated = false;
    this.username = '';
    this.showMobileMenu = false;
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }
}
