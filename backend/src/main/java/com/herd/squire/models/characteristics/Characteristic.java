package com.herd.squire.models.characteristics;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.Modifier;
import com.herd.squire.models.SenseValue;
import com.herd.squire.models.characteristics.background.Background;
import com.herd.squire.models.characteristics.character_class.CharacterClass;
import com.herd.squire.models.characteristics.starting_equipment.StartingEquipment;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.proficiency.Proficiency;
import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

import java.util.ArrayList;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Background.class, name = "Background"),
        @JsonSubTypes.Type(value = CharacterClass.class, name = "CharacterClass"),
        @JsonSubTypes.Type(value = Race.class, name = "Race")
})
public class Characteristic {
    protected String id;
    protected Characteristic parent;
    protected String name;
    protected int sid;
    protected boolean author;
    protected int version;

    protected CharacteristicType characteristicType;
    protected List<Modifier> abilityModifiers;
    protected List<Proficiency> armorProfs;
    protected List<Proficiency> armorTypeProfs;
    protected List<Proficiency> languageProfs;
    protected List<Proficiency> savingThrowProfs;
    protected List<Proficiency> skillProfs;
    protected List<Proficiency> skillChoiceProfs;
    protected List<Proficiency> toolCategoryProfs;
    protected List<Proficiency> toolCategoryChoiceProfs;
    protected List<Proficiency> toolProfs;
    protected List<Proficiency> weaponProfs;
    protected List<Proficiency> weaponTypeProfs;
    protected List<SpellConfiguration> spellConfigurations;
    protected List<StartingEquipment> startingEquipment;
    protected List<DamageModifier> damageModifiers;
    protected List<ListObject> conditionImmunities;
    protected List<SenseValue> senses;
    protected List<Modifier> miscModifiers;
    protected int numAbilities;
    protected int numLanguages;
    protected int numSavingThrows;
    protected int numSkills;
    protected int numTools;
    protected String spellCastingAbility;

    public Characteristic() {}

    public Characteristic(String id, String name, int sid, boolean author, int version,
                          CharacteristicType characteristicType, int numAbilities, int numLanguages,
                          int numSavingThrows, int numSkills, int numTools, String spellCastingAbility) {
        this.id = id;
        this.name = name;
        this.sid = sid;
        this.author = author;
        this.version = version;

        this.characteristicType = characteristicType;
        this.numAbilities = numAbilities;
        this.numLanguages = numLanguages;
        this.numSavingThrows = numSavingThrows;
        this.numSkills = numSkills;
        this.numTools = numTools;
        this.spellCastingAbility = spellCastingAbility;

        this.abilityModifiers = new ArrayList<>();
        this.armorProfs = new ArrayList<>();
        this.armorTypeProfs = new ArrayList<>();
        this.languageProfs = new ArrayList<>();
        this.savingThrowProfs = new ArrayList<>();
        this.skillProfs = new ArrayList<>();
        this.skillChoiceProfs = new ArrayList<>();
        this.toolCategoryProfs = new ArrayList<>();
        this.toolCategoryChoiceProfs = new ArrayList<>();
        this.toolProfs = new ArrayList<>();
        this.weaponProfs = new ArrayList<>();
        this.weaponTypeProfs = new ArrayList<>();
        this.spellConfigurations = new ArrayList<>();
        this.startingEquipment = new ArrayList<>();
        this.damageModifiers = new ArrayList<>();
        this.conditionImmunities = new ArrayList<>();
        this.senses = new ArrayList<>();
        this.miscModifiers = new ArrayList<>();
    }

