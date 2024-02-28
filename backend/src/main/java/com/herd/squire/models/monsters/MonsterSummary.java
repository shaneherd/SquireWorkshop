package com.herd.squire.models.monsters;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.ListObject;

import java.util.ArrayList;
import java.util.List;

public class MonsterSummary {
    private String id;
    private String name;
    private List<MonsterAbilityScore> abilityScores;
    private DiceCollection hitDice;
    private int ac;
    private String spellcastingAbility;
    private ListObject spellcasterLevel;
    private ListObject innateSpellcasterLevel;
    private ChallengeRating challengeRating;
    private int experience;
    private boolean perceptionProficient;
    private boolean stealthProficient;
    private int legendaryPoints;

    public MonsterSummary() {
        this.abilityScores = new ArrayList<>();
    }

    public MonsterSummary(String id, String name, DiceCollection hitDice, int ac, String spellcastingAbility,
                          ListObject spellcasterLevel, ListObject innateSpellcasterLevel, ChallengeRating challengeRating,
                          int experience, boolean perceptionProficient, boolean stealthProficient, int legendaryPoints) {
        this.id = id;
        this.name = name;
        this.hitDice = hitDice;
        this.ac = ac;
        this.spellcastingAbility = spellcastingAbility;
        this.spellcasterLevel = spellcasterLevel;
        this.innateSpellcasterLevel = innateSpellcasterLevel;
        this.challengeRating = challengeRating;
        this.experience = experience;
        this.perceptionProficient = perceptionProficient;
        this.stealthProficient = stealthProficient;
        this.legendaryPoints = legendaryPoints;
        this.abilityScores = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<MonsterAbilityScore> getAbilityScores() {
        return abilityScores;
    }

    public void setAbilityScores(List<MonsterAbilityScore> abilityScores) {
        this.abilityScores = abilityScores;
    }

    public DiceCollection getHitDice() {
        return hitDice;
    }

    public void setHitDice(DiceCollection hitDice) {
        this.hitDice = hitDice;
    }

    public int getAc() {
        return ac;
    }

    public void setAc(int ac) {
        this.ac = ac;
    }

    public String getSpellcastingAbility() {
        return spellcastingAbility;
    }

    public void setSpellcastingAbility(String spellcastingAbility) {
        this.spellcastingAbility = spellcastingAbility;
    }

    public ListObject getSpellcasterLevel() {
        return spellcasterLevel;
    }

    public void setSpellcasterLevel(ListObject spellcasterLevel) {
        this.spellcasterLevel = spellcasterLevel;
    }

    public ListObject getInnateSpellcasterLevel() {
        return innateSpellcasterLevel;
    }

    public void setInnateSpellcasterLevel(ListObject innateSpellcasterLevel) {
        this.innateSpellcasterLevel = innateSpellcasterLevel;
    }

    public ChallengeRating getChallengeRating() {
        return challengeRating;
    }

    public void setChallengeRating(ChallengeRating challengeRating) {
        this.challengeRating = challengeRating;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public boolean isPerceptionProficient() {
        return perceptionProficient;
    }

    public void setPerceptionProficient(boolean perceptionProficient) {
        this.perceptionProficient = perceptionProficient;
    }

    public boolean isStealthProficient() {
        return stealthProficient;
    }

    public void setStealthProficient(boolean stealthProficient) {
        this.stealthProficient = stealthProficient;
    }

    public int getLegendaryPoints() {
        return legendaryPoints;
    }

    public void setLegendaryPoints(int legendaryPoints) {
        this.legendaryPoints = legendaryPoints;
    }
}
