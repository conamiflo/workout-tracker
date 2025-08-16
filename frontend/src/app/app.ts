import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {NgIf} from '@angular/common';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  constructor(private authService: AuthService) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
