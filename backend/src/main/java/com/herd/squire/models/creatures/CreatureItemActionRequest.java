package com.herd.squire.models.creatures;

import com.herd.squire.models.items.magical_item.MagicalItemSpellConfiguration;

import java.util.ArrayList;
import java.util.List;

public class CreatureItemActionRequest {
    private String creatureItemId;
    private CreatureItemAction action;
    private int quantity;
    private String containerId;
    private String equipmentSlotId;
    private int charges;
    private List<MagicalItemSpellConfiguration> spells;

    public CreatureItemActionRequest() {
        this.spells = new ArrayList<>();
    }

    public CreatureItemActionRequest(String creatureItemId, CreatureItemAction action, int quantity, String containerId, String equipmentSlotId, int charges, List<MagicalItemSpellConfiguration> spells) {
        this.creatureItemId = creatureItemId;
        this.action = action;
        this.quantity = quantity;
        this.containerId = containerId;
        this.equipmentSlotId = equipmentSlotId;
        this.charges = charges;
        this.spells = spells;
    }

    public String getCreatureItemId() {
        return creatureItemId;
    }

    public void setCreatureItemId(String creatureItemId) {
        this.creatureItemId = creatureItemId;
    }

    public CreatureItemAction getAction() {
        return action;
    }

    public void setAction(CreatureItemAction action) {
        this.action = action;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    public String getEquipmentSlotId() {
        return equipmentSlotId;
    }

    public void setEquipmentSlotId(String equipmentSlotId) {
        this.equipmentSlotId = equipmentSlotId;
    }

    public int getCharges() {
        return charges;
    }

    public void setCharges(int charges) {
        this.charges = charges;
    }

    public List<MagicalItemSpellConfiguration> getSpells() {
        return spells;
    }

    public void setSpells(List<MagicalItemSpellConfiguration> spells) {
        this.spells = spells;
    }
}
