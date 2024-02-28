package com.herd.squire.models.inUse;

import com.herd.squire.models.attributes.AttributeType;

public class InUseAttribute extends InUse {
    private AttributeType attributeType;

    public InUseAttribute() {
        super();
    }

    public InUseAttribute(int subTypeId, String id, String name, boolean required) {
        super(id, name, required, InUseType.ATTRIBUTE);
        this.attributeType = AttributeType.valueOf(subTypeId);
    }

    public AttributeType getAttributeType() {
        return attributeType;
    }

    public void setAttributeType(AttributeType attributeType) {
        this.attributeType = attributeType;
    }
}
