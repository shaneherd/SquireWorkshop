package com.herd.squire.models.creatures.characters.character_validation;

import com.herd.squire.models.powers.FeatureListObject;

import java.util.ArrayList;
import java.util.List;

public class CharacterValidationResponseItem {
    private CharacterValidationItem characterValidationItem;
    private FeatureListObject selectedFeat;
    private List<CharacterValidationConfigurationASI> selectedAbilityScoreIncreases;
    private boolean ignoreASI;

    public CharacterValidationResponseItem() {
        this.selectedAbilityScoreIncreases = new ArrayList<>();
    }

    public CharacterValidationResponseItem(CharacterValidationItem characterValidationItem, FeatureListObject selectedFeat,
                                           List<CharacterValidationConfigurationASI> selectedAbilityScoreIncreases, boolean ignoreASI) {
        this.characterValidationItem = characterValidationItem;
        this.selectedFeat = selectedFeat;
        this.selectedAbilityScoreIncreases = selectedAbilityScoreIncreases;
        this.ignoreASI = ignoreASI;
    }

    public CharacterValidationItem getCharacterValidationItem() {
        return characterValidationItem;
    }

    public void setCharacterValidationItem(CharacterValidationItem characterValidationItem) {
        this.characterValidationItem = characterValidationItem;
    }

    public FeatureListObject getSelectedFeat() {
        return selectedFeat;
    }

    public void setSelectedFeat(FeatureListObject selectedFeat) {
        this.selectedFeat = selectedFeat;
    }

    public List<CharacterValidationConfigurationASI> getSelectedAbilityScoreIncreases() {
        return selectedAbilityScoreIncreases;
    }

    public void setSelectedAbilityScoreIncreases(List<CharacterValidationConfigurationASI> selectedAbilityScoreIncreases) {
        this.selectedAbilityScoreIncreases = selectedAbilityScoreIncreases;
    }

    public boolean isIgnoreASI() {
        return ignoreASI;
    }

    public void setIgnoreASI(boolean ignoreASI) {
        this.ignoreASI = ignoreASI;
    }
}
