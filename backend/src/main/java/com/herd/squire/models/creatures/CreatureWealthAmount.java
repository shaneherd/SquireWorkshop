package com.herd.squire.models.creatures;

import com.herd.squire.models.items.CostUnit;

public class CreatureWealthAmount {
    private CostUnit costUnit;
    private int amount;
    private boolean display;
    private int displayOrder;

    public CreatureWealthAmount() {}

    public CreatureWealthAmount(CostUnit costUnit, int amount, boolean display, int displayOrder) {
        this.costUnit = costUnit;
        this.amount = amount;
        this.display = display;
        this.displayOrder = displayOrder;
    }

    public CostUnit getCostUnit() {
        return costUnit;
    }

    public void setCostUnit(CostUnit costUnit) {
        this.costUnit = costUnit;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public boolean isDisplay() {
        return display;
    }

    public void setDisplay(boolean display) {
        this.display = display;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
