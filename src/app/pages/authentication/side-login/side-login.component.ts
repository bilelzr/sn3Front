import {Component} from '@angular/core';
import {CoreService} from 'src/app/services/core.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material.module';
import {BrandingComponent} from '../../../layouts/full/vertical/sidebar/branding.component';
import {AuthService} from "../../../services/apps/auth/auth.service";
import {AuthenticationResponse} from "../../../services/models/authenticationResponse";
import {jwtDecode} from "jwt-decode";
import {UserService} from "../../../services/apps/user/user.service";
import {User} from "../../../services/models/user";

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent],
  templateUrl: './side-login.component.html'
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  user: User = {}

  constructor(private settings: CoreService, private router: Router, private authService: AuthService, private userService: UserService) {
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.controls.uname.value != null && this.form.controls.password.value !== null) {

      this.authService.signIn(this.form.controls.uname.value.trim(), this.form.controls.password.value.trim())
        .subscribe(
          async (response: AuthenticationResponse) => {
            console.log('Login successful', response);

            // Decode the token to access its payload
            const tokenPayload = response.token ? jwtDecode(response.token) : '';            // Assuming tokenPayload contains the email
            const userEmail = tokenPayload.sub;
            this.authService.setToken(response.token ? response.token : '');
            await this.getUserByEmail(userEmail ? userEmail.toString() : '');
            setTimeout(() => {
              this.router.navigate(['/dashboards/dashboard1']);
            }, 1500);
          },
          (error) => {
            console.error('Login error', error);
            // this.showErrorCredentials()

            // Show error message or handle as needed
          }
        );
    } else {
      console.error('Email or password is empty.');
      // this.showErrorViaMessages()
    }
  }

  async getUserByEmail(userEmail: string): Promise<void> {

      this.userService.getUserByEmail(userEmail).subscribe(
        (response: User) => {
          this.user = response;
          sessionStorage.setItem('userRole', response.role?.toString() ?? '');
          sessionStorage.setItem('userEmail', userEmail);
        },
        (error) => {
          console.error('restoring module error', error);
        }
      );
    }

}
