package com.herd.squire.models.items;

import com.herd.squire.models.items.magical_item.MagicalItem;
import com.herd.squire.models.items.weapon.Weapon;
import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Ammo.class, name = "Ammo"),
        @JsonSubTypes.Type(value = Armor.class, name = "Armor"),
        @JsonSubTypes.Type(value = Gear.class, name = "Gear"),
        @JsonSubTypes.Type(value = MagicalItem.class, name = "MagicalItem"),
        @JsonSubTypes.Type(value = Mount.class, name = "Mount"),
        @JsonSubTypes.Type(value = Pack.class, name = "Pack"),
        @JsonSubTypes.Type(value = Tool.class, name = "Tool"),
        @JsonSubTypes.Type(value = Treasure.class, name = "Treasure"),
        @JsonSubTypes.Type(value = Weapon.class, name = "Weapon"),
        @JsonSubTypes.Type(value = Vehicle.class, name = "Vehicle")
})
public class Item {
    protected String id;
    protected String name;
    protected ItemType itemType;
    protected boolean expendable;
    protected boolean equippable;
    protected EquipmentSlotType slot;
    protected boolean container;
    protected boolean ignoreWeight;
    protected int cost;
    protected CostUnit costUnit;
    protected double weight;
    protected String description;
    protected int sid;
    protected boolean author;
    protected int version;
    protected String categoryId;

    public Item() {}

    public Item(String id) {
        this.id = id;
    }

    public Item(String id, String name, ItemType itemType, String description, int sid, boolean author, int version, String categoryId) {
        this.id = id;
        this.name = name;
        this.itemType = itemType;
        this.description = description;
        this.sid = sid;
        this.author = author;
        this.version = version;
        this.categoryId = categoryId;
    }

    public Item(String id, String name, ItemType itemType, String description, int sid, boolean author, int version,
                boolean expendable, boolean equippable, EquipmentSlotType slot, boolean container, boolean ignoreWeight,
                int cost, CostUnit costUnit, double weight) {
        this.id = id;
        this.name = name;
        this.itemType = itemType;
        this.description = description;
        this.sid = sid;
        this.author = author;
        this.version = version;
        this.expendable = expendable;
        this.equippable = equippable;
        this.slot = slot;
        this.container = container;
        this.ignoreWeight = ignoreWeight;
        this.cost = cost;
        this.costUnit = costUnit;
        this.weight = weight;
    }

    public Item(String id, String name, ItemType itemType, String description, int sid, boolean author, int version,
                boolean expendable, boolean equippable, EquipmentSlotType slot, boolean container, boolean ignoreWeight,
                int cost, CostUnit costUnit, double weight, String categoryId) {
        this.id = id;
        this.name = name;
        this.itemType = itemType;
        this.description = description;
        this.sid = sid;
        this.author = author;
        this.version = version;
        this.expendable = expendable;
        this.equippable = equippable;
        this.slot = slot;
        this.container = container;
        this.ignoreWeight = ignoreWeight;
        this.cost = cost;
        this.costUnit = costUnit;
        this.weight = weight;
        this.categoryId = categoryId;
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

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public boolean isExpendable() {
        return expendable;
    }

    public void setExpendable(boolean expendable) {
        this.expendable = expendable;
    }

    public boolean isEquippable() {
        return equippable;
    }

    public void setEquippable(boolean equippable) {
        this.equippable = equippable;
    }

    public EquipmentSlotType getSlot() {
        return slot;
    }

    public void setSlot(EquipmentSlotType slot) {
        this.slot = slot;
    }

    public boolean isContainer() {
        return container;
    }

    public void setContainer(boolean container) {
        this.container = container;
    }

    public boolean isIgnoreWeight() {
        return ignoreWeight;
    }

    public void setIgnoreWeight(boolean ignoreWeight) {
        this.ignoreWeight = ignoreWeight;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public CostUnit getCostUnit() {
        return costUnit;
    }

    public void setCostUnit(CostUnit costUnit) {
        this.costUnit = costUnit;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}

