package com.herd.squire.services;

import com.herd.squire.models.Notification;
import com.herd.squire.models.SupportRequest;
import com.herd.squire.models.SupportRequestStatus;
import com.herd.squire.models.user.*;
import com.herd.squire.services.creatures.characters.CharacterService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class UserService {
    private static final boolean DEFAULT_GRANT_ADMIN_ACCESS = false;

    /************* Create User *************/

    public static int createUser(String username, String password, String salt, String email) throws Exception {
        int id = -1;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareStatement("INSERT INTO users (username, password, salt, email, role) VALUES (?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, username.toLowerCase());
            statement.setString(2, password);
            statement.setString(3, salt);
            statement.setString(4, email);
            statement.setString(5, UserRole.BASIC.toString());
            statement.executeUpdate();
            id = MySql.getGeneratedId(statement);

            createUserSettings(id, connection);
            createUserSubscription(id, connection);
            createUserDefaults(id, connection);

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    public static int addNotification(String title, String message) throws Exception {
        int id = 0;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareStatement("INSERT INTO notifications (title, message) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, MySql.getValue(title, 255));
            statement.setString(2, MySql.getValue(message, 9999));
            statement.executeUpdate();
            id = MySql.getGeneratedId(statement);
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return id;
    }

    public static void addUserNotification(int userId, int notificationId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareStatement("INSERT INTO user_notifications (user_id, notification_id, acknowledged) VALUES (?, ?, ?)");
            statement.setInt(1, userId);
            statement.setInt(2, notificationId);
            statement.setBoolean(3, false);
            statement.executeUpdate();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void createUserSettings(int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO user_settings VALUES (?, ?, ?, ?)");
            statement.setInt(1, userId);
            statement.setBoolean(2, DEFAULT_GRANT_ADMIN_ACCESS);
            statement.setString(3, "en_US"); //language
            statement.setBoolean(4, true); //subscribed
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void createUserSubscription(int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, 1);

            statement = connection.prepareStatement("INSERT INTO user_subscriptions (user_id, user_subscription_type_id, expiration) VALUES (?,?,?)");
            statement.setInt(1, userId);
            statement.setInt(2, UserSubscriptionType.LIFETIME.getValue());
            statement.setTimestamp(3, new Timestamp(cal.getTimeInMillis()));
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void createUserDefaults(int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("CALL User_Defaults(?)");
            statement.setInt(1, userId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /************* Get User *************/

    public static List<Integer> getUsers() throws Exception {
        List<Integer> users = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT id FROM users u");
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                users.add(resultSet.getInt("id"));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return users;
    }

    public static User getUser(int userId) throws Exception {
        User user = null;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM users u JOIN user_settings us ON us.user_id = u.id JOIN user_subscriptions s on u.id = s.user_id WHERE u.id = ?");
            statement.setInt(1, userId);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                user = getUser(resultSet);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return user;
    }

    public static User getUser(String username) throws Exception {
        User user = null;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM users u JOIN user_settings us ON us.user_id = u.id JOIN user_subscriptions s on u.id = s.user_id WHERE username = ?");
            statement.setString(1, username.toLowerCase());
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                user = getUser(resultSet);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return user;
    }

    public static User getUserByEmail(String email) throws Exception {
        User user = null;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM users u JOIN user_settings us ON us.user_id = u.id JOIN user_subscriptions s on u.id = s.user_id WHERE email = ?");
            statement.setString(1, email);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                user = getUser(resultSet);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return user;
    }

    private static User getUser(ResultSet resultSet) throws SQLException {
        return new User(
                resultSet.getInt("id"),
                resultSet.getString("username"),
                resultSet.getString("password"),
                resultSet.getString("salt"),
                resultSet.getString("email"),
                resultSet.getBoolean("admin"),
                resultSet.getTimestamp("lastLogin"),
                resultSet.getInt("numFailedLogins"),
                resultSet.getBoolean("emailVerified"),
                resultSet.getBoolean("locked"),
                UserRole.valueOf(resultSet.getString("role")),
                resultSet.getBoolean("beta"),
                getUserSettings(resultSet),
                getUserSubscription(resultSet)
        );
    }

    private static UserSubscription getUserSubscription(ResultSet resultSet) throws SQLException {
        return new UserSubscription(
                UserSubscriptionType.valueOf(resultSet.getInt("user_subscription_type_id")),
                resultSet.getTimestamp("expiration"),
                resultSet.getLong("paddle_subscription_id"),
                resultSet.getLong("paddle_subscription_plan_id"),
                resultSet.getString("paddle_subscription_status"),
                resultSet.getString("paddle_update_url"),
                resultSet.getString("paddle_cancel_url"),
                resultSet.getDate("next_bill_date")
        );
    }

    private static UserSettings getUserSettings(ResultSet resultSet) throws SQLException {
        return new UserSettings(
                resultSet.getBoolean("allow_admin_access"),
                resultSet.getBoolean("subscribed"),
                resultSet.getString("language")
        );
    }

    /************* Update User *************/

    public static void updateUserSettings(int userId, UserSettings userSettings) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE user_settings SET allow_admin_access=?, subscribed=?, language=? WHERE user_id=?");
            statement.setBoolean(1, userSettings.isAllowAdminAccess());
            statement.setBoolean(2, userSettings.isSubscribed());
            statement.setString(3, userSettings.getLanguage());
            statement.setInt(4, userId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************* Delete User *************/

    public static void deleteUser(int userId, String password) throws Exception {
        User user = getUser(userId);
        if (user == null) {
            throw new Exception("Invalid user id");
        }

        if (password != null) {
            String passwordHash = AuthenticationService.getSecurePassword(password, user.getSalt());
            if (!passwordHash.equals(user.getPassword())) {
                throw new Exception("Invalid password");
            }
        }

        deleteUserImages(userId);

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call User_Delete (?)}");
            statement.setInt(1, userId);
            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void deleteUserImages(int userId) {
        ImageService.deleteUserImages(userId, CharacterService.CHARACTER_IMAGE_DIRECTORY);
    }

    private static void deleteUserItems(int userId, Connection connection) throws Exception {
        deleteUserImages(userId);
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("CALL User_Delete_Items(?)");
            statement.setInt(1, userId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void restoreDefaults(int userId, String password) throws Exception {
        User user = getUser(userId);
        if (user == null) {
            throw new Exception("Invalid user id");
        }

        String passwordHash = AuthenticationService.getSecurePassword(password, user.getSalt());
        if (!passwordHash.equals(user.getPassword())) {
            throw new Exception("Invalid password");
        }

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deleteUserItems(userId, connection);
            createUserDefaults(userId, connection);

            connection.commit();
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    /************* Email *************/

    public static void changeEmail(int userId, String email) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET email=?, emailVerified=0 WHERE id=?");
            statement.setString(1, email);
            statement.setInt(2, userId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static String getUsernameByVerifyToken(String verifyToken) throws Exception {
        String username = "";
        boolean expired = false;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM user_verify_email WHERE verifyToken = ?");
            statement.setString(1, verifyToken);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Timestamp expiration = resultSet.getTimestamp("expiration");
                if (expiration.getTime() > System.currentTimeMillis()) {
                    username = resultSet.getString("username");
                } else {
                    expired = true;
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (expired) {
            deleteVerifyToken(verifyToken);
            throw new Exception("Token Expired");
        }

        return username;
    }

    public static void deleteVerifyToken(String verifyToken) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_verify_email WHERE verifyToken = ?");
            statement.setString(1, verifyToken);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteVerifyTokenByUsername(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_verify_email WHERE username = ?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void emailVerified(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET emailVerified=1 WHERE username=?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************* Reset Password *************/

    public static void createResetPasswordRequest(String username, String verifyToken) throws Exception {
        deleteResetTokenByUsername(username);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO user_reset_password VALUES (NULL, ?, ?, ?)");
            final long ONE_DAY = 24 * 60 * 60 * 1000;
            Timestamp expiration = new Timestamp(System.currentTimeMillis() + ONE_DAY);
            statement.setString(1, username);
            statement.setString(2, verifyToken);
            statement.setTimestamp(3, expiration);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static String getUsernameByResetToken(String resetToken) throws Exception {
        String username = "";
        boolean expired = false;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM user_reset_password WHERE resetToken = ?");
            statement.setString(1, resetToken);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Timestamp expiration = resultSet.getTimestamp("expiration");
                if (expiration.getTime() > System.currentTimeMillis()) {
                    username = resultSet.getString("username");
                } else {
                    expired = true;
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (expired) {
            deleteResetToken(resetToken);
            throw new Exception("Token Expired");
        }

        return username;
    }

    public static void deleteResetToken(String resetToken) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_reset_password WHERE resetToken = ?");
            statement.setString(1, resetToken);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteResetTokenByUsername(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_reset_password WHERE username = ?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************* Unlock Account *************/

    public static void lockAccount(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET locked = 1 WHERE username=?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void unlockAccount(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET locked=0, numFailedLogins=0 WHERE username=?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void createUserUnlockAccount(String username, String verifyToken) throws Exception {
        deleteUnlockTokenByUsername(username);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO user_unlock_account VALUES (NULL, ?, ?)");
            statement.setString(1, username);
            statement.setString(2, verifyToken);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static String getUsernameByUnlockToken(String unlockToken) throws Exception {
        String username = "";
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT * FROM user_unlock_account WHERE unlockToken = ?");
            statement.setString(1, unlockToken);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                username = resultSet.getString("username");
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return username;
    }

    public static void deleteUnlockToken(String unlockToken) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_unlock_account WHERE unlockToken = ?");
            statement.setString(1, unlockToken);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteUnlockTokenByUsername(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM user_unlock_account WHERE username = ?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************* Authentication *************/

    public static void successfulLogin(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET lastLogin=?, numFailedLogins=0 WHERE username=?");
            Timestamp lastLogin = new Timestamp(System.currentTimeMillis());
            statement.setTimestamp(1, lastLogin);
            statement.setString(2, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void failedLogin(String username) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET numFailedLogins = numFailedLogins + 1 WHERE username=?");
            statement.setString(1, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void changePassword(String username, String password) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE users SET password=? WHERE username=?");
            statement.setString(1, password);
            statement.setString(2, username);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<Notification> getNotifications() throws Exception {
        List<Notification> notifications = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT title, message FROM notifications");
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                notifications.add(getNotification(resultSet));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return notifications;
    }

    public static List<Notification> getNotifications(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<Notification> notifications = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT n.title, n.message FROM user_notifications un JOIN notifications n ON un.notification_id = n.id WHERE un.user_id = ? AND un.acknowledged = 0");
            statement.setInt(1, userId);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                notifications.add(getNotification(resultSet));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return notifications;
    }

    private static Notification getNotification(ResultSet resultSet) throws Exception {
        return new Notification(
                resultSet.getString("title"),
                resultSet.getString("message")
        );
    }

    public static void acknowledgeNotifications(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE user_notifications SET acknowledged = 1 WHERE user_id = ?");
            statement.setInt(1, userId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void supportRequest(SupportRequest supportRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO user_support_requests (user_id, subject_id, message, status) VALUES (?,?,?,?)");
            statement.setInt(1, userId);
            statement.setInt(2, supportRequest.getSubject().getValue());
            MySql.setString(3, MySql.getValue(supportRequest.getMessage(), 5000), statement);
            statement.setInt(4, SupportRequestStatus.PENDING.getValue());
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
            EmailService.notifySupportRequest(supportRequest, userId);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }
}
