import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  formArray: FormArray;
  filteredOptions: Observable<IFoodNutritionalValue[]>;
  savedReceip: IFoodNutritionalValue | null;

  constructor(
    private _formBuilder: FormBuilder,
    private foodNutritionalValueService: FoodNutritionalValueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.nameFormGroup = this._formBuilder.group({
      nameCtrl: ['', [Validators.required, Validators.minLength(3), this.forbiddenReceipNameValidator()]],
    });

    this.formArray = this._formBuilder.array([], Validators.required);

    this.secondFormGroup = this._formBuilder.group({
      inputControl: this.inputControl,
      formArray: this.formArray,
    });

    this.thirdFormGroup = this._formBuilder.group({
      resultedQuantity: ['', [Validators.required, Validators.pattern('[0-9]*')]],
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

  createForm(): FormControl {
    const formControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    this.formArray.push(formControl);
    return formControl;
  }

  addIngredientToList(event: MatAutocompleteSelectedEvent): void {
    const ingredientName: string = event.option.value;
    const searchResult: IFoodNutritionalValue[] = this.availableIngredients.filter(value => value.name === ingredientName);
    if (searchResult.length > 0) {
      const ingredient = searchResult[0];
      const alreadyInserted = this.insertedIngredients.data.filter(x => x.name === ingredientName).length > 0;
      if (!alreadyInserted) {
        this.insertedIngredients.data.push({ ...ingredient, form: this.createForm() });
        this.availableIngredients = this.availableIngredients.filter(x => x !== ingredient);
        this.insertedIngredients._updateChangeSubscription();
      }
    }
    this.inputControl.setValue('');
  }

  forbiddenReceipNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newIngredientNameLowerCase = control.value.toLocaleLowerCase();
      return this.availableIngredients
        .map(ingredient => ingredient.name)
        .map(ingredientName => ingredientName?.toLocaleLowerCase())
        .find(ingredientName => ingredientName === newIngredientNameLowerCase)
        ? { receipeNameAlreadyTake: { value: control.value } }
        : null;
    };
  }

  saveReceipe(): void {
    this.dialog.open(LoadingSpinnerComponent, { panelClass: 'transparent-panel' });
    const req: any = {
      name: this.nameFormGroup.value.nameCtrl,
      resulted: this.thirdFormGroup.value.resultedQuantity,
      ingredientList: this.insertedIngredients.data.map(x => ({
        id: x.id,
        weight: x.form.value,
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
