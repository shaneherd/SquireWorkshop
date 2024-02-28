export class ListObject {
  id = '0';
  name = '';
  description = '';
  sid = 0;
  author = false;

  constructor(id: string = '0', name: string = '', sid: number = 0, author: boolean = false) {
    this.id = id;
    this.name = name;
    this.sid = sid;
    this.author = author;
  }
}
