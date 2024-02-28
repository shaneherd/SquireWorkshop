package com.herd.squire.models.monsters;

import com.herd.squire.models.*;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.items.ItemProficiency;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.proficiency.Proficiency;

import java.util.ArrayList;
import java.util.List;

public class Monster {
    private String id;
    private String name;
    private int sid;
    private int version;

    private List<MonsterAbilityScore> abilityScores;
    private String spellcastingAbility;
    private ListObject alignment;

    private List<Proficiency> attributeProfs;
    private List<ItemProficiency> itemProfs;
    private List<DamageModifier> damageModifiers;
    private List<ListObject> conditionImmunities;
    private List<SenseValue> senses;

    private MonsterType monsterType;
    private String typeVariation;
    private Size size;
    private ChallengeRating challengeRating;
    private int experience;
    private boolean hover;
    private int legendaryPoints;
    private boolean author;
    private String description;
    private int ac;
    private DiceCollection hitDice;
    private List<Speed> speeds;
    private ListObject casterType;
    private ListObject spellcasterLevel;
    private int spellAttackModifier;
    private int spellSaveModifier;
    private SpellSlots spellSlots;
    private List<SpellConfiguration> spells;
    private boolean spellcaster;
    private boolean innateSpellcaster;
    private ListObject innateSpellcasterLevel;
    private String innateSpellcastingAbility;
    private int innateSpellAttackModifier;
    private int innateSpellSaveModifier;
    private List<InnateSpellConfiguration> innateSpells;
    private List<ItemQuantity> items;

    public Monster() {
        this.spellSlots = new SpellSlots();
        this.speeds = new ArrayList<>();
        this.abilityScores = new ArrayList<>();
        this.damageModifiers = new ArrayList<>();
        this.conditionImmunities = new ArrayList<>();
        this.senses = new ArrayList<>();
        this.attributeProfs = new ArrayList<>();
        this.itemProfs = new ArrayList<>();
        this.spells = new ArrayList<>();
        this.innateSpells = new ArrayList<>();
        this.items = new ArrayList<>();
    }

    public Monster(String id, String name, int sid, int version, ListObject alignment,
                   MonsterType monsterType, String typeVariation, Size size, ChallengeRating challengeRating,
                   int experience, boolean hover, int legendaryPoints, boolean author,
                   String description, int ac, DiceCollection hitDice, boolean spellcaster, ListObject casterType, ListObject spellcasterLevel,
                   int spellAttackModifier, int spellSaveModifier, String spellcastingAbility, boolean innateSpellcaster,
                   ListObject innateSpellcasterLevel, int innateSpellAttackModifier, int innateSpellSaveModifier, String innateSpellcastingAbility) {
        this.id = id;
        this.name = name;
        this.sid = sid;
        this.version = version;
        this.alignment = alignment;
        this.monsterType = monsterType;
        this.typeVariation = typeVariation;
        this.size = size;
        this.challengeRating = challengeRating;
        this.experience = experience;
        this.hover = hover;
        this.legendaryPoints = legendaryPoints;
        this.author = author;
        this.description = description;
        this.ac = ac;
        this.hitDice = hitDice;
        this.spellcaster = spellcaster;
        this.casterType = casterType;
        this.spellcasterLevel = spellcasterLevel;
        this.spellAttackModifier = spellAttackModifier;
        this.spellSaveModifier = spellSaveModifier;
        this.spellcastingAbility = spellcastingAbility;
        this.innateSpellcaster = innateSpellcaster;
        this.innateSpellcasterLevel = innateSpellcasterLevel;
        this.innateSpellAttackModifier = innateSpellAttackModifier;
        this.innateSpellSaveModifier = innateSpellSaveModifier;
        this.innateSpellcastingAbility = innateSpellcastingAbility;

        this.spellSlots = new SpellSlots();
        this.speeds = new ArrayList<>();
        this.abilityScores = new ArrayList<>();
        this.damageModifiers = new ArrayList<>();
        this.conditionImmunities = new ArrayList<>();
        this.senses = new ArrayList<>();
        this.attributeProfs = new ArrayList<>();
        this.itemProfs = new ArrayList<>();
        this.spells = new ArrayList<>();
        this.innateSpells = new ArrayList<>();
        this.items = new ArrayList<>();
    }

    public MonsterType getMonsterType() {
        return monsterType;
    }

    public void setMonsterType(MonsterType monsterType) {
        this.monsterType = monsterType;
    }

    public String getTypeVariation() {
        return typeVariation;
    }

