import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[birthYearValidator]',
  providers: [
    {
     provide:NG_VALIDATORS,
     useClass:BirthYearValidatorDirective,
     multi:true
    }
  ],
  standalone: true
})
// implements - is vienos klases igyvendina interfeisa i kita klase(pvz angular Validator)
export class BirthYearValidatorDirective implements Validator {

  constructor() { }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const birthYear:number = control.value;
    const thisYear = (new Date()).getFullYear();
    if(birthYear < 1900 || birthYear > thisYear - 18){
      return { error:'Neteisingi metai'};
    } else {
      return null;
    }
  }

}

// ng g d directives/birthYearValidator
