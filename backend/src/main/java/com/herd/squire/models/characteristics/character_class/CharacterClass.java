package com.herd.squire.models.characteristics.character_class;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.attributes.CasterType;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.proficiency.Proficiency;

import java.util.ArrayList;
import java.util.List;

public class CharacterClass extends Characteristic {
    private String description;

    private DiceCollection hpAtFirst;
    private DiceCollection hitDice;
    private DiceCollection hpGain;
    private DiceCollection startingGold;

    private ClassSpellPreparation classSpellPreparation;
    private CasterType casterType;

    private List<Proficiency> armorSecondaryProfs;
    private List<Proficiency> armorTypeSecondaryProfs;
    private List<Proficiency> languageSecondaryProfs;
    private List<Proficiency> savingThrowSecondaryProfs;
    private List<Proficiency> skillSecondaryProfs;
    private List<Proficiency> skillSecondaryChoiceProfs;
    private List<Proficiency> toolCategorySecondaryProfs;
    private List<Proficiency> toolCategorySecondaryChoiceProfs;
    private List<Proficiency> toolSecondaryProfs;
    private List<Proficiency> weaponSecondaryProfs;
    private List<Proficiency> weaponTypeSecondaryProfs;
    private List<String> abilityScoreIncreases;

    private int numSecondarySkills;
    private int numSecondaryTools;
    private List<CharacterClass> subclasses;

    public CharacterClass() { }

