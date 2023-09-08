namespace TableModuleExample1 {
  interface TableRow {
    id: number;
  }

  interface ContractRow extends TableRow {
    id: number;
    amount: number;
  }

  interface RevenueRecognitionRow extends TableRow {
    id: number;
    contractId: number;
    amount: number;
    date: Date;
  }

  class DataTable<T extends TableRow> {
    constructor(public data: T[]) {}

    public getRow(id: number): T | null {
      for (const row of this.data) {
        if (row.id === id) {
          return row;
        }
      }

      return null;
    }
  }

  class DataSet {
    constructor(
      public contractsTable: DataTable<ContractRow>,
      public revenueRecognitionsTable: DataTable<RevenueRecognitionRow>
    ) {}
  }

  class RevenueRecognition {
    private dataset: DataSet;
    private table: DataTable<RevenueRecognitionRow>;

    constructor(dataset: DataSet) {
      this.dataset = dataset;
      this.table = dataset.revenueRecognitionsTable;
    }

    public calculateAmountWhere(contractId: number, asOf: Date): number {
      let amount = 0;

      for (const row of this.table.data) {
        if (row.contractId == contractId && row.date <= asOf) {
          amount += row.amount;
        }
      }

      return amount;
    }
  }

  class Contract {
    private dataset: DataSet;
    private table: DataTable<ContractRow>;

    constructor(dataset: DataSet) {
      this.dataset = dataset;
      this.table = dataset.contractsTable;
    }

    public revenueRecognition(contractId: number, asOf: Date): number {
      const contractRow = this.table.getRow(contractId);
      if (contractRow === null) {
        return 0;
      }

      const amount = contractRow.amount;
      const revenueRecognition = new RevenueRecognition(this.dataset);

      return amount + revenueRecognition.calculateAmountWhere(contractId, asOf);
    }
  }

  class Main {
    public static exec(): void {
      const contract = new Contract(
        new DataSet(
          new DataTable<ContractRow>([
            {
              id: 190,
              amount: 1902.23,
            },
            {
              id: 191,
              amount: 202.01,
            },
          ]),
          new DataTable<RevenueRecognitionRow>([
            {
              contractId: 190,
              id: 100,
              amount: 900.12,
              date: new Date("2023-09-08T00:00:00.000Z"),
            },
            {
              contractId: 191,
              id: 101,
              amount: 200.12,
              date: new Date("2023-09-02T00:00:00.000Z"),
            },
            {
              contractId: 190,
              id: 102,
              amount: 40,
              date: new Date("2023-09-03T00:00:00.000Z"),
            },
          ])
        )
      );

      console.log(
        "Revenue recognition:",
        contract.revenueRecognition(190, new Date("2023-09-04T00:00:00.000Z"))
      );
    }
  }

  Main.exec();
}
