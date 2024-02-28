package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.creatures.CreatureHealth;

import java.util.List;

public class CharacterHealthConfiguration {
    private CreatureHealth creatureHealth;
    private int hpGainModifier;
    private HealthCalculationType healthCalculationType;
    private List<ChosenClass> classes;

    public CharacterHealthConfiguration() {}

    public CharacterHealthConfiguration(CreatureHealth creatureHealth, int hpGainModifier, HealthCalculationType healthCalculationType, List<ChosenClass> classes) {
        this.creatureHealth = creatureHealth;
        this.hpGainModifier = hpGainModifier;
        this.healthCalculationType = healthCalculationType;
        this.classes = classes;
    }

    public CreatureHealth getCreatureHealth() {
        return creatureHealth;
    }

    public void setCreatureHealth(CreatureHealth creatureHealth) {
        this.creatureHealth = creatureHealth;
    }

    public int getHpGainModifier() {
        return hpGainModifier;
    }

    public void setHpGainModifier(int hpGainModifier) {
        this.hpGainModifier = hpGainModifier;
    }

    public HealthCalculationType getHealthCalculationType() {
        return healthCalculationType;
    }

    public void setHealthCalculationType(HealthCalculationType healthCalculationType) {
        this.healthCalculationType = healthCalculationType;
    }

    public List<ChosenClass> getClasses() {
        return classes;
    }

    public void setClasses(List<ChosenClass> classes) {
        this.classes = classes;
    }
}
