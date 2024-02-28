package com.herd.squire.models.proficiency;

import com.herd.squire.models.ListObject;

public class ProficiencyListObject extends ListObject {
    private ProficiencyType proficiencyType;
    private String categoryId;

    public ProficiencyListObject() {
        super();
    }

    public ProficiencyListObject(String id, String name, String description, int sid, ProficiencyType proficiencyType) {
        super(id, name, description, sid, false);
        this.proficiencyType = proficiencyType;
    }

    public ProficiencyListObject(String id, String name, String description, int sid, ProficiencyType proficiencyType, String categoryId) {
        super(id, name, description, sid, false);
        this.proficiencyType = proficiencyType;
        this.categoryId = categoryId;
    }

    public ProficiencyListObject(String id, String name, String description, int sid, boolean author, ProficiencyType proficiencyType) {
        super(id, name, description, sid, author);
        this.proficiencyType = proficiencyType;
    }

    public ProficiencyType getProficiencyType() {
        return proficiencyType;
    }

    public void setProficiencyType(ProficiencyType proficiencyType) {
        this.proficiencyType = proficiencyType;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}
