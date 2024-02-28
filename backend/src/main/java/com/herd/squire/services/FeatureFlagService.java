package com.herd.squire.services;

import com.herd.squire.models.FeatureFlag;
import com.herd.squire.utilities.MySql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class FeatureFlagService {
    public static List<FeatureFlag> getFeatureFlags() {
        List<FeatureFlag> featureFlags = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT id, name, description, enabled FROM feature_flags");
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                featureFlags.add(getFeatureFlag(resultSet));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return featureFlags;
    }

    private static FeatureFlag getFeatureFlag(ResultSet resultSet) throws SQLException {
        return new FeatureFlag(
                resultSet.getInt("id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBoolean("enabled")
        );
    }
}
