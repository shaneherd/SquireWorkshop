package com.herd.squire.models.characteristics.background;

import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.CharacteristicType;

import java.util.ArrayList;
import java.util.List;

public class Background extends Characteristic {
    private String description;
    private List<BackgroundTrait> variations;
    private List<BackgroundTrait> personalities;
    private List<BackgroundTrait> ideals;
    private List<BackgroundTrait> bonds;
    private List<BackgroundTrait> flaws;
    private int startingGold;
    private List<Background> subBackgrounds;

    public Background() { }

    public Background(String id, String name, int sid, boolean author, int version,
                      int numAbilities, int numLanguages, int numSavingThrows,
                int numSkills, int numTools, String spellCastingAbility, String description, int startingGold) {
        super(id, name, sid, author, version, CharacteristicType.BACKGROUND, numAbilities, numLanguages, numSavingThrows, numSkills, numTools, spellCastingAbility);
        this.description = description;
        this.startingGold = startingGold;

        this.variations = new ArrayList<>();
        this.personalities = new ArrayList<>();
        this.ideals = new ArrayList<>();
        this.bonds = new ArrayList<>();
        this.flaws = new ArrayList<>();
        this.subBackgrounds = new ArrayList<>();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BackgroundTrait> getVariations() {
        return variations;
    }

    public void setVariations(List<BackgroundTrait> variations) {
        this.variations = variations;
    }

    public List<BackgroundTrait> getPersonalities() {
        return personalities;
    }

    public void setPersonalities(List<BackgroundTrait> personalities) {
        this.personalities = personalities;
    }

    public List<BackgroundTrait> getIdeals() {
        return ideals;
    }

    public void setIdeals(List<BackgroundTrait> ideals) {
        this.ideals = ideals;
    }

    public List<BackgroundTrait> getBonds() {
        return bonds;
    }

    public void setBonds(List<BackgroundTrait> bonds) {
        this.bonds = bonds;
    }

    public List<BackgroundTrait> getFlaws() {
        return flaws;
    }

    public void setFlaws(List<BackgroundTrait> flaws) {
        this.flaws = flaws;
    }

    public int getStartingGold() {
        return startingGold;
    }

    public void setStartingGold(int startingGold) {
        this.startingGold = startingGold;
    }

    public List<Background> getSubBackgrounds() {
        return subBackgrounds;
    }

    public void setSubBackgrounds(List<Background> subBackgrounds) {
        this.subBackgrounds = subBackgrounds;
    }

    public void addTrait(BackgroundTrait trait) {
        switch (trait.getBackgroundTraitType()) {
            case VARIATION:
                getVariations().add(trait);
                break;
            case PERSONALITY:
                getPersonalities().add(trait);
                break;
            case IDEAL:
                getIdeals().add(trait);
                break;
            case BOND:
                getBonds().add(trait);
                break;
            case FLAW:
                getFlaws().add(trait);
                break;
        }
    }
}
