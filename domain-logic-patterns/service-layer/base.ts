namespace ServiceLayerBase {
  class ApplicationService {}

  class SpecificApplicationService extends ApplicationService {
    public someUseCase(): void {
      // ...
    }

    public anotherUseCase(aParameter: string): string {
      // ...

      return "some value";
    }
  }
}
