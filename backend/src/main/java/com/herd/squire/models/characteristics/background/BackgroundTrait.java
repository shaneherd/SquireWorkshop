package com.herd.squire.models.characteristics.background;

import com.herd.squire.models.characteristics.BackgroundTraitType;

public class BackgroundTrait {
    private String id;
    private BackgroundTraitType backgroundTraitType;
    private String description;

    public BackgroundTrait() {
        backgroundTraitType = BackgroundTraitType.NONE;
    }

    public BackgroundTrait(String id, BackgroundTraitType backgroundTraitType, String description) {
        this.id = id;
        this.backgroundTraitType = backgroundTraitType;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BackgroundTraitType getBackgroundTraitType() {
        return backgroundTraitType;
    }

    public void setBackgroundTraitType(BackgroundTraitType backgroundTraitType) {
        this.backgroundTraitType = backgroundTraitType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
