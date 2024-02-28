package com.herd.squire.models.creatures.characters.character_validation;

import com.herd.squire.models.powers.FeatureListObject;
import com.herd.squire.models.powers.SpellListObject;

import java.util.ArrayList;
import java.util.List;

public class CharacterValidationResponse {
    private List<CharacterValidationResponseItem> items;
    private List<FeatureListObject> ignoredFeatures;
    private List<SpellListObject> ignoredSpells;

    public CharacterValidationResponse() {
        this.items = new ArrayList<>();
        this.ignoredFeatures = new ArrayList<>();
        this.ignoredSpells = new ArrayList<>();
    }

    public CharacterValidationResponse(List<CharacterValidationResponseItem> items, List<FeatureListObject> ignoredFeatures,
                                       List<SpellListObject> ignoredSpells) {
        this.items = items;
        this.ignoredFeatures = ignoredFeatures;
        this.ignoredSpells = ignoredSpells;
    }

    public List<CharacterValidationResponseItem> getItems() {
        return items;
    }

    public void setItems(List<CharacterValidationResponseItem> items) {
        this.items = items;
    }

    public List<FeatureListObject> getIgnoredFeatures() {
        return ignoredFeatures;
    }

    public void setIgnoredFeatures(List<FeatureListObject> ignoredFeatures) {
        this.ignoredFeatures = ignoredFeatures;
    }

    public List<SpellListObject> getIgnoredSpells() {
        return ignoredSpells;
    }

    public void setIgnoredSpells(List<SpellListObject> ignoredSpells) {
        this.ignoredSpells = ignoredSpells;
    }
}
