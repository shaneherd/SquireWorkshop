package com.herd.squire.models.items.magical_item;

import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.items.ItemListObject;
import com.herd.squire.models.powers.SpellListObject;

public class MagicalItemApplicability {
    private MagicalItemApplicabilityType magicalItemApplicabilityType;
    private ItemListObject item;
    private SpellListObject spell;
    private Filters filters;

    public MagicalItemApplicability() {
        this.magicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
    }

    public MagicalItemApplicability(MagicalItemApplicabilityType magicalItemApplicabilityType, ItemListObject item, SpellListObject spell, Filters filters) {
        this.magicalItemApplicabilityType = magicalItemApplicabilityType;
        this.item = item;
        this.spell = spell;
        this.filters = filters;
    }

    public MagicalItemApplicabilityType getMagicalItemApplicabilityType() {
        return magicalItemApplicabilityType;
    }

    public void setMagicalItemApplicabilityType(MagicalItemApplicabilityType magicalItemApplicabilityType) {
        this.magicalItemApplicabilityType = magicalItemApplicabilityType;
    }

    public ItemListObject getItem() {
        return item;
    }

    public void setItem(ItemListObject item) {
        this.item = item;
    }

    public SpellListObject getSpell() {
        return spell;
    }

    public void setSpell(SpellListObject spell) {
        this.spell = spell;
    }

    public Filters getFilters() {
        return filters;
    }

    public void setFilters(Filters filters) {
        this.filters = filters;
    }
}
