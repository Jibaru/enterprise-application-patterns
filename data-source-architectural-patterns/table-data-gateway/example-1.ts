namespace TableDataGatewayExample1 {
  interface PersonRow {
    id: number;
    first_name: string;
    last_name: string;
    number_of_dependents: number;
  }

  class ResultSet {
    constructor(public readonly data: PersonRow[]) {}
  }

  abstract class PreparedStatement {
    constructor(protected sql: string, protected db: Database) {}
    public abstract setArg(index: number, attribute: any): void;
    public abstract get(): ResultSet;
    public abstract execute(): void;
  }

  abstract class Database {
    public abstract prepare(sql: string): PreparedStatement;
    public abstract lastId(): number;
    public abstract nextId(): number;
    public abstract getData(): PersonRow[];
    public abstract setData(data: PersonRow[]): void;
  }

  class PersonGateway {
    constructor(private db: Database) {}

    public findAll(): ResultSet {
      return new ResultSet(this.db.getData());
    }

    public findRow(key: number): ResultSet {
      const sql = "SELECT * FROM person WHERE id = ?";
      const stmt = this.db.prepare(sql);
      stmt.setArg(1, key);

      return stmt.get();
    }

    public findByLastName(lastName: string): ResultSet {
      const sql = "SELECT * FROM people WHERE last_name LIKE ?";
      const stmt = this.db.prepare(sql);
      stmt.setArg(1, lastName);

      return stmt.get();
    }

    public insert(
      firstName: string,
      lastName: string,
      numberOfDependents: number
    ): number {
      const sql =
        "INSERT INTO people (first_name, last_name, number_of_dependets) VALUES (?, ?, ?)";
      const stmt = this.db.prepare(sql);
      stmt.setArg(1, firstName);
      stmt.setArg(2, lastName);
      stmt.setArg(3, numberOfDependents);

      stmt.execute();

      return this.db.lastId();
    }

    public update(
      key: number,
      firstName: string,
      lastName: string,
      numberOfDependents: number
    ): void {
      const sql =
        "UPDATE people SET first_name = ?, last_name = ?, number_of_dependents = ? WHERE id = ?";
      const stmt = this.db.prepare(sql);
      stmt.setArg(1, firstName);
      stmt.setArg(2, lastName);
      stmt.setArg(3, numberOfDependents);
      stmt.setArg(4, key);

      stmt.execute();
    }

    public delete(key: number): void {
      const sql = "DELETE FROM people WHERE id = ?";
      const stmt = this.db.prepare(sql);
      stmt.setArg(1, key);

      stmt.execute();
    }
  }

  class Main {
    public static exec(): void {
      const personGateway = new PersonGateway(
        new (class extends Database {
          private currentId: number;
          private data: PersonRow[];

          constructor(data: PersonRow[]) {
            super();
            this.data = data;
            this.currentId = Math.max(...data.map((element) => element.id));
          }

          public prepare(sql: string): PreparedStatement {
            return new (class extends PreparedStatement {
              private args: Map<number, any>;
              constructor(sql: string, database: Database) {
                super(sql, database);
                this.args = new Map();
              }

              public setArg(index: number, attribute: any): void {
                this.args.set(index, attribute);
              }

              public get(): ResultSet {
                return new ResultSet(
                  this.db.getData().filter((data) => {
                    return data.id == this.args.get(1);
                  })
                );
              }

              public execute(): void {
                if (this.shouldDelete()) {
                  const newData = this.db.getData().filter((data) => {
                    return data["id"] !== this.args.get(1);
                  });

                  this.db.setData(newData);
                } else if (this.shouldInsert()) {
                  const newData = this.db.getData();
                  newData.push({
                    id: this.db.nextId(),
                    first_name: this.args.get(1),
                    last_name: this.args.get(2),
                    number_of_dependents: this.args.get(3),
                  });
                  this.db.setData(newData);
                } else if (this.shouldUpdate()) {
                  const element = this.db.getData().find((data) => {
                    return data.id === this.args.get(4);
                  });

                  if (!element) {
                    return;
                  }

                  element.first_name = this.args.get(1);
                  element.last_name = this.args.get(2);
                  element.number_of_dependents = this.args.get(3);
                }
              }

              private shouldDelete(): boolean {
                return this.args.size === 1;
              }

              private shouldInsert(): boolean {
                return this.args.size === 3;
              }

              private shouldUpdate(): boolean {
                return this.args.size === 4;
              }
            })(sql, this);
          }
          public lastId(): number {
            return this.currentId;
          }

          public nextId(): number {
            this.currentId++;
            return this.currentId;
          }

          public getData(): PersonRow[] {
            return this.data;
          }

          public setData(data: PersonRow[]): void {
            this.data = data;
          }
        })([
          {
            id: 1,
            first_name: "Ignacio",
            last_name: "Rueda",
            number_of_dependents: 12,
          },
        ])
      );

      console.log("Initial DB State");
      console.log(personGateway.findAll());

      const id = personGateway.insert("Pedro", "Suarez", 100);
      console.log("After insert, find inserted");
      console.log(personGateway.findRow(id));

      personGateway.update(id, "Maria", "Torres", 11);
      console.log("After update, find updated");
      console.log(personGateway.findRow(id));

      personGateway.delete(id);
      console.log("After delete, find deleted");
      console.log(personGateway.findRow(id));
    }
  }

  Main.exec();
}
