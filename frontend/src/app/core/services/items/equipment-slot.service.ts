import {Injectable} from '@angular/core';
import {AttributeService} from '../attributes/attribute.service';
import {HttpClient} from '@angular/common/http';
import {LOCAL_STORAGE} from '../../../constants';
import {EquipmentSlot} from '../../../shared/models/items/equipment-slot';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentSlotService {
  constructor(
    private attributeService: AttributeService,
    private http: HttpClient
  ) { }

  initializeEquipmentSlotsDetailed(): Promise<EquipmentSlot[]> {
    return this.http.get<EquipmentSlot[]>(`${environment.backendUrl}/items/slots/detailed`)
      .toPromise().then((slots: EquipmentSlot[]) => {
        localStorage.setItem(LOCAL_STORAGE.SLOTS, JSON.stringify(slots));
        return slots;
      });
  }

  geEquipmentSlotsDetailedFromStorage(): EquipmentSlot[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE.SLOTS));
  }

  getEquipmentSlotsByType(type: EquipmentSlotType): EquipmentSlot[] {
    const slots = this.geEquipmentSlotsDetailedFromStorage();
    const typeSlots: EquipmentSlot[] = [];
    slots.forEach((slot: EquipmentSlot) => {
      if (slot.equipmentSlotType === type) {
        typeSlots.push(slot);
      }
    });
    return typeSlots;
  }
}
