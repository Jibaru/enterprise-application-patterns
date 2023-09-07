namespace DomainModelBase {
  class ADomainModel {
    constructor(
      private firstAttribute: string,
      private secondAttribute: number
    ) {}

    public domainLogicMethod(aParameter: string): void {
      this.firstAttribute += aParameter;
    }

    public anotherDomainLogicMethod(aParameter: number): number {
      return this.secondAttribute + aParameter;
    }
  }

  class AnotherDomainModel {
    constructor(private reference: ADomainModel) {}

    public importantDomainLogicMethod(): void {
      this.reference.domainLogicMethod("something");
    }
  }
}
