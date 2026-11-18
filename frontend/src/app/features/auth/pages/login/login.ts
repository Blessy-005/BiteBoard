import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue())
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          const destination =
            response.role === 'Customer'
              ? '/food-items'
              : '/dashboard';

          this.router.navigate([destination]);
        },
        error: (error) => {
          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Server is not responding. Please try again.';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. New to BiteBoard? Create an account.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Check whether the backend is running.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        }
      });
  }
}
