export interface CreatedResponse {
  created: boolean,
  count: number,
}

export interface UpdatedResponse {
  updated: boolean,
  count: number,
}

export interface ModifiedResponse {
  modified: boolean,
  count: number,
}

export interface DeletedResponse {
  deleted: boolean,
  count: number,
}

export interface LastDateResponse {
  last: number | Date,
}