package com.herd.squire.services.creatures;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.creatures.Creature;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface CreatureDetailsService {
    Creature get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, ListSource listSource) throws Exception;
    long create(Creature creature, int userId) throws Exception;
    boolean update(Creature creature, long id, int userId) throws Exception;
    long addToMyStuff(Creature authorCreature, int authorUserId, ListObject existingCreature, int userId) throws Exception;
    void addToShareList(Creature creature, int userId, ShareList shareList) throws Exception;
}
