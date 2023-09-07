namespace DomainModelExample1 {
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

  class RevenueRecognition {
    constructor(private amount: Money, private date: Date) {}

    public getAmount(): Money {
      return this.amount;
    }

    public isRecognizableBy(asOf: Date) {
      return this.date <= asOf;
    }
  }

  class Contract {
    constructor(private revenueRecognitions: RevenueRecognition[]) {}

    public recognizedRevenue(asOf: Date): Money {
      let result = Money.dollars(0);

      for (const revenueRecognition of this.revenueRecognitions) {
        if (revenueRecognition.isRecognizableBy(asOf)) {
          result = result.add(revenueRecognition.getAmount());
        }
      }

      return result;
    }
  }

  class Main {
    public static exec(): void {
      const contract = new Contract([
        new RevenueRecognition(
          Money.dollars(150.25),
          new Date("2023-07-09T08:09:00.000Z")
        ),
        new RevenueRecognition(
          Money.dollars(300.1),
          new Date("2023-06-09T08:09:00.000Z")
        ),
        new RevenueRecognition(
          Money.dollars(17.8),
          new Date("2023-05-09T08:09:00.000Z")
        ),
      ]);

      console.log(
        contract.recognizedRevenue(new Date("2023-06-01T08:09:00.000Z"))
      );
    }
  }

  Main.exec();
}
