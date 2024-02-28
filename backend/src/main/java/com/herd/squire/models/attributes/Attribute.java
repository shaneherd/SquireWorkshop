package com.herd.squire.models.attributes;

import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Ability.class, name = "Ability"),
        @JsonSubTypes.Type(value = AreaOfEffect.class, name = "AreaOfEffect"),
        @JsonSubTypes.Type(value = ArmorType.class, name = "ArmorType"),
        @JsonSubTypes.Type(value = CasterType.class, name = "CasterType"),
        @JsonSubTypes.Type(value = Condition.class, name = "Condition"),
        @JsonSubTypes.Type(value = DamageType.class, name = "DamageType"),
        @JsonSubTypes.Type(value = Language.class, name = "Language"),
        @JsonSubTypes.Type(value = Skill.class, name = "Skill"),
        @JsonSubTypes.Type(value = ToolCategory.class, name = "ToolCategory"),
        @JsonSubTypes.Type(value = WeaponProperty.class, name = "WeaponProperty"),
        @JsonSubTypes.Type(value = WeaponType.class, name = "WeaponType"),
        @JsonSubTypes.Type(value = SpellSchool.class, name = "SpellSchool"),
        @JsonSubTypes.Type(value = CharacterLevel.class, name = "CharacterLevel"),
        @JsonSubTypes.Type(value = Alignment.class, name = "Alignment"),
        @JsonSubTypes.Type(value = DeityCategory.class, name = "DeityCategory"),
        @JsonSubTypes.Type(value = Deity.class, name = "Deity"),
        @JsonSubTypes.Type(value = Misc.class, name = "Misc"),
})
public class Attribute {
    protected String id;
    protected String name;
    protected String description;
    protected AttributeType attributeType;
    protected int sid;
    protected boolean author;
    protected int version;

    public Attribute() {}

    public Attribute(String id) {
        this.id = id;
    }

    public Attribute(String id, String name, String description, int sid) {
        this.id = id;
        this.name = name;
        this.attributeType = AttributeType.NONE;
        this.description = description;
        this.sid = sid;
    }

    public Attribute(String id, String name, String description, AttributeType attributeType, int sid, boolean author, int version) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.attributeType = attributeType;
        this.sid = sid;
        this.author = author;
        this.version = version;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AttributeType getAttributeType() {
        return attributeType;
    }

    public void setAttributeType(AttributeType attributeType) {
        this.attributeType = attributeType;
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
}
