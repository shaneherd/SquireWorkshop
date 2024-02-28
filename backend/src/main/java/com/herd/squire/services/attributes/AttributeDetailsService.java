package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface AttributeDetailsService {
    Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception;
    long create(Attribute attribute, int userId) throws Exception;
    boolean update(Attribute attribute, long id, int userId) throws Exception;
    long addToMyStuff(Attribute authorAttribute, int authorUserId, ListObject existingAttribute, int userId) throws Exception;
    void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception;
}
