import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/enums/URL';
import { Macroeconomic, MacroeconomicType } from '../shared/types/Macroeconomic';

@Injectable({
  providedIn: 'root'
})
export class MacroeconomicService {
  constructor(private http: HttpClient) { }

  getValuesForType(type: MacroeconomicType) {
    this.http.get<Macroeconomic[]>(URLs.MACROECONOMIC + `/${type}`).subscribe((data) => console.log(data));
  }

  setValuesForType(mValue: Macroeconomic) {
    this.http.post(URLs.MACROECONOMIC, mValue).subscribe((data) => console.log(data));
  }
}
