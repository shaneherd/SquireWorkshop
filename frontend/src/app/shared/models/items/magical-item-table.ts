export class MagicalItemTable {
  id = '0';
  name = '';
  columns: string[] = [];
  rows: MagicalItemTableRow[] = [];
}

export class MagicalItemTableRow {
  values: string[] = [];
}
