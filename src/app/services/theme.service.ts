import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Check for user preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check for system preference if no saved preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    } else {
      this.setDarkMode(savedTheme === 'dark');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setDarkMode(e.matches);
      }
    });
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);

    // Save preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update document class for Tailwind
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode.value);
  }
}