    public CharacterClass(String id, String name, int sid, boolean author, int version,
                          int numAbilities, int numLanguages, int numSavingThrows,
                          int numSkills, int numTools, String spellCastingAbility, String description, DiceCollection hpAtFirst,
                          DiceCollection hitDice, DiceCollection hpGain, DiceCollection startingGold,
                          ClassSpellPreparation classSpellPreparation,
                          int numSecondarySkills, int numSecondaryTools) {
        super(id, name, sid, author, version, CharacteristicType.CLASS, numAbilities, numLanguages, numSavingThrows, numSkills, numTools, spellCastingAbility);
        this.description = description;
        this.hpAtFirst = hpAtFirst;
        this.hitDice = hitDice;
        this.hpGain = hpGain;
        this.startingGold = startingGold;
        this.classSpellPreparation = classSpellPreparation;
        this.casterType = null;
        this.numSecondarySkills = numSecondarySkills;
        this.numSecondaryTools = numSecondaryTools;

        this.armorSecondaryProfs = new ArrayList<>();
        this.armorTypeSecondaryProfs = new ArrayList<>();
        this.languageSecondaryProfs = new ArrayList<>();
        this.savingThrowSecondaryProfs = new ArrayList<>();
        this.skillSecondaryProfs = new ArrayList<>();
        this.skillSecondaryChoiceProfs = new ArrayList<>();
        this.toolCategorySecondaryProfs = new ArrayList<>();
        this.toolCategorySecondaryChoiceProfs = new ArrayList<>();
        this.toolSecondaryProfs = new ArrayList<>();
        this.weaponSecondaryProfs = new ArrayList<>();
        this.weaponTypeSecondaryProfs = new ArrayList<>();
        this.abilityScoreIncreases = new ArrayList<>();
        this.subclasses = new ArrayList<>();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DiceCollection getHpAtFirst() {
        return hpAtFirst;
    }

    public void setHpAtFirst(DiceCollection hpAtFirst) {
        this.hpAtFirst = hpAtFirst;
    }

    public DiceCollection getHitDice() {
        return hitDice;
    }

    public void setHitDice(DiceCollection hitDice) {
        this.hitDice = hitDice;
    }

    public DiceCollection getHpGain() {
        return hpGain;
    }

    public void setHpGain(DiceCollection hpGain) {
        this.hpGain = hpGain;
    }

    public DiceCollection getStartingGold() {
        return startingGold;
    }

    public void setStartingGold(DiceCollection startingGold) {
        this.startingGold = startingGold;
    }

    public ClassSpellPreparation getClassSpellPreparation() {
        return classSpellPreparation;
    }

    public void setClassSpellPreparation(ClassSpellPreparation classSpellPreparation) {
        this.classSpellPreparation = classSpellPreparation;
    }

    public CasterType getCasterType() {
        return casterType;
    }

    public void setCasterType(CasterType casterType) {
        this.casterType = casterType;
    }

    public List<Proficiency> getArmorSecondaryProfs() {
        return armorSecondaryProfs;
    }

    public void setArmorSecondaryProfs(List<Proficiency> armorSecondaryProfs) {
        this.armorSecondaryProfs = armorSecondaryProfs;
    }

    public List<Proficiency> getArmorTypeSecondaryProfs() {
        return armorTypeSecondaryProfs;
    }

    public void setArmorTypeSecondaryProfs(List<Proficiency> armorTypeSecondaryProfs) {
        this.armorTypeSecondaryProfs = armorTypeSecondaryProfs;
    }

    public List<Proficiency> getLanguageSecondaryProfs() {
        return languageSecondaryProfs;
    }

    public void setLanguageSecondaryProfs(List<Proficiency> languageSecondaryProfs) {
        this.languageSecondaryProfs = languageSecondaryProfs;
    }

    public List<Proficiency> getSavingThrowSecondaryProfs() {
        return savingThrowSecondaryProfs;
    }

    public void setSavingThrowSecondaryProfs(List<Proficiency> savingThrowSecondaryProfs) {
        this.savingThrowSecondaryProfs = savingThrowSecondaryProfs;
    }

    public List<Proficiency> getSkillSecondaryProfs() {
        return skillSecondaryProfs;
    }

    public void setSkillSecondaryProfs(List<Proficiency> skillSecondaryProfs) {
        this.skillSecondaryProfs = skillSecondaryProfs;
    }

    public List<Proficiency> getSkillSecondaryChoiceProfs() {
        return skillSecondaryChoiceProfs;
    }

    public void setSkillSecondaryChoiceProfs(List<Proficiency> skillSecondaryChoiceProfs) {
        this.skillSecondaryChoiceProfs = skillSecondaryChoiceProfs;
    }

    public List<Proficiency> getToolCategorySecondaryProfs() {
        return toolCategorySecondaryProfs;
    }

    public void setToolCategorySecondaryProfs(List<Proficiency> toolCategorySecondaryProfs) {
        this.toolCategorySecondaryProfs = toolCategorySecondaryProfs;
    }

    public List<Proficiency> getToolCategorySecondaryChoiceProfs() {
        return toolCategorySecondaryChoiceProfs;
    }

    public void setToolCategorySecondaryChoiceProfs(List<Proficiency> toolCategorySecondaryChoiceProfs) {
        this.toolCategorySecondaryChoiceProfs = toolCategorySecondaryChoiceProfs;
    }

    public List<Proficiency> getToolSecondaryProfs() {
        return toolSecondaryProfs;
    }

    public void setToolSecondaryProfs(List<Proficiency> toolSecondaryProfs) {
        this.toolSecondaryProfs = toolSecondaryProfs;
    }

    public List<Proficiency> getWeaponSecondaryProfs() {
        return weaponSecondaryProfs;
    }

    public void setWeaponSecondaryProfs(List<Proficiency> weaponSecondaryProfs) {
        this.weaponSecondaryProfs = weaponSecondaryProfs;
    }

    public List<Proficiency> getWeaponTypeSecondaryProfs() {
        return weaponTypeSecondaryProfs;
    }

    public void setWeaponTypeSecondaryProfs(List<Proficiency> weaponTypeSecondaryProfs) {
        this.weaponTypeSecondaryProfs = weaponTypeSecondaryProfs;
    }

    public List<String> getAbilityScoreIncreases() {
        return abilityScoreIncreases;
    }

    public void setAbilityScoreIncreases(List<String> abilityScoreIncreases) {
        this.abilityScoreIncreases = abilityScoreIncreases;
    }

    public int getNumSecondarySkills() {
        return numSecondarySkills;
    }

    public void setNumSecondarySkills(int numSecondarySkills) {
        this.numSecondarySkills = numSecondarySkills;
    }

    public int getNumSecondaryTools() {
        return numSecondaryTools;
    }

    public void setNumSecondaryTools(int numSecondaryTools) {
        this.numSecondaryTools = numSecondaryTools;
    }

    public List<CharacterClass> getSubclasses() {
        return subclasses;
    }

    public void setSubclasses(List<CharacterClass> subclasses) {
        this.subclasses = subclasses;
    }
}
