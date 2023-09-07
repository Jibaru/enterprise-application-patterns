namespace TransactionScriptExample1 {
  class Money {
    constructor(private value: number) {}

    public static dollars(amount: number): Money {
      return new Money(amount);
    }

    public add(other: Money): Money {
      return new Money(other.value + this.value);
    }

    public toString(): string {
      return this.value.toString();
    }
  }

  class ResultSet<T> {
    private index: number;

    constructor(private data: T[]) {
      this.index = 0;
    }

    public next(): boolean {
      this.index++;

      return this.index < this.data.length;
    }

    public getBigDecimal(field: string): number {
      return this.data[this.index][field];
    }
  }

  interface RevenueRecognition {
    contract: number;
    amount: number;
    recognizedOn: Date;
  }

  class Gateway {
    constructor(private revenueRecognitions: RevenueRecognition[]) {}

    public findRecognitionsFor(
      contractId: number,
      asOf: Date
    ): ResultSet<RevenueRecognition> {
      const filteredData = this.revenueRecognitions.filter(
        (revenueRecognition) => {
          return (
            revenueRecognition.contract === contractId &&
            revenueRecognition.recognizedOn <= asOf
          );
        }
      );

      return new ResultSet<RevenueRecognition>(filteredData);
    }
  }

  class RecognitionService {
    constructor(private db: Gateway) {}

    public recognizedRevenue(contractNumber: number, asOf: Date): Money {
      let result = Money.dollars(0);
      try {
        const resultSet = this.db.findRecognitionsFor(contractNumber, asOf);

        while (resultSet.next()) {
          result = result.add(Money.dollars(resultSet.getBigDecimal("amount")));
        }

        return result;
      } catch (error: any) {
        throw new Error("can not do this operation");
      }
    }
  }

  class Main {
    public static exec(): void {
      const transactionScript = new RecognitionService(
        new Gateway([
          {
            contract: 1920,
            amount: 190.23,
            recognizedOn: new Date("2023-09-08T09:00:01.000Z"),
          },
          {
            contract: 1920,
            amount: 291.23,
            recognizedOn: new Date("2021-09-08T09:00:01.000Z"),
          },
        ])
      );

      const amount = transactionScript.recognizedRevenue(
        1920,
        new Date("2024-09-08T09:00:01.000Z")
      );

      console.log("Transaction Script Recognized Revenue:", amount);
    }
  }

  Main.exec();
}
