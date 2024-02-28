package com.herd.squire.models.creatures;

import com.herd.squire.models.Action;
import com.herd.squire.models.powers.FeatureListObject;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.PowerType;

import java.util.List;

public class CreatureFeature extends CreaturePower {
    private FeatureListObject feature;
    private Action action;

    public CreatureFeature() {}

    public CreatureFeature(String id, FeatureListObject feature, boolean active, String activeTargetCreatureId, int usesRemaining, boolean hidden,
                           boolean rechargeOnShortRest, boolean rechargeOnLongRest, List<LimitedUse> limitedUses,
                           boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers, Action action) {
        super(id, feature.getId(), feature.getName(), PowerType.FEATURE, feature.getCharacteristicType(), feature.getCharacteristic() == null ? "0" : feature.getCharacteristic().getId(),
                hidden, active, activeTargetCreatureId, usesRemaining, rechargeOnShortRest, rechargeOnLongRest, limitedUses, extraModifiers, modifiersNumLevelsAboveBase, advancementModifiers);
        this.feature = feature;
        this.action = action;
    }

    public FeatureListObject getFeature() {
        return feature;
    }

    public void setFeature(FeatureListObject feature) {
        this.feature = feature;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }
}
