import { Component, OnInit } from '@angular/core';
import { Macroeconomic, MacroeconomicType } from 'src/app/shared/types/Macroeconomic';
import { MacroeconomicService } from '../../../services/macroeconomic.service';

@Component({
  selector: 'app-edit-macroeconomic',
  templateUrl: './edit-macroeconomic.component.html',
  styleUrls: ['./edit-macroeconomic.component.scss']
})
export class EditMacroeconomicComponent implements OnInit {

  public defaultMacroeconomicType = MacroeconomicType.INFLATION;
  public defaultYear = new Date().getFullYear();

  public mTypeValues = [
    MacroeconomicType.INFLATION,
    MacroeconomicType.GDP,
    MacroeconomicType.UNEMPLOYMENT
  ]

  public data: Macroeconomic = {
    year: this.defaultYear,
    type: this.defaultMacroeconomicType,
    value: 0,
  };

  constructor(private macroeconomicService: MacroeconomicService) { }

  ngOnInit(): void {
  }

  modifyMacroeconomic() {
    this.macroeconomicService.setValuesForType(this.data);
  }

}
