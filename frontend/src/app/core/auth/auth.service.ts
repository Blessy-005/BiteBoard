import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<AuthResponse | null>(
    this.getStoredUser()
  );

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout(): void {
    sessionStorage.removeItem('biteboard_token');
    sessionStorage.removeItem('biteboard_user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('biteboard_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  isStaff(): boolean {
    return this.currentUser()?.role === 'Staff';
  }

  isCustomer(): boolean {
    return this.currentUser()?.role === 'Customer';
  }

  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem('biteboard_token', response.token);

    sessionStorage.setItem(
      'biteboard_user',
      JSON.stringify(response)
    );

    this.currentUser.set(response);
  }

  private getStoredUser(): AuthResponse | null {
    const storedUser = sessionStorage.getItem('biteboard_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthResponse;
    } catch {
      sessionStorage.removeItem('biteboard_user');
      sessionStorage.removeItem('biteboard_token');
      return null;
    }
  }
}
