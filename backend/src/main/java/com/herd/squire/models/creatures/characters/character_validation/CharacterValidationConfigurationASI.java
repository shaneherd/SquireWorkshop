package com.herd.squire.models.creatures.characters.character_validation;

import com.herd.squire.models.ListObject;

public class CharacterValidationConfigurationASI {
    private ListObject ability;
    private int amount;

    public CharacterValidationConfigurationASI() {

    }

    public CharacterValidationConfigurationASI(ListObject ability, int amount) {
        this.ability = ability;
        this.amount = amount;
    }

    public ListObject getAbility() {
        return ability;
    }

    public void setAbility(ListObject ability) {
        this.ability = ability;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
