package com.herd.squire.models.creatures.characters.settings;

import com.herd.squire.models.creatures.characters.CharacterPage;

import java.util.List;

public class CharacterSettings {
    private boolean restrictToTwenty;
    private CharacterHealthSettings health;
    private CharacterEquipmentSettings equipment;
    private CharacterSpeedSettings speed;
    private CharacterSpellcastingSettings spellcasting;
    private CharacterFeatureSettings features;
    private CharacterSkillSettings skills;
    private CharacterValidationSettings validation;
    private CharacterMiscSettings misc;
    private CharacterQuickActionSettings quickActions;
    private List<CharacterPage> pages;

    public CharacterSettings() {
        restrictToTwenty = false;
        health = new CharacterHealthSettings();
        equipment = new CharacterEquipmentSettings();
        speed = new CharacterSpeedSettings();
        spellcasting = new CharacterSpellcastingSettings();
        features = new CharacterFeatureSettings();
        skills = new CharacterSkillSettings();
        validation = new CharacterValidationSettings();
        misc = new CharacterMiscSettings();
        quickActions = new CharacterQuickActionSettings();
    }

    public CharacterSettings(boolean restrictToTwenty, CharacterHealthSettings health, CharacterEquipmentSettings equipment,
                             CharacterSpeedSettings speed, CharacterSpellcastingSettings spellcasting,
                             CharacterFeatureSettings features, CharacterSkillSettings skills,
                             CharacterValidationSettings validation, CharacterMiscSettings misc,
                             CharacterQuickActionSettings quickActions, List<CharacterPage> pages) {
        this.restrictToTwenty = restrictToTwenty;
        this.health = health;
        this.equipment = equipment;
        this.speed = speed;
        this.spellcasting = spellcasting;
        this.features = features;
        this.skills = skills;
        this.validation = validation;
        this.misc = misc;
        this.quickActions = quickActions;
        this.pages = pages;
    }

    public boolean isRestrictToTwenty() {
        return restrictToTwenty;
    }

    public void setRestrictToTwenty(boolean restrictToTwenty) {
        this.restrictToTwenty = restrictToTwenty;
    }

    public CharacterHealthSettings getHealth() {
        return health;
    }

    public void setHealth(CharacterHealthSettings health) {
        this.health = health;
    }

    public CharacterEquipmentSettings getEquipment() {
        return equipment;
    }

    public void setEquipment(CharacterEquipmentSettings equipment) {
        this.equipment = equipment;
    }

    public CharacterSpeedSettings getSpeed() {
        return speed;
    }

    public void setSpeed(CharacterSpeedSettings speed) {
        this.speed = speed;
    }

    public CharacterSpellcastingSettings getSpellcasting() {
        return spellcasting;
    }

    public void setSpellcasting(CharacterSpellcastingSettings spellcasting) {
        this.spellcasting = spellcasting;
    }

    public CharacterFeatureSettings getFeatures() {
        return features;
    }

    public void setFeatures(CharacterFeatureSettings features) {
        this.features = features;
    }

    public CharacterSkillSettings getSkills() {
        return skills;
    }

    public void setSkills(CharacterSkillSettings skills) {
        this.skills = skills;
    }

    public CharacterValidationSettings getValidation() {
        return validation;
    }

    public void setValidation(CharacterValidationSettings validation) {
        this.validation = validation;
    }

    public CharacterMiscSettings getMisc() {
        return misc;
    }

    public void setMisc(CharacterMiscSettings misc) {
        this.misc = misc;
    }

    public List<CharacterPage> getPages() {
        return pages;
    }

    public void setPages(List<CharacterPage> pages) {
        this.pages = pages;
    }

    public CharacterQuickActionSettings getQuickActions() {
        return quickActions;
    }

    public void setQuickActions(CharacterQuickActionSettings quickActions) {
        this.quickActions = quickActions;
    }
}
