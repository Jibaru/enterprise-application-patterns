namespace TableDataGatewayBase {
  class ATableDataGateway {
    public insert(param1: string, param2: number): number {
      // do insert
      return 0;
    }

    public update(key: string, param1: string, param2: number): void {
      // do update
    }

    public delete(key: string): void {
      // do delete
    }

    public findByKey(key: string): object {
      // find by key into database
      return {};
    }

    public findByAnything(anything: string): object[] {
      // find by anything
      return [];
    }
  }
}
