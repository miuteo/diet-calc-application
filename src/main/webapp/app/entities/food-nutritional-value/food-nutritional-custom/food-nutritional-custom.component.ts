import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { IFoodNutritionalValue } from '../food-nutritional-value.model';
import { MatDialog } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../../core/util/loading-spinner/loading-spinner.component';

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
  okResponse = false;
  insertedIngredients: MatTableDataSource<any> = new MatTableDataSource<any>();
  availableIngredients: IFoodNutritionalValue[] = [];
  displayedColumns: string[] = ['name', 'weight'];

  inputControl = new FormControl();
  filteredOptions: Observable<IFoodNutritionalValue[]>;
  savedReceip: IFoodNutritionalValue | null;

  constructor(
    private _formBuilder: FormBuilder,
    private foodNutritionalValueService: FoodNutritionalValueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.nameFormGroup = this._formBuilder.group({
      nameCtrl: ['', [Validators.required, Validators.minLength(3)]],
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
    this.dialog.open(LoadingSpinnerComponent, { panelClass: 'transparent-panel' });
    const req: any = {
      name: this.nameFormGroup.value.nameCtrl,
      resulted: this.thirdFormGroup.value.resultedQuantity,
      ingredientList: this.insertedIngredients.data.map(x => ({
        id: x.id,
        weight: x.form.controls.weight.value,
      })),
    };
    this.foodNutritionalValueService.createCustomReceipe(req).subscribe(
      response => {
        if (response.ok) {
          this.okResponse = true;
          this.savedReceip = response.body;
          this.isEditable = false;
        }
      },
      error => this.dialog.closeAll(),
      () => this.dialog.closeAll()
    );
  }
}
