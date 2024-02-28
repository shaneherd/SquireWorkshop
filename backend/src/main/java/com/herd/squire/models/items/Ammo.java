package com.herd.squire.models.items;

import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.damages.DamageConfiguration;

import java.util.ArrayList;
import java.util.List;

public class Ammo extends Item {
    private int attackModifier;
    private Ability attackAbilityModifier;
    private List<DamageConfiguration> damages;

    public Ammo() {}

    public Ammo(String id, String name, String description, int sid, boolean author, int version,
                int cost, CostUnit costUnit, double weight,
                int attackModifier, Ability attackAbilityModifier) {
        super(id, name, ItemType.AMMO, description, sid, author, version, true, false, null, false, false, cost, costUnit, weight);
        this.attackModifier = attackModifier;
        this.attackAbilityModifier = attackAbilityModifier;
        this.damages = new ArrayList<>();
    }

    public int getAttackModifier() {
        return attackModifier;
    }

    public void setAttackModifier(int attackModifier) {
        this.attackModifier = attackModifier;
    }

    public Ability getAttackAbilityModifier() {
        return attackAbilityModifier;
    }

    public void setAttackAbilityModifier(Ability attackAbilityModifier) {
        this.attackAbilityModifier = attackAbilityModifier;
    }

    public List<DamageConfiguration> getDamages() {
        return damages;
    }

    public void setDamages(List<DamageConfiguration> damages) {
        this.damages = damages;
    }
}
