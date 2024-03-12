import { Member } from "./member";

export class Track {
  id: string;
  name: string;
  picture: string;
  submitter: Member;

  constructor(id: string, name: string, picture: string, submitter: Member = undefined) {
    this.id = id;
    this.name = name;
    this.picture = picture;
    this.submitter = submitter;
  }
}
