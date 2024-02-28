package com.herd.squire.models.creatures.characters.character_validation;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.powers.FeatureListObject;
import com.herd.squire.models.powers.SpellListObject;

import java.util.ArrayList;
import java.util.List;

public class CharacterValidationItem {
    private boolean valid;
    private ListObject characteristic;
    private ListObject subCharacteristic;
    private ListObject level;
    private List<FeatureListObject> features;
    private List<SpellListObject> spells;
    private boolean abilityScoreIncreaseApplicable;
    private boolean abilityScoreIncreaseApplied;
    private boolean featSelected;

    public CharacterValidationItem() {
        this.features = new ArrayList<>();
        this.spells = new ArrayList<>();
    }

    public CharacterValidationItem(ListObject characteristic, ListObject subCharacteristic, ListObject level,
                                   boolean abilityScoreIncreaseApplicable, boolean abilityScoreIncreaseApplied, boolean featSelected) {
        this.characteristic = characteristic;
        this.subCharacteristic = subCharacteristic;
        this.level = level;
        this.features = new ArrayList<>();
        this.spells = new ArrayList<>();
        this.abilityScoreIncreaseApplicable = abilityScoreIncreaseApplicable;
        this.abilityScoreIncreaseApplied = abilityScoreIncreaseApplied;
        this.featSelected = featSelected;
    }

    public void validate() {
        this.valid = this.features.isEmpty() && this.spells.isEmpty() && (!this.abilityScoreIncreaseApplicable || this.abilityScoreIncreaseApplied || this.featSelected);
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public ListObject getCharacteristic() {
        return characteristic;
    }

    public void setCharacteristic(ListObject characteristic) {
        this.characteristic = characteristic;
    }

    public ListObject getSubCharacteristic() {
        return subCharacteristic;
    }

    public void setSubCharacteristic(ListObject subCharacteristic) {
        this.subCharacteristic = subCharacteristic;
    }

    public ListObject getLevel() {
        return level;
    }

    public void setLevel(ListObject level) {
        this.level = level;
    }

    public List<FeatureListObject> getFeatures() {
        return features;
    }

    public void setFeatures(List<FeatureListObject> features) {
        this.features = features;
    }

    public List<SpellListObject> getSpells() {
        return spells;
    }

    public void setSpells(List<SpellListObject> spells) {
        this.spells = spells;
    }

    public boolean isAbilityScoreIncreaseApplicable() {
        return abilityScoreIncreaseApplicable;
    }

    public void setAbilityScoreIncreaseApplicable(boolean abilityScoreIncreaseApplicable) {
        this.abilityScoreIncreaseApplicable = abilityScoreIncreaseApplicable;
    }

    public boolean isAbilityScoreIncreaseApplied() {
        return abilityScoreIncreaseApplied;
    }

    public void setAbilityScoreIncreaseApplied(boolean abilityScoreIncreaseApplied) {
        this.abilityScoreIncreaseApplied = abilityScoreIncreaseApplied;
    }

    public boolean isFeatSelected() {
        return featSelected;
    }

    public void setFeatSelected(boolean featSelected) {
        this.featSelected = featSelected;
    }
}
