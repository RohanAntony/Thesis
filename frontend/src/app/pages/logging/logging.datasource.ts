import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { LoggingService } from "src/app/services/logging.service";
import { Log } from "src/app/shared/types/Log";

export class LogDataSource implements DataSource<Log> {

  private logSubject = new BehaviorSubject<Log[]>([]);

  constructor(private loggingService: LoggingService) {}

  connect(collectionViewer: CollectionViewer): Observable<readonly Log[]> {
    console.log('Connect called');
    return this.logSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log('Disconnect called');
    this.logSubject.complete();
  }

  loadLogs() {
    console.log('Load Logs called');
    this.loggingService.getLogs().subscribe(data => {
      return this.logSubject.next(data.data)
    });
  }

}
