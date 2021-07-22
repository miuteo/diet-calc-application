import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'jhi-food-nutritional-custom',
  templateUrl: './food-nutritional-custom.component.html',
  styleUrls: ['./food-nutritional-custom.component.scss'],
})
export class FoodNutritionalCustomComponent implements OnInit {
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = true;
  insertedIngredients: MatTableDataSource<any> = new MatTableDataSource<any>();
  availableIngredients: PeriodicElement[] = [...ELEMENT_DATA];
  displayedColumns: string[] = ['name', 'weight'];

  inputControl = new FormControl();
  filteredOptions: Observable<PeriodicElement[]>;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.nameFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  _filter(value: string): PeriodicElement[] {
    const filterValue = value.toLowerCase();
    return this.availableIngredients.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  createForm(data: PeriodicElement): FormGroup {
    return new FormGroup(
      {
        name: new FormControl(data.name),
        weight: new FormControl(''),
        symbol: new FormControl(data.symbol),
        position: new FormControl(data.position),
      },
      Validators.required
    );
  }

  addIngredientToList(event: MatAutocompleteSelectedEvent): void {
    const ingredientName: string = event.option.value;
    const searchResult: PeriodicElement[] = this.availableIngredients.filter(value => value.name === ingredientName);
    if (searchResult.length > 0) {
      const ingredient = searchResult[0];
      const alreadyInserted = this.insertedIngredients.data.filter(x => x.name === ingredientName).length > 0;
      if (!alreadyInserted) {
        this.insertedIngredients.data.push({ ...ingredient, form: this.createForm(ingredient) });
        this.availableIngredients = this.availableIngredients.filter(x => x !== ingredient);
        this.insertedIngredients._updateChangeSubscription();
      }
    }
    this.inputControl.setValue('');
  }
}
