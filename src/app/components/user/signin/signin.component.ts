import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '@models/user.model';

import { AuthService } from '@services/auth.service';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lt-signin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  protected form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected authInvalid$ = new BehaviorSubject<boolean>(false);
  protected signedIn$?: Observable<User>;

  constructor(
    private readonly fb: FormBuilder,
    public readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit() {
    const { username, password } = this.form.value;

    this.authInvalid$.next(false);
    this.signedIn$ = this.auth.signIn(username, password).pipe(
      tap(() => this.router.navigate(['/'])),
      catchError((err: any) => {
        if (err.msg && err.msg === 'USER_DATA_INCORRECT') {
          this.authInvalid$.next(true);
        }

        return EMPTY;
      }),
    );
  }
}
