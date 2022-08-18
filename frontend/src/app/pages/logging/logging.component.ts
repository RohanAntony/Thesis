import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {

  displayedColumns = ['time', 'message'];
  sampleData = [
    {time: new Date(), message: 'Test'},
    {time: new Date(), message: 'Test1'},
    {time: new Date(), message: 'Test2'},
    {time: new Date(), message: 'Test3'},
    {time: new Date(), message: 'Test4'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
