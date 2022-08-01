import { NgModule } from '@angular/core';
import { MatButtonModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

const material = [
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
]

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
