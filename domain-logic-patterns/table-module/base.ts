namespace TableModuleBase {
  interface TableRow {
    id: number;
  }

  interface ExampleRow extends TableRow {
    id: number;
    field: string;
  }

  interface AnotherRow extends TableRow {
    id: number;
    field: number;
  }

  class DataTable<T extends TableRow> {
    constructor(public data: T[]) {}
  }

  class DataSet {
    constructor(
      public aTable: DataTable<ExampleRow>,
      public anotherTable: DataTable<AnotherRow>
    ) {}
  }

  class TableModule {
    private table: DataTable<ExampleRow>;

    constructor(public dataset: DataSet) {
      this.table = dataset.aTable;
    }

    public someBussinessOperation(aParameter: string): void {
      // Do some bussiness logic
    }
  }
}
