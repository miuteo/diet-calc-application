import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { IFoodNutritionalValue } from '../food-nutritional-value.model';

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
  availableIngredients: IFoodNutritionalValue[] = [];
  displayedColumns: string[] = ['name', 'weight'];

  inputControl = new FormControl();
  filteredOptions: Observable<IFoodNutritionalValue[]>;
  savedReceip: IFoodNutritionalValue | null;

  constructor(private _formBuilder: FormBuilder, private foodNutritionalValueService: FoodNutritionalValueService) {}

  ngOnInit(): void {
    this.nameFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      resultedQuantity: ['', Validators.required],
    });

    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.foodNutritionalValueService.query().subscribe(value => (this.availableIngredients = value.body == null ? [] : value.body));
  }

  _filter(value: string): IFoodNutritionalValue[] {
    const filterValue = value.toLowerCase();
    return this.availableIngredients.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  createForm(data: IFoodNutritionalValue): FormGroup {
    return new FormGroup(
      {
        name: new FormControl(data.name),
        id: new FormControl(data.id),
        weight: new FormControl(''),
      },
      Validators.required
    );
  }

  addIngredientToList(event: MatAutocompleteSelectedEvent): void {
    const ingredientName: string = event.option.value;
    const searchResult: IFoodNutritionalValue[] = this.availableIngredients.filter(value => value.name === ingredientName);
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

  saveReceipe(): void {
    const req: any = {
      name: this.nameFormGroup.value.nameCtrl,
      resulted: this.thirdFormGroup.value.resultedQuantity,
      ingredientList: this.insertedIngredients.data.map(x => ({
        id: x.id,
        weight: x.form.controls.weight.value,
      })),
    };
    this.foodNutritionalValueService.createCustomReceipe(req).subscribe(x => (this.savedReceip = x.body));
  }
}
