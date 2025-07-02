export class DatasetIdx {
  constructor(public readonly graphName: string, public readonly idx: number) {}

  toString(): string {
    return `${this.graphName}:${this.idx}`;
  }
}
