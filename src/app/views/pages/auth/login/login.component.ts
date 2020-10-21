// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation , Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud/utils/layout-utils.service';
import { CustomerChangePassword } from '../../../../core/e-commerce/_actions/customer.actions';
import { calendarFormat } from 'moment';

import { CookieService } from 'ngx-cookie';

const DEMO_PARAMS = {
	EMAIL: 'admin@demo.com',
	PASSWORD: 'demo'
};

export interface DialogData {
	passn: string;
	confpass: string;
  }

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	rememberme = false;

	newpass: string;
	confirmpass: string;

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private cookieService: CookieService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});


	}

	// openDialog() {
	// 	this.dialog.open(ForgotPasswordDialog, {
	// 		panelClass: 'forgot-password-container',
	// 	  data: {
	// 		passn: this.newpass, confpass: this.confirmpass
	// 	 }
	// 	});
	//   }
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}


	openDialog(clientid): void {
		const dialogRef = this.dialog.open(ForgotPasswordDialog, {
			panelClass: 'forgot-password-container',
		  data: {
			passn: this.newpass, confpass: this.confirmpass
		 }
		});
		dialogRef.afterClosed().subscribe(result => {
			debugger;
		 // if(!result){
		//	const message = `Las contraseñas no coinciden.`;
		//	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
		 // }
		 // else{
		
			this.store.dispatch(new CustomerChangePassword({idcust: clientid, pass: result}));
			const message = `Se cambio la contraseña.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
		  // }
		});
	  }

	  ResetForm(){
		  this.loginForm.reset();
	  }

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {

		debugger;
		if(this.cookieService.get('remember')!==undefined){
			if(this.cookieService.get('remember')==='Yes'){
				DEMO_PARAMS.EMAIL = this.cookieService.get('username');
				DEMO_PARAMS.PASSWORD = this.cookieService.get('password');
				// DEMO_PARAMS.remember = true;
				this.rememberme = true;
			}
		}

		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			email: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};
		this.auth
			.login(authData.email, authData.password)
			.pipe(
				tap(user => {
					if (user) {
						debugger;
						if(this.rememberme){
							this.cookieService.put('remember','Yes');
							this.cookieService.put('username',authData.email);
							this.cookieService.put('password',authData.password);
						}else{
								this.cookieService.put('remember','No');
								this.cookieService.put('username','');
								this.cookieService.put('password','');
						}
						if(!user.changePassword){
							this.openDialog(user.clientId);
						}
						else{
							// this.store.dispatch(new Login({authToken: user.accessToken}));
							this.store.dispatch(new Login({authToken: user.clientId.toString()}));
							this.router.navigateByUrl(this.returnUrl); // Main page
						}
					} else {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}


@Component({
	selector: 'app-forgot-password-dialog',
	template: `
	<div class="position-relative h-100">
	<div class="custom-lock-open-icon-dialog" >
		<mat-icon>lock_open</mat-icon>
    </div>
    <form [formGroup]="changPassForm">
        <div class="d-flex flex-column w-75 mx-auto p-4 h-100 justify-content-center">
            <h3 class="text-center mb-2 custom-mt-3rem" >Cambiar Contraseña</h3>
            <div class="d-flex flex-column  justify-content-center align-items-center" >
                    <div class="mb-4 w-100" >
                    <mat-form-field class="mat-form-field-fluid">
                        <mat-label>Nueva Contraseña</mat-label>
						<input type="password" autocomplete="off" matInput [(ngModel)]="data.passn" formControlName="newpass"  class="p-2"/>
						<mat-error *ngIf="passHasError('email', 'required')">
                        <strong>{{ "AUTH.VALIDATION.REQUIRED_FIELD" | translate }}</strong>
	                    </mat-error>
	                    <mat-error *ngIf="passHasError('email', 'email')">
	                        <strong>{{ "AUTH.VALIDATION.INVALID_FIELD" | translate }}</strong>
	                    </mat-error>
	                    <mat-error *ngIf="passHasError('email', 'minlength')">
	                        <strong>{{ "AUTH.VALIDATION.MIN_LENGTH_FIELD" | translate }} 3</strong>
	                    </mat-error>
	                    <mat-error *ngIf="passHasError('email', 'maxlength')">
	                        <strong>{{ "AUTH.VALIDATION.MAX_LENGTH_FIELD" | translate }} 320</strong>
	                    </mat-error>
	                    </mat-form-field>
                    </div>
    
                    <div class="custom-mb-2rem w-100" >
                        <mat-form-field class="mat-form-field-fluid">
                            <mat-label>Repetir Contraseña</mat-label>
							<input type="password" autocomplete="off" matInput [(ngModel)]="data.confpass" formControlName="confirmpass"  class="p-2"/>
							<mat-error *ngIf="MustMatch('newpass', 'confirmpass')">
		                        <strong>{{ "No coinciden las contraseñas" | translate }}</strong>
		                    </mat-error>
                        </mat-form-field>
                    </div>
    
                    <div  mat-dialog-actions class="w-75" >
                        <button mat-button class="btn btn-primary btn-block p-4" (click)="validate(data.confpass)">Inciar Sesión</button>
                    </div>
             </div>
        </div>
    </form>
</div>
	  `,
  })
  export class ForgotPasswordDialog {
	changPassForm: FormGroup;
	constructor(@Inject(MAT_DIALOG_DATA) 
	public data: DialogData,
	private fb: FormBuilder,
	private dialogRef: MatDialogRef<ForgotPasswordDialog>) {}

	get f() { return this.changPassForm.controls; }

	ngOnInit(): void {
		this.changPassForm = this.fb.group({
			newpass: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3)// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			confirmpass: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3)
			])
			]
		},{
			validator: this.MustMatch('newpass','confirmpass')
		  }	
		);
	}

	MustMatch(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			debugger;
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];

			if (matchingControl.errors && !matchingControl.errors.mustMatch) {
				// return if another validator has already found an error on the matchingControl
				return;
			}
			// set error on matchingControl if validation fails
			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ mustMatch: true });
			} else {
				matchingControl.setErrors(null);
			}
		}
	}

	passHasError(controlName: string, validationType: string): boolean {
		const control = this.changPassForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	validate(confirmpass){
		if(this.changPassForm.invalid){
			return
		}
		this.dialogRef.close(confirmpass);
	}
  }