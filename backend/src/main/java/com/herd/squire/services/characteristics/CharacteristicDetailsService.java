package com.herd.squire.services.characteristics;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public interface CharacteristicDetailsService {
    Characteristic get(Statement statement, ResultSet resultSet, int userId) throws Exception;
    CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, boolean includeChildren, boolean authorOnly, ListSource listSource) throws Exception;
    long create(Characteristic characteristic, int userId) throws Exception;
    boolean update(Characteristic characteristic, long id, int userId) throws Exception;
    String duplicate(Characteristic characteristic, int userId) throws Exception;
    long addToMyStuff(Characteristic authorCharacteristic, int authorUserId, ListObject existingCharacteristic, int userId) throws Exception;
    void addToShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception;
    void addToUnShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception;
}
