namespace ServiceLayerExample1 {
  class Contract {
    constructor(
      private contractNumber: number,
      private administratorEmailAddress: string
    ) {}

    public static readForUpdate(contractNumber: number): Contract {
      return new Contract(contractNumber, "admin@email.com");
    }

    public calculateRecognitions(): void {
      console.log("Calculating recognitions...");
    }

    public getAdministratorEmailAddress(): string {
      return this.administratorEmailAddress;
    }
  }

  interface EmailGateway {
    sendEmailMessage(toAddress: string, subject: string, body: string): void;
  }

  interface IntegrationGateway {
    publishRevenueRecognitionCalculation(contract: Contract): void;
  }

  class ApplicationService {
    constructor(
      private emailGateway: EmailGateway,
      private integrationGatewat: IntegrationGateway
    ) {}

    protected getEmailGateway(): EmailGateway {
      return this.emailGateway;
    }

    protected getIntegrationGateway(): IntegrationGateway {
      return this.integrationGatewat;
    }
  }

  class RecognitionService extends ApplicationService {
    public calculateRevenueRecognitions(contractNumber: number): void {
      const contract = Contract.readForUpdate(contractNumber);
      contract.calculateRecognitions();
      this.getEmailGateway().sendEmailMessage(
        contract.getAdministratorEmailAddress(),
        "RE: Contract #" + contractNumber.toString(),
        `Contract ${contractNumber} has had revenue recognitions calculated.`
      );
      this.getIntegrationGateway().publishRevenueRecognitionCalculation(
        contract
      );
    }
  }

  class Main {
    public static exec(): void {
      const service = new RecognitionService(
        new (class implements EmailGateway {
          sendEmailMessage(
            toAddress: string,
            subject: string,
            body: string
          ): void {
            console.log(
              `Email sended: [${subject}], for ${toAddress}. Content: ${body}`
            );
          }
        })(),
        new (class implements IntegrationGateway {
          publishRevenueRecognitionCalculation(contract: Contract): void {
            console.log(
              `Revenue recognition calculation published for ${contract}`
            );
          }
        })()
      );

      service.calculateRevenueRecognitions(1056);
    }
  }
}
