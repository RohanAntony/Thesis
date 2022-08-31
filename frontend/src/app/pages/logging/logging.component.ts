import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LoggingService } from 'src/app/services/logging.service';
import { Log } from 'src/app/shared/types/Log';
import { LogDataSource } from './logging.datasource';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {

  displayedColumns = ['timestamp', 'process', 'log'];
  // sampleData: Log[] = [
  // ];
  // @ViewChild(MatTable, { static: true}) table: MatTable<any> | undefined;
  dataSource: LogDataSource;

  constructor(
    private loggingService: LoggingService,
  ) {
    this.dataSource = new LogDataSource(this.loggingService);
  }

  ngOnInit(): void {
    this.dataSource = new LogDataSource(this.loggingService);
    this.dataSource.loadLogs();
  }

}
