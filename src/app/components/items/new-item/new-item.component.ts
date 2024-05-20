import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ItemsService } from '../../../services/items.service';
import { Observable, map } from 'rxjs';
import { EmployeesService } from '../../../services/employees.service';
import { Employee } from '../../../models/employee';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-item.component.html',
  styleUrl: './new-item.component.css',
  // animaciju, trigeriu idejimas
  animations: [
    trigger('caption',[
      state('normal', style({
        'color':'#000000',
        transform:'translateX(0px)'
      })),
      state('clicked1', style({
        'color':'#00ff00',
        transform:'translateX(-2000px)'
      })),
      state('clicked2', style({
      'color':'#ff0000',
      })),
      // 'normal<=>clicked'
      // transition('* <=> *') 
      transition('* <=> *',[
        animate(1000)
      ]),
    ]),

    trigger('locationInput',[
       state("*", style({
        transform:"translateX(0px) translateY(0px)",
        height:'38px'
      })),
      transition("void => *",[
        //Aukstis 0 , atvaizduojamas uz ekrano ribu
        style({
          height:'0px',
          transform:"translateX(-2000px) translateY(300px)"
        }),
        //Ispleciame laisva vieta is auksccio
        animate(500, style({
          height:'38px',
          transform:"translateX(-2000px) translateY(300px)"
        })),
        //Ivaziuojame i tinkama vieta
        animate(1000)
      ]),
      transition("* => void",[
        //aukstis 0 , atvaizduojamas uz ekrano ribu
        
        animate(1000, style({
          height:'38px',
          transform:"translateX(2000px) translateY(300px)"
        })),
        //Ivaziuojame u tinkama vieta
        animate(500, style({
          height:'0px',
          transform:"translateX(2000px) translateY(300px)"
        }) 
        )
      ])
    ])
  ]
})
export class NewItemComponent {
  public itemForm:FormGroup;
  public employees:Employee[]=[];
  public lastNumber:number=0;

  public captionState='normal';


  constructor(private itemsService:ItemsService, private employeesService:EmployeesService){
    this.itemForm = new FormGroup({
      // 'inv_number':new FormControl('1555'),
      //'inv_number':new FormControl(null, [Validators.required, Validators.minLength(3), this.validateInvNumber]),
      'inv_number': new FormControl(this.lastNumber, 
        {
          validators:[
            Validators.required
          ],
          asyncValidators:[
            ItemsService.createUniqueInvNumberValidator(itemsService)
          ]
        }),
      'name':new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'type':new FormControl(null),
      'responsible_employee_id':new FormControl(null, Validators.required),
      // Masyvas is HTML input elementu 
      'locations':new FormArray([
        new FormControl(null, Validators.required)
      ]),
    });

  (this.itemForm.get('name') as FormControl)

    this.employeesService.loadEmployees().subscribe((data)=>{
      this.employees=data;
    })
  }

   private resetForm(){
    this.itemsService.getLastInvNumber().subscribe((n)=>{
      this.lastNumber=n;
      (this.itemForm.get('inv_number') as FormControl).setValue(n);
    });
  }

  onSubmit(){
    console.log(this.itemForm.value);
    this.itemsService.addItem(this.itemForm.value).subscribe(()=>{
      this.itemForm.reset();
      (this.itemForm.get('locations') as FormArray).controls=[
        new FormControl(null, Validators.required)
      ]
      this.resetForm();
    })
  }

  validateInvNumber(control:FormControl):ValidationErrors | null {
    let value = control.value;
    let pattern = /^[A-Z]{3}[0-9]{5}$/;
    if(pattern.test(value)){
      return null;
    } 
      return {error: 'Klaida'};
    
  }


   static createUniqueInvNumberValidator(itemsService:ItemsService){
    return (control:FormControl):Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=>{
   
      return  itemsService.loadItems().pipe(map((data)=> null));
    };

  }

  // Paiimti laukeliu location masyve esancius inputus kaip masyva 
  get locations(){
    return (this.itemForm.get('locations') as FormArray).controls;
    // as FormArray - visados grazinti FormArray ir nereikia tikrinti ar yra null reiksme
  }

  // Prideti naujam laukeliui
  public addLocationField() {
    // Sukuriamas naujas laukelis 
    const field = new FormControl(null, Validators.required);
    // Laukelis ikeliamas i lauku masyva
    (this.itemForm.get('locations') as FormArray).push(field);
  }

  public removeLocationField(){
    (this.itemForm.get('locations') as FormArray).removeAt(-1);
  }

  public captionClick(){
    switch (this.captionState) {
      case 'normal':
        this.captionState='clicked1';
        break;
      case 'clicked1':
        this.captionState='clicked2';
        break;
      case 'clicked2':
        this.captionState='normal';
        break;  
    }
    // this.captionState = (this.captionState == 'normal') ? 'clicked' : 'normal';
  }

}

/* static - galima nekurti objekto, galima tiesiog iskviesti metoda,
galima tiesiog klases pavadinima panaudoti, pvz:

public static suma(x:number,y:number){
  return x + y;
}

console.log(NewItemComponent.suma(5,8))



*/