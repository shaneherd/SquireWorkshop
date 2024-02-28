package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.powers.AttackType;
import com.herd.squire.models.proficiency.Proficiency;

public class Spellcasting {
    private Proficiency proficiency;
    private AttackType attackType;

    public Spellcasting() {
        this.proficiency = new Proficiency(true);
        this.attackType = AttackType.ATTACK;
    }

    public Spellcasting(AttackType attackType) {
        this.proficiency = new Proficiency(true);
        this.attackType = attackType;
    }

    public Spellcasting(boolean prof, boolean doubleProf, boolean halfProf, boolean roundUp,
                        int miscModifier, boolean advantage, boolean disadvantage,
                        AttackType attackType) {
        this.proficiency = new Proficiency(null, prof, miscModifier, advantage, disadvantage, doubleProf, halfProf, roundUp);
        this.attackType = attackType;
    }

    public Proficiency getProficiency() {
        return proficiency;
    }

    public void setProficiency(Proficiency proficiency) {
        this.proficiency = proficiency;
    }

    public AttackType getAttackType() {
        return attackType;
    }

    public void setAttackType(AttackType attackType) {
        this.attackType = attackType;
    }
}
