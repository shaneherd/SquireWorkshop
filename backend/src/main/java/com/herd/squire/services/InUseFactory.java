package com.herd.squire.services;

import com.herd.squire.models.inUse.*;
import com.herd.squire.utilities.MySql;

import java.sql.ResultSet;

public class InUseFactory {
    public static InUse getInUse(ResultSet resultSet, int userId) throws Exception {
        InUseType inUseType = InUseType.valueOf(resultSet.getInt("type_id"));
        int subTypeId = resultSet.getInt("sub_type_id");
        String id = MySql.encodeId(resultSet.getLong("id"), userId);
        String name = resultSet.getString("name");
        boolean required = resultSet.getBoolean("required");

        switch (inUseType) {
            case ATTRIBUTE:
                return new InUseAttribute(subTypeId, id, name, required);
            case CHARACTERISTIC:
                return new InUseCharacteristic(subTypeId, id, name, required);
            case POWER:
                return new InUsePower(subTypeId, id, name, required);
            case ITEM:
                return new InUseItem(subTypeId, id, name, required);
            case CREATURE:
                return new InUseCreature(subTypeId, id, name, required);
            case MONSTER:
                return new InUseMonster(id, name, required);
        }

        return null;
    }
}
