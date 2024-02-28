export class MenuItem {
  id: string;
  name: string;
  outlet: string;
  url: string;
  selected = false;
  disabled = false;
  icon = '';

  constructor(id: string, name: string, outlet: string = '', url: string = '', disabled: boolean = false) {
    this.id = id;
    this.name = name;
    this.outlet = outlet;
    this.url = url;
    this.disabled = disabled;
  }
}
