import { Component, OnInit, ViewChild } from '@angular/core';
import { Macroeconomic, MacroeconomicType } from 'src/app/shared/types/Macroeconomic';
import { MacroeconomicService } from '../macroeconomic.service';

@Component({
  selector: 'app-view-macroeconomic',
  templateUrl: './view-macroeconomic.component.html',
  styleUrls: ['./view-macroeconomic.component.scss']
})
export class ViewMacroeconomicComponent implements OnInit {

  @ViewChild('chart') chartComponent: any;

  public inflationValues: Macroeconomic[] = [];
  public gdp: Macroeconomic[] = [];
  public unemployment: Macroeconomic[] = [];

  constructor(private macroeconomicService: MacroeconomicService) { }

  ngOnInit(): void {
    this.macroeconomicService.getValuesForType(MacroeconomicType.INFLATION).subscribe(
      (data:any) => this.inflationValues.push(...data.data));
    this.macroeconomicService.getValuesForType(MacroeconomicType.GDP).subscribe(
      (data:any) => this.gdp.push(...data.data));
    this.macroeconomicService.getValuesForType(MacroeconomicType.UNEMPLOYMENT).subscribe(
      (data:any) => this.unemployment.push(...data.data));
  }

}
