import {Injectable} from '@angular/core';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FilterSorts} from '../../../shared/models/filter-sorts';
import {ModifierType} from '../../../shared/models/modifier-type';
import {InUse} from '../../../shared/models/inUse/in-use';
import {InUseService} from '../../../dashboard/view-edit/view-edit.component';
import {environment} from '../../../../environments/environment';
import {PublishRequest} from '../../../shared/models/publish-request';
import {ListSource} from '../../../shared/models/list-source.enum';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {ManageService} from '../../../shared/components/manage-list/manage-list.component';

@Injectable({
  providedIn: 'root'
})
export class AttributeService implements InUseService, ManageService {

  constructor(
    private http: HttpClient
  ) { }

  createAttribute(attribute: Attribute): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(environment.backendUrl + '/attributes', attribute, options).toPromise();
  }

  getPublishDetails(attribute: Attribute): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/attributes/${attribute.id}/published`).toPromise();
  }

  getVersionInfo(attributeId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/attributes/${attributeId}/version`).toPromise();
  }

  publishAttribute(attribute: Attribute, publishRequest: PublishRequest): Promise<any> {
    return this.publish(attribute.id, publishRequest);
  }

  publish(id: string, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/attributes/${id}`, publishRequest).toPromise();
  }

  addToMyStuff(attribute: Attribute): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/attributes/${attribute.id}/myStuff`, attribute, options).toPromise();
  }

  getAbilities(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.ABILITY, listSource);
  }

  getArmorTypes(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.ARMOR_TYPE, listSource);
  }

  getAreaOfEffects(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.AREA_OF_EFFECT, listSource);
  }

  getCasterTypes(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.CASTER_TYPE, listSource);
  }

  getConditions(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.CONDITION, listSource);
  }

  getFilteredConditions(filterSorts: FilterSorts, listSource: ListSource): Promise<ListObject[]> {
    return this.getFilteredAttributesByAttributeType(AttributeType.CONDITION, listSource, filterSorts);
  }

  getDamageTypes(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.DAMAGE_TYPE, listSource);
  }

  getLanguages(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.LANGUAGE, listSource);
  }

  getLevels(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.LEVEL, listSource);
  }

  getSkills(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.SKILL, listSource);
  }

  getMisc(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.MISC, listSource);
  }

  getFilteredSkills(filterSorts: FilterSorts, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.getFilteredAttributesByAttributeType(AttributeType.SKILL, listSource, filterSorts);
  }

  getToolCategories(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.TOOL_CATEGORY, listSource);
  }

  getWeaponProperties(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.WEAPON_PROPERTY, listSource);
  }

  getWeaponTypes(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.WEAPON_TYPE, listSource);
  }

  getSpellSchools(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.SPELL_SCHOOL, listSource);
  }

  getAlignments(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.ALIGNMENT, listSource);
  }

  getDeityCategories(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.DEITY_CATEGORY, listSource);
  }

  getDeities(listSource: ListSource): Promise<ListObject[]> {
    return this.getAttributesByAttributeType(AttributeType.DEITY, listSource);
  }

  getFilteredAttributesByAttributeType(attributeType: AttributeType, listSource: ListSource, filterSorts: FilterSorts): Promise<ListObject[]> {
    return this.http.post<ListObject[]>(`${environment.backendUrl}/attributes/type/${attributeType}?source=${listSource}`, filterSorts).toPromise();
  }

  getAttributesByAttributeType(attributeType: AttributeType, listSource: ListSource): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/attributes/type/${attributeType}?source=${listSource}`).toPromise();
  }

  getModifierTypes(): Promise<ModifierType[]> {
    return this.http.get<ModifierType[]>(environment.backendUrl + '/attributes/modifiers').toPromise();
  }

  getAttribute(id: string): Promise<Attribute> {
    return this.http.get<Attribute>(`${environment.backendUrl}/attributes/${id}`).toPromise();
  }

  updateAttribute(attribute: Attribute): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/attributes/' + attribute.id, attribute).toPromise();
  }

  inUse(id: string): Promise<InUse[]> {
    return this.http.get<InUse[]>(`${environment.backendUrl}/attributes/${id}/in-use`).toPromise();
  }

  delete(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/attributes/${id}`).toPromise();
  }

  deleteAttribute(attribute: Attribute): Promise<any> {
    return this.delete(attribute.id);
  }

  duplicateAttribute(attribute: Attribute, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(environment.backendUrl + '/attributes/' + attribute.id + '/duplicate', body.toString(), options).toPromise();
  }
}
