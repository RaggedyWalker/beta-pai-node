export class Page<T> {
  public total: number;
  public pageSize: number;
  public currentPage: number;
  public list: T[];
  constructor() {
    this.total = 0;
    this.pageSize = 0;
    this.currentPage = 0;
    this.list = [];
  }
}
