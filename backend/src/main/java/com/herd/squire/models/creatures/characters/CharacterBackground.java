package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.characteristics.background.Background;
import com.herd.squire.models.characteristics.background.BackgroundTrait;
import com.herd.squire.models.powers.AttackType;

import java.util.ArrayList;
import java.util.List;

public class CharacterBackground {
    private Background background;
    private List<BackgroundTrait> chosenTraits;

    private String customBackgroundName;
    private String customVariation;
    private String customPersonality;
    private String customIdeal;
    private String customBond;
    private String customFlaw;

    private String bio;

    private String spellcastingAbility;
    private Spellcasting spellcastingAttack;
    private Spellcasting spellcastingSave;

    public CharacterBackground() {}

    public CharacterBackground(String customBackgroundName, String customVariation, String customPersonality,
                               String customIdeal, String customBond, String customFlaw, String bio,
                               String spellcastingAbility) {
        this.customBackgroundName = customBackgroundName;
        this.customVariation = customVariation;
        this.customPersonality = customPersonality;
        this.customIdeal = customIdeal;
        this.customBond = customBond;
        this.customFlaw = customFlaw;
        this.bio = bio;

        this.background = null;
        this.chosenTraits = new ArrayList<>();
        this.spellcastingAbility = spellcastingAbility;
        this.spellcastingAttack = new Spellcasting(AttackType.ATTACK);
        this.spellcastingSave = new Spellcasting(AttackType.SAVE);
    }

    public Background getBackground() {
        return background;
    }

    public void setBackground(Background background) {
        this.background = background;
    }

    public List<BackgroundTrait> getChosenTraits() {
        return chosenTraits;
    }

    public void setChosenTraits(List<BackgroundTrait> chosenTraits) {
        this.chosenTraits = chosenTraits;
    }

    public String getCustomBackgroundName() {
        return customBackgroundName;
    }

    public void setCustomBackgroundName(String customBackgroundName) {
        this.customBackgroundName = customBackgroundName;
    }

    public String getCustomVariation() {
        return customVariation;
    }

    public void setCustomVariation(String customVariation) {
        this.customVariation = customVariation;
    }

    public String getCustomPersonality() {
        return customPersonality;
    }

    public void setCustomPersonality(String customPersonality) {
        this.customPersonality = customPersonality;
    }

    public String getCustomIdeal() {
        return customIdeal;
    }

    public void setCustomIdeal(String customIdeal) {
        this.customIdeal = customIdeal;
    }

    public String getCustomBond() {
        return customBond;
    }

    public void setCustomBond(String customBond) {
        this.customBond = customBond;
    }

    public String getCustomFlaw() {
        return customFlaw;
    }

    public void setCustomFlaw(String customFlaw) {
        this.customFlaw = customFlaw;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSpellcastingAbility() {
        return spellcastingAbility;
    }

    public void setSpellcastingAbility(String spellcastingAbility) {
        this.spellcastingAbility = spellcastingAbility;
    }

    public Spellcasting getSpellcastingAttack() {
        return spellcastingAttack;
    }

    public void setSpellcastingAttack(Spellcasting spellcastingAttack) {
        this.spellcastingAttack = spellcastingAttack;
    }

    public Spellcasting getSpellcastingSave() {
        return spellcastingSave;
    }

    public void setSpellcastingSave(Spellcasting spellcastingSave) {
        this.spellcastingSave = spellcastingSave;
    }
}
