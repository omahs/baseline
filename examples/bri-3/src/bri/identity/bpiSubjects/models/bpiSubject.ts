import { BpiSubjectType } from './bpiSubjectType.enum';

export class BpiSubject {
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _description: string;
  private _type: BpiSubjectType;
  private _publicKey: string;

  constructor(
    id: string,
    name: string,
    description: string,
    type: BpiSubjectType,
    publicKey: string,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._type = type;
    this._publicKey = publicKey;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get type(): BpiSubjectType {
    return this._type;
  }

  public get publicKey(): string {
    return this._publicKey;
  }

  public updateName(newName: string): void {
    this._name = newName;
  }

  public updateDescription(newDescription: string): void {
    this._description = newDescription;
  }

  public updatePublicKey(newPk: string): void {
    this._publicKey = newPk;
  }
}
