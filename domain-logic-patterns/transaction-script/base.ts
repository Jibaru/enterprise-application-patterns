namespace TransactionScriptStructure {
  abstract class TransactionScript<T> {
    public abstract run(): T;
  }

  class FirstTransactionScript extends TransactionScript<number> {
    constructor(private aParameter: number) {
      super();
    }

    public run(): number {
      // Do some business logic
      return this.aParameter + 1;
    }
  }

  class SecondTransactionScript extends TransactionScript<void> {
    constructor() {
      super();
    }

    public run(): void {
      // Do some business logic
    }
  }

  class Main {
    public static exec(): void {
      const ts1 = new FirstTransactionScript(10);
      const ts2 = new SecondTransactionScript();

      const result = ts1.run();
      ts2.run();
    }
  }

  Main.exec();
}
