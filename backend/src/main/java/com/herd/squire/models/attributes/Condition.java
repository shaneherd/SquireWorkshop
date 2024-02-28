package com.herd.squire.models.attributes;

import com.herd.squire.models.ListObject;

import java.util.ArrayList;
import java.util.List;

public class Condition extends Attribute {
    private List<ListObject> connectingConditions;

    public Condition() {}

    public Condition(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.CONDITION, sid, author, version);
        this.connectingConditions = new ArrayList<>();
    }

    public Condition(String id, String name, String description, int sid, boolean author, int version, List<ListObject> connectingConditions) {
        super(id, name, description, AttributeType.CONDITION, sid, author, version);
        this.connectingConditions = connectingConditions;
    }

    public List<ListObject> getConnectingConditions() {
        return connectingConditions;
    }

    public void setConnectingConditions(List<ListObject> connectingConditions) {
        this.connectingConditions = connectingConditions;
    }
}
