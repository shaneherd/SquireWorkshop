package com.herd.squire.models.monsters;

import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

import java.util.ArrayList;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = MonsterAction.class, name = "Action"),
        @JsonSubTypes.Type(value = MonsterFeature.class, name = "Feature")
})
public class MonsterPower {
    protected String id;
    protected String name;
    protected int sid;
    protected boolean author;
    protected int version;
    protected MonsterPowerType monsterPowerType;
    protected LimitedUse limitedUse;
    protected int rechargeMin;
    protected int rechargeMax;
    protected List<ModifierConfiguration> modifierConfigurations;

    public MonsterPower() {
        this.modifierConfigurations = new ArrayList<>();
    }

    public MonsterPower(String id, String name, int sid, boolean author, int version,
                        MonsterPowerType monsterPowerType, LimitedUse limitedUse, int rechargeMin,
                        int rechargeMax) {
        this.id = id;
        this.name = name;
        this.sid = sid;
        this.author = author;
        this.version = version;
        this.monsterPowerType = monsterPowerType;
        this.limitedUse = limitedUse;
        this.rechargeMin = rechargeMin;
        this.rechargeMax = rechargeMax;
        this.modifierConfigurations = new ArrayList<>();
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

    public MonsterPowerType getMonsterPowerType() {
        return monsterPowerType;
    }

    public void setMonsterPowerType(MonsterPowerType monsterPowerType) {
        this.monsterPowerType = monsterPowerType;
    }

    public LimitedUse getLimitedUse() {
        return limitedUse;
    }

    public void setLimitedUse(LimitedUse limitedUse) {
        this.limitedUse = limitedUse;
    }

    public int getRechargeMin() {
        return rechargeMin;
    }

    public void setRechargeMin(int rechargeMin) {
        this.rechargeMin = rechargeMin;
    }

    public int getRechargeMax() {
        return rechargeMax;
    }

    public void setRechargeMax(int rechargeMax) {
        this.rechargeMax = rechargeMax;
    }

    public List<ModifierConfiguration> getModifierConfigurations() {
        return modifierConfigurations;
    }

    public void setModifierConfigurations(List<ModifierConfiguration> modifierConfigurations) {
        this.modifierConfigurations = modifierConfigurations;
    }
}
