package com.herd.squire.models.characteristics.starting_equipment;

import java.util.List;

public class StartingEquipmentGroup {
    private String id;
    private int numToChoose;
    private List<StartingEquipmentItem> items;
    private List<StartingEquipmentGroup> groups;
    private String parentGroupId;

    public StartingEquipmentGroup() {}

    public StartingEquipmentGroup(String id, int numToChoose, List<StartingEquipmentItem> items, List<StartingEquipmentGroup> groups, String parentGroupId) {
        this.id = id;
        this.numToChoose = numToChoose;
        this.items = items;
        this.groups = groups;
        this.parentGroupId = parentGroupId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNumToChoose() {
        return numToChoose;
    }

    public void setNumToChoose(int numToChoose) {
        this.numToChoose = numToChoose;
    }

    public List<StartingEquipmentItem> getItems() {
        return items;
    }

    public void setItems(List<StartingEquipmentItem> items) {
        this.items = items;
    }

    public List<StartingEquipmentGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<StartingEquipmentGroup> groups) {
        this.groups = groups;
    }

    public String getParentGroupId() {
        return parentGroupId;
    }

    public void setParentGroupId(String parentGroupId) {
        this.parentGroupId = parentGroupId;
    }
}
