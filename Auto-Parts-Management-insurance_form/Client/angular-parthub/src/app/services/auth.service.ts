import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.clearUser();
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser() && !!localStorage.getItem('token');
  }

  getUserFullName(): string {
    const user = this.getCurrentUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  }

  getUserFirstName(): string {
    const user = this.getCurrentUser();
    return user?.firstName || '';
  }

  getUserLastName(): string {
    const user = this.getCurrentUser();
    return user?.lastName || '';
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  logout(): void {
    this.clearUser();
  }

  private clearUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Method to update user data (called after login)
  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }
} 