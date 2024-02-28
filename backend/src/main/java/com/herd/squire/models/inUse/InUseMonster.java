package com.herd.squire.models.inUse;

public class InUseMonster extends InUse {
    public InUseMonster() {
        super();
    }

    public InUseMonster(String id, String name, boolean required) {
        super(id, name, required, InUseType.MONSTER);
    }
}
