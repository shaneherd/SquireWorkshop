package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.sharing.ShareList;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface ItemDetailsService {
    Item get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception;
    CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception;
    long create(Item item, int userId) throws Exception;
    boolean update(Item item, long itemId, int userId) throws Exception;
    long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception;
    void addToShareList(Item item, int userId, ShareList shareList) throws Exception;
}