    public void setTypeVariation(String typeVariation) {
        this.typeVariation = typeVariation;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
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

    public boolean isHover() {
        return hover;
    }

    public void setHover(boolean hover) {
        this.hover = hover;
    }

    public int getLegendaryPoints() {
        return legendaryPoints;
    }

    public void setLegendaryPoints(int legendaryPoints) {
        this.legendaryPoints = legendaryPoints;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAc() {
        return ac;
    }

    public void setAc(int ac) {
        this.ac = ac;
    }

    public DiceCollection getHitDice() {
        return hitDice;
    }

    public void setHitDice(DiceCollection hitDice) {
        this.hitDice = hitDice;
    }

    public List<Speed> getSpeeds() {
        return speeds;
    }

    public void setSpeeds(List<Speed> speeds) {
        this.speeds = speeds;
    }

    public boolean isSpellcaster() {
        return spellcaster;
    }

    public void setSpellcaster(boolean spellcaster) {
        this.spellcaster = spellcaster;
    }

    public ListObject getCasterType() {
        return casterType;
    }

    public void setCasterType(ListObject casterType) {
        this.casterType = casterType;
    }

    public ListObject getSpellcasterLevel() {
        return spellcasterLevel;
    }

    public void setSpellcasterLevel(ListObject spellcasterLevel) {
        this.spellcasterLevel = spellcasterLevel;
    }

    public int getSpellAttackModifier() {
        return spellAttackModifier;
    }

    public void setSpellAttackModifier(int spellAttackModifier) {
        this.spellAttackModifier = spellAttackModifier;
    }

    public int getSpellSaveModifier() {
        return spellSaveModifier;
    }

    public void setSpellSaveModifier(int spellSaveModifier) {
        this.spellSaveModifier = spellSaveModifier;
    }

    public SpellSlots getSpellSlots() {
        return spellSlots;
    }

    public void setSpellSlots(SpellSlots spellSlots) {
        this.spellSlots = spellSlots;
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

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public List<MonsterAbilityScore> getAbilityScores() {
        return abilityScores;
    }

    public void setAbilityScores(List<MonsterAbilityScore> abilityScores) {
        this.abilityScores = abilityScores;
    }

    public ListObject getAlignment() {
        return alignment;
    }

    public void setAlignment(ListObject alignment) {
        this.alignment = alignment;
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

    public String getSpellcastingAbility() {
        return spellcastingAbility;
    }

    public void setSpellcastingAbility(String spellcastingAbility) {
        this.spellcastingAbility = spellcastingAbility;
    }

    public List<Proficiency> getAttributeProfs() {
        return attributeProfs;
    }

    public void setAttributeProfs(List<Proficiency> attributeProfs) {
        this.attributeProfs = attributeProfs;
    }

    public List<ItemProficiency> getItemProfs() {
        return itemProfs;
    }

    public void setItemProfs(List<ItemProficiency> itemProfs) {
        this.itemProfs = itemProfs;
    }

    public List<SpellConfiguration> getSpells() {
        return spells;
    }

    public void setSpells(List<SpellConfiguration> spells) {
        this.spells = spells;
    }

    public boolean isInnateSpellcaster() {
        return innateSpellcaster;
    }

    public void setInnateSpellcaster(boolean innateSpellcaster) {
        this.innateSpellcaster = innateSpellcaster;
    }

    public ListObject getInnateSpellcasterLevel() {
        return innateSpellcasterLevel;
    }

    public void setInnateSpellcasterLevel(ListObject innateSpellcasterLevel) {
        this.innateSpellcasterLevel = innateSpellcasterLevel;
    }

    public String getInnateSpellcastingAbility() {
        return innateSpellcastingAbility;
    }

    public void setInnateSpellcastingAbility(String innateSpellcastingAbility) {
        this.innateSpellcastingAbility = innateSpellcastingAbility;
    }

    public int getInnateSpellAttackModifier() {
        return innateSpellAttackModifier;
    }

    public void setInnateSpellAttackModifier(int innateSpellAttackModifier) {
        this.innateSpellAttackModifier = innateSpellAttackModifier;
    }

    public int getInnateSpellSaveModifier() {
        return innateSpellSaveModifier;
    }

    public void setInnateSpellSaveModifier(int innateSpellSaveModifier) {
        this.innateSpellSaveModifier = innateSpellSaveModifier;
    }

    public List<InnateSpellConfiguration> getInnateSpells() {
        return innateSpells;
    }

    public void setInnateSpells(List<InnateSpellConfiguration> innateSpells) {
        this.innateSpells = innateSpells;
    }

    public List<ItemQuantity> getItems() {
        return items;
    }

    public void setItems(List<ItemQuantity> items) {
        this.items = items;
    }
}
