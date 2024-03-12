export class Member {
  id: string;
  name: string;
  picture: string;

  constructor(id: string, name: string, picture = "") {
    this.id = id;
    this.name = name;
    this.picture = picture;
  }
}
