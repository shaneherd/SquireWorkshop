package com.herd.squire.models.creatures;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.SenseValue;
import com.herd.squire.models.creatures.characters.PlayerCharacter;
import com.herd.squire.models.creatures.companions.Companion;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.items.ItemProficiency;
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
        @JsonSubTypes.Type(value = PlayerCharacter.class, name = "PlayerCharacter"),
        @JsonSubTypes.Type(value = Companion.class, name = "Companion")
})
public class Creature {
    protected String id;
    protected String name;
    protected CreatureType creatureType;
    protected int sid;
    protected int version;

    protected List<CreatureAbilityScore> abilityScores;
    protected CreatureSpellCasting creatureSpellCasting;
    protected CreatureSpellCasting innateSpellCasting;
    protected CreatureWealth creatureWealth;
    protected ListObject alignment;
    protected CreatureHealth creatureHealth;

    protected List<Proficiency> attributeProfs;
    protected List<ItemProficiency> itemProfs;
    protected List<DamageModifier> damageModifiers;
    protected List<ListObject> conditionImmunities;
    protected List<SenseValue> senses;
    protected List<ActiveCondition> activeConditions;

    protected List<CreatureItem> items;

    private List<CreatureFilter> filters;
    private List<CreatureSort> sorts;

    //Attributes
    private List<ListObject> conditions;
    private List<ListObject> skills;
    private List<ListObject> acAbilities;

    public Creature() {}

    public Creature(String id, String name, CreatureType creatureType, int sid, int version, ListObject alignment) {
        this.id = id;
        this.name = name;
        this.creatureType = creatureType;
        this.sid = sid;
        this.version = version;
        this.abilityScores = new ArrayList<>();
        this.alignment = alignment;

        this.filters = new ArrayList<>();
        this.sorts = new ArrayList<>();
        this.creatureSpellCasting = new CreatureSpellCasting();
        this.innateSpellCasting = new CreatureSpellCasting();
        this.creatureWealth = new CreatureWealth();
        this.creatureHealth = new CreatureHealth();
        this.attributeProfs = new ArrayList<>();
        this.itemProfs = new ArrayList<>();
        this.damageModifiers = new ArrayList<>();
        this.conditionImmunities = new ArrayList<>();
        this.senses = new ArrayList<>();
        this.activeConditions = new ArrayList<>();
        this.items = new ArrayList<>();
        this.conditions = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.acAbilities = new ArrayList<>();
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

    public CreatureType getCreatureType() {
        return creatureType;
    }

    public void setCreatureType(CreatureType creatureType) {
        this.creatureType = creatureType;
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

    public List<CreatureAbilityScore> getAbilityScores() {
        return abilityScores;
    }

    public void setAbilityScores(List<CreatureAbilityScore> abilityScores) {
        this.abilityScores = abilityScores;
    }

    public CreatureSpellCasting getCreatureSpellCasting() {
        return creatureSpellCasting;
    }

    public void setCreatureSpellCasting(CreatureSpellCasting creatureSpellCasting) {
        this.creatureSpellCasting = creatureSpellCasting;
    }

    public CreatureSpellCasting getInnateSpellCasting() {
        return innateSpellCasting;
    }

    public void setInnateSpellCasting(CreatureSpellCasting innateSpellCasting) {
        this.innateSpellCasting = innateSpellCasting;
    }

    public CreatureWealth getCreatureWealth() {
        return creatureWealth;
    }

    public void setCreatureWealth(CreatureWealth creatureWealth) {
        this.creatureWealth = creatureWealth;
    }

    public ListObject getAlignment() {
        return alignment;
    }

    public void setAlignment(ListObject alignment) {
        this.alignment = alignment;
    }

    public CreatureHealth getCreatureHealth() {
        return creatureHealth;
    }

    public void setCreatureHealth(CreatureHealth creatureHealth) {
        this.creatureHealth = creatureHealth;
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

    public List<ActiveCondition> getActiveConditions() {
        return activeConditions;
    }

    public void setActiveConditions(List<ActiveCondition> activeConditions) {
        this.activeConditions = activeConditions;
    }

    public List<CreatureItem> getItems() {
        return items;
    }

    public void setItems(List<CreatureItem> items) {
        this.items = items;
    }

    public List<CreatureFilter> getFilters() {
        return filters;
    }

    public void setFilters(List<CreatureFilter> filters) {
        this.filters = filters;
    }

    public List<CreatureSort> getSorts() {
        return sorts;
    }

    public void setSorts(List<CreatureSort> sorts) {
        this.sorts = sorts;
    }

    public List<ListObject> getConditions() {
        return conditions;
    }

    public void setConditions(List<ListObject> conditions) {
        this.conditions = conditions;
    }

    public List<ListObject> getSkills() {
        return skills;
    }

    public void setSkills(List<ListObject> skills) {
        this.skills = skills;
    }

    public List<ListObject> getAcAbilities() {
        return acAbilities;
    }

    public void setAcAbilities(List<ListObject> acAbilities) {
        this.acAbilities = acAbilities;
    }
}
