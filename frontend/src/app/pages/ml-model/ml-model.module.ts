import { NgModule } from '@angular/core';
import { MlModelComponent } from './ml-model.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MlModelComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    MlModelComponent
  ]
})
export class MlModelModule { }
