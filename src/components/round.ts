export class Round {
  id: string;
  name: string;
  total_votes: number;

  constructor(id: string, name: string, total_votes: number = undefined) {
    this.id = id;
    this.name = name;
    this.total_votes = total_votes;
  }
}
