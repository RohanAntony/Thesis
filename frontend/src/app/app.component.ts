import { Component } from '@angular/core';
import { SideNavType } from 'src/types/SideNav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  tabList = [SideNavType.DASHBOARD, SideNavType.SETUP, SideNavType.LOGS];
  selected : SideNavType = SideNavType.DASHBOARD;

  public selectTab(tab: SideNavType) {
    this.selected = tab;
  }

}
