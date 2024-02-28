import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {Skill} from '../../../shared/models/attributes/skill';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {HttpClient} from '@angular/common/http';
import {Filters} from '../../components/filters/filters';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SkillService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private skills: ListObject[] = [];
  private publicSkills: ListObject[] = [];
  private privateSkills: ListObject[] = [];
  private skillsDetailed: Skill[] = [];

  constructor(
    private attributeService: AttributeService,
    private http: HttpClient
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.skills = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSkills = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSkills = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.skills;
      case ListSource.PUBLIC_CONTENT:
        return this.publicSkills;
      case ListSource.PRIVATE_CONTENT:
        return this.privateSkills;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.skills = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSkills = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSkills = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.skillsDetailed = [];
    this.getSkills(listSource).then((skills: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      skills.forEach((skill: ListObject) => {
        menuItems.push(new MenuItem(skill.id, skill.name, '', '', false));
      });
      this.items = menuItems;

      if (id != null) {
        for (let i = 0; i < this.items.length; i++) {
          const menuItem = this.items[i];
          menuItem.selected = menuItem.id === id;
        }
      }
      this.menuItems.next(this.items);
    });
  }

  createSkill(skill: Skill): Promise<string> {
    skill.attributeType = AttributeType.SKILL;
    return this.attributeService.createAttribute(skill);
  }

  getSkills(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getSkills(listSource).then((skills: ListObject[]) => {
      this.updateCache(skills, listSource);
      return skills;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getSkills(listSource);
  }

  getSkillsDetailed(): Promise<Skill[]> {
    const listSource = ListSource.MY_STUFF;
    if (this.skillsDetailed.length > 0) {
      return Promise.resolve(this.skillsDetailed);
    }
    return this.http.get<Skill[]>(`${environment.backendUrl}/attributes/type/${AttributeType.SKILL}/detailed?source=${listSource}`)
      .toPromise().then((skills: Skill[]) => {
        this.skillsDetailed = skills;
        return skills;
      });
  }

  getSkill(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateSkill(skill: Skill): Promise<any> {
    return this.attributeService.updateAttribute(skill);
  }

  deleteSkill(skill: Skill): Promise<any> {
    return this.attributeService.deleteAttribute(skill);
  }

  duplicateSkill(skill: Skill, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(skill, name);
  }
}
