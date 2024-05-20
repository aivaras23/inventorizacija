import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BirthYearValidatorDirective } from '../../../directives/birth-year-validator.directive';
import { EmployeesService } from '../../../services/employees.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-new-employee',
  standalone: true,
  imports: [FormsModule,CommonModule, BirthYearValidatorDirective],
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.css',
  animations:[
    trigger('inputFields',[
      state('normal',style({
        'font-size':'16px',
        'height':'36px'
      })),
      state('focused',style({
        'font-size':'32px',
        'height':'62px'
      })),
      transition('* <=> *',[
        animate(500)
      ])
    ]),
    // Animacija klaidu blokeliams
    trigger('errorBlock',[
      // Rodomas stilius * - bet kokia busena
      state('*', style({
        'opacity':'1',
        'height':'50px'
        // 'color':'#00ff00'
      })),
      // transition is neegzistuojancio i bet koki egzistuojanti blokeli
      transition('void => *',[
        // pirmas stylius
        style({
          'opacity':'0',
          'height':'0px'
        }),
        // antras stilius 0.5s 
        animate(500, style({
          'opacity':'0',
          'height':'50px'
        })),
        // trecias stilius dar 0.5s
        animate(500)
      ]),

      transition('* =>void',[
          animate(500, style({
            'opacity':'0',
            'height':'50px'
          })),
          animate(500,style({
            'opacity':'0',
            'height':'50px'
          }))
      ])
    ])
  ]
})
export class NewEmployeeComponent {

    public inputState=['normal','normal','normal','normal','normal'];

    constructor(private employeesService:EmployeesService){
   
    }

    public newEmployeeSubmit(f:NgForm){
    // console.log(f); // iskviesti visa ngForm objekta
    console.log(f.form.value); // iskviesti formos informacija

    this.employeesService.addEmployee(f.form.value).subscribe(()=> {
      f.form.reset();
    });
  }

  public inputFocus(fiedldId:number, state:boolean){
    if(state==true){
      this.inputState[fiedldId]='focused';
    }
    else {
      this.inputState[fiedldId]='normal';
    }
  }

}
