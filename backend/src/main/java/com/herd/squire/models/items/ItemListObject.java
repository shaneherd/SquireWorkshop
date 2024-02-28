package com.herd.squire.models.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.items.magical_item.MagicalItemApplicability;

import java.util.ArrayList;
import java.util.List;

public class ItemListObject extends ListObject {
    private int cost;
    private String costUnitId;
    private ItemType itemType;
    private ItemListObject subItem;
    private List<ItemQuantity> subItems;
    private List<MagicalItemApplicability> applicableMagicalItems;
    private boolean requireSelectedSpell;
    private List<MagicalItemApplicability> applicableSpells;

    public ItemListObject() {
        super();
        this.subItems = new ArrayList<>();
        this.applicableMagicalItems = new ArrayList<>();
        this.applicableSpells = new ArrayList<>();
    }

    public ItemListObject(String id, String name, int sid, boolean author, int cost, String costUnitId, ItemType itemType) {
        super(id, name, sid, author);
        this.cost = cost;
        this.costUnitId = costUnitId;
        this.itemType = itemType;

        this.subItem = null;
        this.subItems = new ArrayList<>();
        this.applicableMagicalItems = new ArrayList<>();
        this.applicableSpells = new ArrayList<>();
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public String getCostUnitId() {
        return costUnitId;
    }

    public void setCostUnitId(String costUnitId) {
        this.costUnitId = costUnitId;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public List<ItemQuantity> getSubItems() {
        return subItems;
    }

    public void setSubItems(List<ItemQuantity> subItems) {
        this.subItems = subItems;
    }

    public List<MagicalItemApplicability> getApplicableMagicalItems() {
        return applicableMagicalItems;
    }

    public void setApplicableMagicalItems(List<MagicalItemApplicability> applicableMagicalItems) {
        this.applicableMagicalItems = applicableMagicalItems;
    }

    public boolean isRequireSelectedSpell() {
        return requireSelectedSpell;
    }

    public void setRequireSelectedSpell(boolean requireSelectedSpell) {
        this.requireSelectedSpell = requireSelectedSpell;
    }

    public List<MagicalItemApplicability> getApplicableSpells() {
        return applicableSpells;
    }

    public void setApplicableSpells(List<MagicalItemApplicability> applicableSpells) {
        this.applicableSpells = applicableSpells;
    }

    public ItemListObject getSubItem() {
        return subItem;
    }

    public void setSubItem(ItemListObject subItem) {
        this.subItem = subItem;
    }
}
