import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'user-theme';
  private readonly DARK_THEME_CLASS = 'dark-theme';
  private themeSubject = new BehaviorSubject<'light' | 'dark' | 'system'>('light');
  currentTheme$ = this.themeSubject.asObservable();
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  currentTheme: 'light' | 'dark' | 'system' = 'light';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | 'system' | null;

    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {

      this.currentTheme = 'system';
    }

    this.applyTheme();
  }

  private applyTheme() {
    let isDark = false;

    if (this.currentTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = this.currentTheme === 'dark';
    }

    if (isDark) {
      document.documentElement.classList.add(this.DARK_THEME_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_THEME_CLASS);
    }

    this.isDarkThemeSubject.next(isDark);
    localStorage.setItem(this.THEME_KEY, this.currentTheme);
    this.themeSubject.next(this.currentTheme);
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.currentTheme = theme;
    this.applyTheme();
  }

  toggleTheme() {
    if (this.currentTheme === 'light') {
      this.setTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'system': return 'monitor';
      default: return 'sun';
    }
  }
}