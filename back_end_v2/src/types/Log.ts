export interface Log {
  timestamp: Date;
  process: string;
  log: string;
}

export interface ListLogsResponse {
  data: Log[],
}