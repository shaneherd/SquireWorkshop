package com.herd.squire.services.monsters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.monsters.MonsterPower;
import com.herd.squire.models.sharing.ShareList;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface MonsterPowerDetailsService {
    MonsterPower get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    List<MonsterPower> getPowers(long monsterId, int userId) throws Exception;
    long create(long monsterId, MonsterPower power, int userId) throws Exception;
    boolean update(long monsterId, MonsterPower power, long powerId, int userId) throws Exception;
    long addToMyStuff(long monsterId, MonsterPower authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception;
    void addToShareList(MonsterPower power, int userId, ShareList shareList) throws Exception;
}
