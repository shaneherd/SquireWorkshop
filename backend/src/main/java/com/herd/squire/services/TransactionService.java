package com.herd.squire.services;

import com.herd.squire.models.user.UserTransaction;
import com.herd.squire.utilities.MySql;
import com.herd.squire.utilities.SquireLogger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.logging.Logger;

public class TransactionService {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    public static void logTransaction(Integer userId, UserTransaction userTransaction) {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO user_transactions (user_id, user_transaction_type_id, event_time, paddle_subscription_plan_id, paddle_product_id) VALUES (?,?,?,?,?)");
            MySql.setInteger(1, userId, statement);
            statement.setInt(2, userTransaction.getUserTransactionType().getValue());
            statement.setTimestamp(3, userTransaction.getEventTime());
            MySql.setLong(4, userTransaction.getPaddleSubscriptionPlanId(), statement);
            MySql.setLong(5, userTransaction.getPaddleProductId(), statement);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            logger.warning(e.getMessage());
            MySql.closeConnections(null, statement, connection);
        }
    }
}
