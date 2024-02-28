import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

export interface ExportDetailsService {
  export: (id: string, proExport: boolean) => Promise<object>;
  processObject: (object: Object, proExport: boolean) => Promise<object>;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private http: HttpClient
  ) { }

  async writeExportFile(objects: object[], filename: string, proExport: boolean): Promise<void> {
    if (objects.length === 0) {
      return;
    }

    const maxObjectsCount = 1500;
    for (let i = 0; i < objects.length; i += maxObjectsCount) {
      const singleFileObjects = objects.slice(i, i + maxObjectsCount);
      await this.writeFile(singleFileObjects, filename, proExport);
    }
  }

  private async writeFile(objects: object[], filename: string, proExport: boolean): Promise<void> {
    const json = {
      'dbVersion': 0,
      'objects': []
    }
    objects.forEach((obj: Object) => {
      json['objects'].push(obj);
    });
    let jsonString = JSON.stringify(json, null, 2);
    jsonString = jsonString.replace(/JSON_TYPE/g, 'type');
    const sum = await this.generateCheckSum(jsonString, proExport);
    const key = `#key=${sum}`;
    const content = jsonString + '\n' + key;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async generateCheckSum(json: string, proExport: boolean): Promise<string> {
    const temp = json.replace(/\s/g, ''); // strip all spaces and new lines
    const key = this.hashCode(temp);
    const options = {
      responseType: 'text' as 'json'
    };
    return await this.http.get<string>(`${environment.backendUrl}/android/checksum?key=${key}&pro=${proExport}`, options).toPromise().then((checksum: string) => {
      return checksum;
    });
  }

  private hashCode(value: string): number {
    let hash = 0;
    let i;
    let chr;
    if (value.length === 0) {
      return hash;
    }
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
