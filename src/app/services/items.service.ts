import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable, map } from 'rxjs';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http:HttpClient) { 

  }
  public addItem(item:Item){
    return this.http.post('https://registracija-d4ccd-default-rtdb.europe-west1.firebasedatabase.app/items.json',item);
  }

   public loadItems(){
    return this.http.get<{[key:string]:Item}>('https://registracija-d4ccd-default-rtdb.europe-west1.firebasedatabase.app/items.json')
    .pipe(
      map((data):Item[]=>{
        let emp:Item[]=[];
        for(let e in data){
          emp.push({...data[e], id:e});
        }
        return emp;
      })
    )
  }

  public static createUniqueInvNumberValidator(itemsService:ItemsService):AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return itemsService.loadItems().pipe(
        map((data)=> {
          let error = false;
          // patikrinimas ar Inventorizacijos numeris nesikartoja paiimant is duomenu bazes, 
          // jei kartojasi tai neleidzia prideti to pacio numerio
          data.forEach((v,k)=>{
            if(control.value == v.inv_number){
              error = true;
            }
          })
            if(error){
              return {'error':'Toks numeris jau egzistuoja'};
            } else {
              return null;
            }
        })
      );
    }
  }

  public getLastInvNumber():Observable<number>{
  return this.loadItems().pipe(
    map((data)=>{
      let n=0;
      data.forEach(v=>{
        if (v.inv_number!=null && v.inv_number>n) n=v.inv_number;
      });
      return Number(n)+1;

    })
  );
 }

}