    public Characteristic(String id, Characteristic parent, String name, int sid,
                          CharacteristicType characteristicType, List<Modifier> abilityModifiers,
                          List<Proficiency> armorProfs, List<Proficiency> armorTypeProfs, List<Proficiency> languageProfs,
                          List<Proficiency> savingThrowProfs, List<Proficiency> skillProfs, List<Proficiency> skillChoiceProfs,
                          List<Proficiency> toolCategoryProfs, List<Proficiency> toolCategoryChoiceProfs, List<Proficiency> toolProfs,
                          List<Proficiency> weaponProfs, List<Proficiency> weaponTypeProfs, List<SpellConfiguration> spellConfigurations,
                          List<StartingEquipment> startingEquipment, List<DamageModifier> damageModifiers,
                          List<ListObject> conditionImmunities, List<SenseValue> senses, List<Modifier> miscModifiers,
                          int numAbilities, int numLanguages, int numSavingThrows, int numSkills, int numTools, String spellCastingAbility) {
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.sid = sid;
        this.characteristicType = characteristicType;
        this.abilityModifiers = abilityModifiers;
        this.armorProfs = armorProfs;
        this.armorTypeProfs = armorTypeProfs;
        this.languageProfs = languageProfs;
        this.savingThrowProfs = savingThrowProfs;
        this.skillProfs = skillProfs;
        this.skillChoiceProfs = skillChoiceProfs;
        this.toolCategoryProfs = toolCategoryProfs;
        this.toolCategoryChoiceProfs = toolCategoryChoiceProfs;
        this.toolProfs = toolProfs;
        this.weaponProfs = weaponProfs;
        this.weaponTypeProfs = weaponTypeProfs;
        this.spellConfigurations = spellConfigurations;
        this.startingEquipment = startingEquipment;
        this.damageModifiers = damageModifiers;
        this.conditionImmunities = conditionImmunities;
        this.senses = senses;
        this.miscModifiers = miscModifiers;
        this.numAbilities = numAbilities;
        this.numLanguages = numLanguages;
        this.numSavingThrows = numSavingThrows;
        this.numSkills = numSkills;
        this.numTools = numTools;
        this.spellCastingAbility = spellCastingAbility;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Characteristic getParent() {
        return parent;
    }

    public void setParent(Characteristic parent) {
        this.parent = parent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public CharacteristicType getCharacteristicType() {
        return characteristicType;
    }

    public void setCharacteristicType(CharacteristicType characteristicType) {
        this.characteristicType = characteristicType;
    }

    public List<Modifier> getAbilityModifiers() {
        return abilityModifiers;
    }

    public void setAbilityModifiers(List<Modifier> abilityModifiers) {
        this.abilityModifiers = abilityModifiers;
    }

    public List<Proficiency> getArmorProfs() {
        return armorProfs;
    }

    public void setArmorProfs(List<Proficiency> armorProfs) {
        this.armorProfs = armorProfs;
    }

    public List<Proficiency> getArmorTypeProfs() {
        return armorTypeProfs;
    }

    public void setArmorTypeProfs(List<Proficiency> armorTypeProfs) {
        this.armorTypeProfs = armorTypeProfs;
    }

    public List<Proficiency> getLanguageProfs() {
        return languageProfs;
    }

    public void setLanguageProfs(List<Proficiency> languageProfs) {
        this.languageProfs = languageProfs;
    }

    public List<Proficiency> getSavingThrowProfs() {
        return savingThrowProfs;
    }

    public void setSavingThrowProfs(List<Proficiency> savingThrowProfs) {
        this.savingThrowProfs = savingThrowProfs;
    }

    public List<Proficiency> getSkillProfs() {
        return skillProfs;
    }

    public void setSkillProfs(List<Proficiency> skillProfs) {
        this.skillProfs = skillProfs;
    }

    public List<Proficiency> getSkillChoiceProfs() {
        return skillChoiceProfs;
    }

    public void setSkillChoiceProfs(List<Proficiency> skillChoiceProfs) {
        this.skillChoiceProfs = skillChoiceProfs;
    }

    public List<Proficiency> getToolCategoryProfs() {
        return toolCategoryProfs;
    }

    public void setToolCategoryProfs(List<Proficiency> toolCategoryProfs) {
        this.toolCategoryProfs = toolCategoryProfs;
    }

    public List<Proficiency> getToolCategoryChoiceProfs() {
        return toolCategoryChoiceProfs;
    }

    public void setToolCategoryChoiceProfs(List<Proficiency> toolCategoryChoiceProfs) {
        this.toolCategoryChoiceProfs = toolCategoryChoiceProfs;
    }

    public List<Proficiency> getToolProfs() {
        return toolProfs;
    }

    public void setToolProfs(List<Proficiency> toolProfs) {
        this.toolProfs = toolProfs;
    }

    public List<Proficiency> getWeaponProfs() {
        return weaponProfs;
    }

    public void setWeaponProfs(List<Proficiency> weaponProfs) {
        this.weaponProfs = weaponProfs;
    }

    public List<Proficiency> getWeaponTypeProfs() {
        return weaponTypeProfs;
    }

    public void setWeaponTypeProfs(List<Proficiency> weaponTypeProfs) {
        this.weaponTypeProfs = weaponTypeProfs;
    }

    public List<SpellConfiguration> getSpellConfigurations() {
        return spellConfigurations;
    }

    public void setSpellConfigurations(List<SpellConfiguration> spellConfigurations) {
        this.spellConfigurations = spellConfigurations;
    }

    public List<StartingEquipment> getStartingEquipment() {
        return startingEquipment;
    }

    public void setStartingEquipment(List<StartingEquipment> startingEquipment) {
        this.startingEquipment = startingEquipment;
    }

    public List<DamageModifier> getDamageModifiers() {
        return damageModifiers;
    }

    public void setDamageModifiers(List<DamageModifier> damageModifiers) {
        this.damageModifiers = damageModifiers;
    }

    public List<ListObject> getConditionImmunities() {
        return conditionImmunities;
    }

    public void setConditionImmunities(List<ListObject> conditionImmunities) {
        this.conditionImmunities = conditionImmunities;
    }

    public List<SenseValue> getSenses() {
        return senses;
    }

    public void setSenses(List<SenseValue> senses) {
        this.senses = senses;
    }

    public List<Modifier> getMiscModifiers() {
        return miscModifiers;
    }

    public void setMiscModifiers(List<Modifier> miscModifiers) {
        this.miscModifiers = miscModifiers;
    }

    public int getNumAbilities() {
        return numAbilities;
    }

    public void setNumAbilities(int numAbilities) {
        this.numAbilities = numAbilities;
    }

    public int getNumLanguages() {
        return numLanguages;
    }

    public void setNumLanguages(int numLanguages) {
        this.numLanguages = numLanguages;
    }

    public int getNumSavingThrows() {
        return numSavingThrows;
    }

    public void setNumSavingThrows(int numSavingThrows) {
        this.numSavingThrows = numSavingThrows;
    }

    public int getNumSkills() {
        return numSkills;
    }

    public void setNumSkills(int numSkills) {
        this.numSkills = numSkills;
    }

    public int getNumTools() {
        return numTools;
    }

    public void setNumTools(int numTools) {
        this.numTools = numTools;
    }

    public String getSpellCastingAbility() {
        return spellCastingAbility;
    }

    public void setSpellCastingAbility(String spellCastingAbility) {
        this.spellCastingAbility = spellCastingAbility;
    }
}
