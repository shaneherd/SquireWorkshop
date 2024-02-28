package com.herd.squire.models.items.weapon;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.attributes.WeaponProperty;
import com.herd.squire.models.attributes.WeaponType;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.items.CostUnit;
import com.herd.squire.models.items.EquipmentSlotType;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemType;

import java.util.ArrayList;
import java.util.List;

public class Weapon extends Item {
    private WeaponType weaponType;
    private WeaponRangeType rangeType;
    private int normalRange;
    private int longRange;
    private int attackMod;
    private List<WeaponProperty> properties;
    private List<DamageConfiguration> damages;
    private List<DamageConfiguration> versatileDamages;
    private ListObject ammoType;

    public Weapon() {
    }

    public Weapon(String id, String name, String description, int sid, boolean author, int version,
                  boolean expendable, boolean container, boolean ignoreWeight, int cost, CostUnit costUnit, double weight,
                  WeaponType weaponType, WeaponRangeType rangeType, int normalRange, int longRange, int attackMod, ListObject ammoType) {
        super(id, name, ItemType.WEAPON, description, sid, author, version, expendable, true, EquipmentSlotType.HAND, container, ignoreWeight, cost, costUnit, weight, weaponType.getId());
        this.weaponType = weaponType;
        this.rangeType = rangeType;
        this.normalRange = normalRange;
        this.longRange = longRange;
        this.attackMod = attackMod;
        this.properties = new ArrayList<>();
        this.damages = new ArrayList<>();
        this.versatileDamages = new ArrayList<>();
        this.ammoType = ammoType;
    }

    public WeaponType getWeaponType() {
        return weaponType;
    }

    public void setWeaponType(WeaponType weaponType) {
        this.weaponType = weaponType;
    }

    public WeaponRangeType getRangeType() {
        return rangeType;
    }

    public void setRangeType(WeaponRangeType rangeType) {
        this.rangeType = rangeType;
    }

    public int getNormalRange() {
        return normalRange;
    }

    public void setNormalRange(int normalRange) {
        this.normalRange = normalRange;
    }

    public int getLongRange() {
        return longRange;
    }

    public void setLongRange(int longRange) {
        this.longRange = longRange;
    }

    public int getAttackMod() {
        return attackMod;
    }

    public void setAttackMod(int attackMod) {
        this.attackMod = attackMod;
    }

    public List<WeaponProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<WeaponProperty> properties) {
        this.properties = properties;
    }

    public List<DamageConfiguration> getDamages() {
        return damages;
    }

    public void setDamages(List<DamageConfiguration> damages) {
        this.damages = damages;
    }

    public List<DamageConfiguration> getVersatileDamages() {
        return versatileDamages;
    }

    public void setVersatileDamages(List<DamageConfiguration> versatileDamages) {
        this.versatileDamages = versatileDamages;
    }

    public ListObject getAmmoType() {
        return ammoType;
    }

    public void setAmmoType(ListObject ammoType) {
        this.ammoType = ammoType;
    }
}
