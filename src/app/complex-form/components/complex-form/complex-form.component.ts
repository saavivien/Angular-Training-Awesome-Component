import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { ComplexFormService } from '../../services/complex-form.service';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';
import { validValidator } from '../../validators/valid.valodator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {

  loading: boolean = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  emailCtrl!: FormControl;
  emailConfirmCtrl!: FormControl;
  emailForm!: FormGroup;
  phoneCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>
  showPhoneCtrl$!: Observable<boolean>

  showEmailMatchingError$!: Observable<boolean>
  showPasswordMatchingError$!: Observable<boolean>

  constructor(
    private formBuilder: FormBuilder,
    private complexFormService: ComplexFormService
  ) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      logginInfo: this.loginInfoForm

    })
  }

  private initFormControls(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });

    this.contactPreferenceCtrl = this.formBuilder.control('email');
    this.emailCtrl = this.formBuilder.control('');
    this.emailConfirmCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.emailConfirmCtrl
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    })

    this.phoneCtrl = this.formBuilder.control('')

    this.passwordCtrl = this.formBuilder.control('', [Validators.required]),
      this.confirmPasswordCtrl = this.formBuilder.control('', [Validators.required]),
      this.loginInfoForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl
      }, {
        validators: [confirmEqualValidator('password', 'confirmPassword')]
      })

  }

  initFormObservables() {
    //rendre le champ visible ou non
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges
      .pipe(
        //Emission d'une première valeur avant des éventuels changements de valeur sur ce control
        startWith(this.contactPreferenceCtrl.value),
        map(preference => preference === 'email'),
        // Mise à jour des validators
        tap(showEmailCrl => this.setEmailValidators(showEmailCrl))
      );
    //Même principe pour le phoneCtrl
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges
      .pipe(
        startWith(this.contactPreferenceCtrl.value),
        map(preference => preference === 'phone'),
        tap(showPhonectrl => this.setPhoneValidators(showPhonectrl))
      )
    this.showEmailMatchingError$ = this.emailForm.statusChanges.
      pipe(
        map((status) => status === 'INVALID' && !!this.emailCtrl.value && !!this.emailConfirmCtrl.value)
      );

    this.showPasswordMatchingError$ = this.loginInfoForm.statusChanges.
      pipe(
        map((status) => status === 'INVALID'
          && !!this.passwordCtrl.value
          && !!this.confirmPasswordCtrl.value
          && this.loginInfoForm.hasError('confirmEqual')
        )
      )

  }

  private setEmailValidators(showEmailCrl: boolean): void {
    if (showEmailCrl) {
      this.emailCtrl.addValidators([Validators.required, Validators.email]);
      this.emailConfirmCtrl.addValidators([Validators.required, Validators.email]);
    } else {
      this.emailCtrl.clearValidators();
      this.emailConfirmCtrl.clearValidators();
    }
    this.emailCtrl.updateValueAndValidity();
    this.emailConfirmCtrl.updateValueAndValidity();
  }

  private setPhoneValidators(showPhoneCtrl: boolean): void {
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([Validators.required, Validators.minLength(10), Validators.minLength(10)])
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();

  }
  getFormControlErroText(ctrl: AbstractControl): string {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse mail valide';
    }
    // avec l minucule
    else if (ctrl.hasError('minlenght')) {
      return 'Merci d\'entrer plus de chiffre';
    }
    else if (ctrl.hasError('maxlenght')) {
      return 'Vous avez entré trop de chiffre';
    }
    else {
      return 'Ce champ contient une erreur';
    }
  }


  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value)
      .pipe(
        tap(saved => {
          this.loading = false;
          if (saved) {
            this.resetForm();
          }
          else {
            console.log('echèc de l\'enregistrement')
          }
        })
      ).subscribe();
  }

  private resetForm() {
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email')
  }


}
