import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'Hospital Finder';
  protected showAIDisclaimer = true;
  protected showMobileMenu = false;
  protected isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    // Check for saved preference for AI disclaimer
    const hideDisclaimer = localStorage.getItem('hideAIDisclaimer');
    if (hideDisclaimer === 'true') {
      this.showAIDisclaimer = false;
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  closeDisclaimer() {
    this.showAIDisclaimer = false;
    localStorage.setItem('hideAIDisclaimer', 'true');
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
