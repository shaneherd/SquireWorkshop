package com.herd.squire.models.items;

import com.herd.squire.models.powers.SpellListObject;

public class SelectionItem extends ItemQuantity {
    private boolean selected;
    private ItemListObject selectedApplicableItem;
    private SpellListObject selectedSpell;

    public SelectionItem() {
        super();
    }

    public SelectionItem(ItemListObject item, int quantity) {
        super(item, quantity);
    }

    public SelectionItem(ItemListObject item, int quantity, ItemListObject selectedApplicableItem) {
        super(item, quantity);
        this.selectedApplicableItem = selectedApplicableItem;
    }

    public SelectionItem(ItemListObject item, int quantity, boolean selected, ItemListObject selectedApplicableItem, SpellListObject selectedSpell) {
        super(item, quantity);
        this.selected = selected;
        this.selectedApplicableItem = selectedApplicableItem;
        this.selectedSpell = selectedSpell;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public ItemListObject getSelectedApplicableItem() {
        return selectedApplicableItem;
    }

    public void setSelectedApplicableItem(ItemListObject selectedApplicableItem) {
        this.selectedApplicableItem = selectedApplicableItem;
    }

    public SpellListObject getSelectedSpell() {
        return selectedSpell;
    }

    public void setSelectedSpell(SpellListObject selectedSpell) {
        this.selectedSpell = selectedSpell;
    }
}
