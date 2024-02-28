package com.herd.squire.services.items;

import com.herd.squire.models.items.magical_item.MagicalItemApplicabilityType;

public class MagicalItemApplicabilityApi {
    public MagicalItemApplicabilityType magicalItemApplicabilityType;
    public String item;
    public String filters;

    public MagicalItemApplicabilityApi(MagicalItemApplicabilityType magicalItemApplicabilityType, String item, String filters) {
        this.magicalItemApplicabilityType = magicalItemApplicabilityType;
        this.item = item;
        this.filters = filters;
    }
}
