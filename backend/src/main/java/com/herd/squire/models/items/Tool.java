package com.herd.squire.models.items;

import com.herd.squire.models.attributes.ToolCategory;

public class Tool extends Item {
    private ToolCategory category;

    public Tool() {
    }

    public Tool(String id, String name, String description, int sid, boolean author, int version,
                boolean expendable, boolean equippable,
                EquipmentSlotType slot, boolean container, boolean ignoreWeight, int cost, CostUnit costUnit, double weight,
                ToolCategory category) {
        super(id, name, ItemType.TOOL, description, sid, author, version, expendable, equippable, slot, container, ignoreWeight, cost, costUnit, weight);
        this.category = category;
    }

    public ToolCategory getCategory() {
        return category;
    }

    public void setCategory(ToolCategory category) {
        this.category = category;
    }
}
