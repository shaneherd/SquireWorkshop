package com.herd.squire.services.powers;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.powers.Power;
import com.herd.squire.models.sharing.ShareList;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface PowerDetailsService {
    Power get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception;
    long create(Power power, int userId) throws Exception;
    boolean update(Power power, long powerId, int userId) throws Exception;
    long addToMyStuff(Power authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception;
    void addToShareList(Power power, int userId, ShareList shareList) throws Exception;
}
