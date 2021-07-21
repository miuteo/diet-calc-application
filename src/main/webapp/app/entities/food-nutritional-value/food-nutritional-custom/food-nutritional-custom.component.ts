import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

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
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2: any;
  displayedColumns: string[] = ['name', 'weight'];

  x: AbstractControl;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.nameFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
      aliases: this._formBuilder.array([this._formBuilder.control('')]),
    });
    this.dataSource2 = ELEMENT_DATA.map(x => ({ ...x, form: this.createForm(x) }));
  }

  get aliases(): FormArray {
    return this.secondFormGroup.get('aliases') as FormArray;
  }

  addAlias(): void {
    this.aliases.push(this._formBuilder.control(''));
  }

  createForm(data: PeriodicElement): FormGroup {
    return new FormGroup(
      {
        name: new FormControl(data.name),
        weight: new FormControl(data.weight),
        symbol: new FormControl(data.symbol),
        position: new FormControl(data.position),
      },
      Validators.required
    );
  }
}
