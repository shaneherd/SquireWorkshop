package com.herd.squire.models.creatures.characters.settings;

public class CharacterEquipmentSettings {
    private boolean hideEmptySlots;
    private boolean autoConvertCurrency;
    private boolean calculateCurrencyWeight;
    private boolean useEncumbrance;
    private boolean attackWithUnequipped;
    private int maxAttunedItems;
    private boolean enforceAttunedLimit;

    public CharacterEquipmentSettings() {
        hideEmptySlots = false;
        autoConvertCurrency = false;
        calculateCurrencyWeight = false;
        useEncumbrance = false;
        attackWithUnequipped = false;
        maxAttunedItems = 3;
        enforceAttunedLimit = true;
    }

    public CharacterEquipmentSettings(boolean hideEmptySlots, boolean autoConvertCurrency, boolean calculateCurrencyWeight,
                                      boolean useEncumbrance, boolean attackWithUnequipped, int maxAttunedItems, boolean enforceAttunedLimit) {
        this.hideEmptySlots = hideEmptySlots;
        this.autoConvertCurrency = autoConvertCurrency;
        this.calculateCurrencyWeight = calculateCurrencyWeight;
        this.useEncumbrance = useEncumbrance;
        this.attackWithUnequipped = attackWithUnequipped;
        this.maxAttunedItems = maxAttunedItems;
        this.enforceAttunedLimit = enforceAttunedLimit;
    }

    public boolean isHideEmptySlots() {
        return hideEmptySlots;
    }

    public void setHideEmptySlots(boolean hideEmptySlots) {
        this.hideEmptySlots = hideEmptySlots;
    }

    public boolean isAutoConvertCurrency() {
        return autoConvertCurrency;
    }

    public void setAutoConvertCurrency(boolean autoConvertCurrency) {
        this.autoConvertCurrency = autoConvertCurrency;
    }

    public boolean isCalculateCurrencyWeight() {
        return calculateCurrencyWeight;
    }

    public void setCalculateCurrencyWeight(boolean calculateCurrencyWeight) {
        this.calculateCurrencyWeight = calculateCurrencyWeight;
    }

    public boolean isUseEncumbrance() {
        return useEncumbrance;
    }

    public void setUseEncumbrance(boolean useEncumbrance) {
        this.useEncumbrance = useEncumbrance;
    }

    public boolean isAttackWithUnequipped() {
        return attackWithUnequipped;
    }

    public void setAttackWithUnequipped(boolean attackWithUnequipped) {
        this.attackWithUnequipped = attackWithUnequipped;
    }

    public int getMaxAttunedItems() {
        return maxAttunedItems;
    }

    public void setMaxAttunedItems(int maxAttunedItems) {
        this.maxAttunedItems = maxAttunedItems;
    }

    public boolean isEnforceAttunedLimit() {
        return enforceAttunedLimit;
    }

    public void setEnforceAttunedLimit(boolean enforceAttunedLimit) {
        this.enforceAttunedLimit = enforceAttunedLimit;
    }
}
