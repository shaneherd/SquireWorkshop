package com.herd.squire.models.creatures;

import com.herd.squire.models.items.EquipmentSlot;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemType;
import com.herd.squire.models.items.magical_item.MagicalItemSpellConfiguration;

import java.util.ArrayList;
import java.util.List;

public class CreatureItem {
    private String id;
    private String name;
    private Item item;
    private ItemType itemType;
    private int quantity;
    private EquipmentSlot equipmentSlot;
    private double weight;
    private String containerId;
    private boolean container;
    private boolean ignoreWeightOfItems;
    private boolean expanded;
    private boolean poisoned;
    private boolean silvered;
    private boolean full;
    private boolean attuned;
    private boolean cursed;
    private int chargesRemaining;
    private int maxCharges;
    private Item magicalItem;
    private String notes;
    private List<CreatureItem> items;
    private CreatureItemState creatureItemState;
    private List<MagicalItemSpellConfiguration> spells;

    public CreatureItem() {
        items = new ArrayList<>();
        spells = new ArrayList<>();
    }

    public CreatureItem(String id, Item item, ItemType itemType, int quantity, EquipmentSlot equipmentSlot,
                        double weight, String containerId, boolean container, boolean ignoreWeightOfItems,
                        boolean expanded, boolean poisoned, boolean silvered,
                        boolean full, boolean attuned, boolean cursed, int chargesRemaining, int maxCharges,
                        Item magicalItem, CreatureItemState creatureItemState, String notes) {
        this.id = id;
        this.item = item;
        this.name = item.getName();
        this.itemType = itemType;
        this.quantity = quantity;
        this.equipmentSlot = equipmentSlot;
        this.weight = weight;
        this.containerId = containerId;
        this.container = container;
        this.ignoreWeightOfItems = ignoreWeightOfItems;
        this.expanded = expanded;
        this.poisoned = poisoned;
        this.silvered = silvered;
        this.full = full;
        this.attuned = attuned;
        this.cursed = cursed;
        this.chargesRemaining = chargesRemaining;
        this.maxCharges = maxCharges;
        this.magicalItem = magicalItem;
        this.notes = notes;
        this.creatureItemState = creatureItemState;
        this.items = new ArrayList<>();
        this.spells = new ArrayList<>();

        if (this.creatureItemState == CreatureItemState.EQUIPPED && (equipmentSlot == null || equipmentSlot.getId().equals("0"))) {
            this.creatureItemState = CreatureItemState.CARRIED;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
        this.name = item == null ? "" : item.getName();
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public EquipmentSlot getEquipmentSlot() {
        return equipmentSlot;
    }

    public void setEquipmentSlot(EquipmentSlot equipmentSlot) {
        this.equipmentSlot = equipmentSlot;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    public boolean isContainer() {
        return container;
    }

    public void setContainer(boolean container) {
        this.container = container;
    }

    public boolean isIgnoreWeightOfItems() {
        return ignoreWeightOfItems;
    }

    public void setIgnoreWeightOfItems(boolean ignoreWeightOfItems) {
        this.ignoreWeightOfItems = ignoreWeightOfItems;
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    public boolean isPoisoned() {
        return poisoned;
    }

    public void setPoisoned(boolean poisoned) {
        this.poisoned = poisoned;
    }

    public boolean isSilvered() {
        return silvered;
    }

    public void setSilvered(boolean silvered) {
        this.silvered = silvered;
    }

    public boolean isFull() {
        return full;
    }

    public void setFull(boolean full) {
        this.full = full;
    }

    public boolean isAttuned() {
        return attuned;
    }

    public void setAttuned(boolean attuned) {
        this.attuned = attuned;
    }

    public boolean isCursed() {
        return cursed;
    }

    public void setCursed(boolean cursed) {
        this.cursed = cursed;
    }

    public int getChargesRemaining() {
        return chargesRemaining;
    }

    public void setChargesRemaining(int chargesRemaining) {
        this.chargesRemaining = chargesRemaining;
    }

    public int getMaxCharges() {
        return maxCharges;
    }

    public void setMaxCharges(int maxCharges) {
        this.maxCharges = maxCharges;
    }

    public Item getMagicalItem() {
        return magicalItem;
    }

    public void setMagicalItem(Item magicalItem) {
        this.magicalItem = magicalItem;
    }

    public CreatureItemState getCreatureItemState() {
        return creatureItemState;
    }

    public void setCreatureItemState(CreatureItemState creatureItemState) {
        this.creatureItemState = creatureItemState;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<CreatureItem> getItems() {
        return items;
    }

    public void setItems(List<CreatureItem> items) {
        this.items = items;
    }

    public List<MagicalItemSpellConfiguration> getSpells() {
        return spells;
    }

    public void setSpells(List<MagicalItemSpellConfiguration> spells) {
        this.spells = spells;
    }
}
