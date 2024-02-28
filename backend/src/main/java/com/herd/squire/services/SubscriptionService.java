package com.herd.squire.services;

import com.herd.squire.models.SquireKey;
import com.herd.squire.models.paddle.PaddlePayment;
import com.herd.squire.models.user.User;
import com.herd.squire.models.user.UserTransaction;
import com.herd.squire.models.user.UserTransactionType;
import com.herd.squire.rest.SquireException;
import com.herd.squire.utilities.MySql;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class SubscriptionService {

    public static void subscribe(int userId, int months) throws SquireException {
        CallableStatement statement = null;
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call User_Subscribe (?,?)}");
            statement.setInt(1, userId);
            statement.setInt(2, months);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void expireSubscriptions() throws SquireException {
        CallableStatement statement = null;
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Expire_Subscriptions()}");
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /*********************** Generate Keys **************************/

    public void generateKeys(int count, int credits) throws IOException {
        List<SquireKey> keys = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            UUID token = UUID.randomUUID();
            keys.add(new SquireKey(token, credits));
        }
        writeInsertFile(keys);
        writeKeysFile(keys);
    }

    private void writeInsertFile(List<SquireKey> keys) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("database\\Scripts\\new\\squire_keys.sql"));
        String headerRow = "INSERT INTO `squire_keys` (token, credits) VALUES";
        writer.write(headerRow);
        writer.write("\n");

        List<String> rows = new ArrayList<>();
        for (SquireKey key : keys) {
            rows.add("('" + key.getToken().toString() + "', " + key.getCredits() + ")");
        }
        String keysStr = String.join(",\n", rows) + ";";
        writer.write(keysStr);
        writer.close();
    }

    private void writeKeysFile(List<SquireKey> keys) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("squire_keys.txt"));
        List<String> rows = new ArrayList<>();
        for (SquireKey key : keys) {
            rows.add(key.getToken().toString());
        }
        String keysStr = String.join("\n", rows);
        writer.write(keysStr);
        writer.close();
    }
}
