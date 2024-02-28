package com.herd.squire.utilities;

import com.herd.squire.models.ListObject;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.EmailService;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.mail.MessagingException;
import java.security.Key;
import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class MySql {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String ALGORITHM = "AES";

    private MySql() {}

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        return getConnection(Connection.TRANSACTION_READ_COMMITTED); //todo - verify that this is the correct default level to use
    }

    public static Connection getConnection(int transactionIsolation) throws ClassNotFoundException, SQLException {
        String jdbcUser = SquireProperties.getProperty("jdbcUser");
        String jdbcPassword = SquireProperties.getProperty("jdbcPassword");
        String dbUrl = SquireProperties.getProperty("dbUrl");
        String useSSL = SquireProperties.getProperty("useSSL");
        Class.forName(JDBC_DRIVER);

        Properties properties = new Properties();
        properties.put("user", jdbcUser);
        properties.put("password", jdbcPassword);
        if (useSSL != null && useSSL.equals("true")) {
            properties.put("sslMode", "VERIFY_CA");
            properties.put("clientCertificateKeyStoreUrl", "file:" + SquireProperties.getProperty("clientCertificateKeyStoreUrl"));
            properties.put("clientCertificateKeyStorePassword", SquireProperties.getProperty("clientCertificateKeyStorePassword"));
            properties.put("trustCertificateKeyStoreUrl", "file:" + SquireProperties.getProperty("trustCertificateKeyStoreUrl"));
            properties.put("trustCertificateKeyStorePassword", SquireProperties.getProperty("trustCertificateKeyStorePassword"));
        }

        Connection connection = DriverManager.getConnection(dbUrl, properties);
        connection.setTransactionIsolation(transactionIsolation);
        return connection;
    }

    public static Statement getStatement(Connection connection) throws SQLException {
        return connection.createStatement();
    }

    public static void closeConnections(ResultSet resultSet, Statement statement, Connection connection) {
        try {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void closeConnectionsAndThrow(ResultSet resultSet, Statement statement, Connection connection, Exception e) throws SquireException {
        logger.warning(e.getMessage());
        String env = SquireProperties.getProperty("env");
        if (env != null && env.equals("prod")) {
            try {
                EmailService.notifyError(e.getMessage());
            } catch (MessagingException ignored) {
            }
        }
        if (connection != null) {
            try {
                connection.rollback();
            } catch (Exception ignored) { }
        }
        closeConnections(resultSet, statement, connection);
        e.printStackTrace();
        throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static Long getGeneratedLongId(PreparedStatement statement) {
        List<Long> ids = getGeneratedLongIds(statement);
        if (!ids.isEmpty()) {
            return ids.get(0);
        }
        return (long) -1;
    }

    public static List<Long> getGeneratedLongIds(PreparedStatement statement) {
        List<Long> ids = new ArrayList<>();
        try {
            ResultSet generatedKeys = statement.getGeneratedKeys();
            while (generatedKeys.next()) {
                ids.add(generatedKeys.getLong(1));
            }
            closeConnections(generatedKeys, null, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ids;
    }

    public static Integer getGeneratedId(PreparedStatement statement) {
        List<Integer> ids = getGeneratedIds(statement);
        if (!ids.isEmpty()) {
            return ids.get(0);
        }
        return -1;
    }

    public static List<Integer> getGeneratedIds(PreparedStatement statement) {
        List<Integer> ids = new ArrayList<>();
        try {
            ResultSet generatedKeys = statement.getGeneratedKeys();
            while (generatedKeys.next()) {
                ids.add(generatedKeys.getInt(1));
            }
            closeConnections(generatedKeys, null, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ids;
    }

    public static ListObject getListObject(ResultSet resultSet, int userId) throws Exception {
        return getListObject(resultSet, false, userId);
    }

    public static ListObject getListObject(ResultSet resultSet, boolean includeDescription, int userId) throws Exception {
        if (includeDescription) {
            return new ListObject(
                    MySql.encodeId(resultSet.getLong("id"), userId),
                    resultSet.getString("name"),
                    resultSet.getString("description"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author")
            );
        } else {
            return new ListObject(
                    MySql.encodeId(resultSet.getLong("id"), userId),
                    resultSet.getString("name"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author")
            );
        }
    }

    public static void setString(int index, String value, PreparedStatement statement) throws Exception {
        if (value == null || value.equals("")) {
            statement.setNull(index, Types.VARCHAR);
        } else {
            statement.setString(index, value);
        }
    }

    public static void setDate(int index, java.util.Date date, PreparedStatement statement) throws Exception {
        if (date == null) {
            statement.setNull(index, Types.DATE);
        } else {
            statement.setDate(index, new java.sql.Date(date.getTime()));
        }
    }

    public static void setLong(int index, String value, PreparedStatement statement) throws Exception {
        if (value == null || value.equals("")) {
            statement.setNull(index, java.sql.Types.INTEGER);
        } else {
            long longValue = Long.parseLong(value);
            statement.setLong(index, longValue);
        }
    }

    public static void setLong(int index, Long value, PreparedStatement statement) throws Exception {
        if (value == null) {
            statement.setNull(index, java.sql.Types.INTEGER);
        } else {
            statement.setLong(index, value);
        }
    }

    public static void setInteger(int index, String value, PreparedStatement statement) throws Exception {
        if (value == null || value.equals("")) {
            statement.setNull(index, java.sql.Types.INTEGER);
        } else {
            int intValue = Integer.parseInt(value);
            statement.setInt(index, intValue);
        }
    }

    public static void setInteger(int index, Integer value, PreparedStatement statement) throws Exception {
        if (value == null || value == 0) {
            statement.setNull(index, java.sql.Types.INTEGER);
        } else {
            statement.setInt(index, value);
        }
    }

    public static void setId(int index, long id, PreparedStatement statement) throws Exception {
        if (id == 0) {
            statement.setNull(index, java.sql.Types.BIGINT);
        } else {
            statement.setLong(index, id);
        }
    }

    public static void setId(int index, ListObject listObject, int userId, PreparedStatement statement) throws Exception {
        String value = listObject == null ? null : listObject.getId();
        setId(index, value, userId, statement);
    }

    public static void setId(int index, String value, int userId, PreparedStatement statement) throws Exception {
        if (value == null || value.equals("")) {
            statement.setNull(index, Types.BIGINT);
        } else {
            long id = MySql.decodeId(value, userId);
            setId(index, id, statement);
        }
    }

    public static void setBoolean(int index, Boolean value, PreparedStatement statement) throws Exception {
        if (value == null) {
            statement.setNull(index, Types.BOOLEAN);
        } else {
            statement.setBoolean(index, value);
        }
    }

    public static int getValue(Integer value, int min, int max) {
        if (value == null) {
            return min;
        } else if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    public static long getValue(Long value, int min, int max) {
        if (value == null) {
            return min;
        } else if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    public static double getValue(Double value, double min, double max) {
        if (value == null) {
            return min;
        } else if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    public static String getValue(String value, int maxLength) {
        if (value == null) {
            return "";
        } else if (value.length() > maxLength) {
            return value.substring(0, maxLength);
        } else {
            return value;
        }
    }

    public static List<String> encodeIds(String[] ids, int userId) throws Exception {
        List<String> encoded = new ArrayList<>();
        for (String id : ids) {
            if (!id.equals("")) {
                encoded.add(MySql.encodeId(Long.parseLong(id), userId));
            }
        }
        return encoded;
    }

    public static String encodeId(long id, int userId) throws Exception {
        if (id == 0) {
            return "0";
        }
        String valueToEncode = String.valueOf(id); // + String.valueOf(userId);
        Key key = generateKey();
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encValue = cipher.doFinal(valueToEncode.getBytes());
        byte[] encryptedByteValue = Base64.getUrlEncoder().encode(encValue);
        String value = new String(encryptedByteValue);
        return value.replaceAll("=", "");
    }


    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
        return pattern.matcher(strNum).matches();
    }

    public static long decodeId(String encryptedId, int userId) throws Exception {
        if (encryptedId == null || encryptedId.equals("0") || isNumeric(encryptedId)) {
            return 0;
        }
        encryptedId += "==";
        Key key = generateKey();
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decodedValue = Base64.getUrlDecoder().decode(encryptedId.getBytes());
        byte[] decryptedVal = cipher.doFinal(decodedValue);
        String value = new String(decryptedVal);
//        int index = value.lastIndexOf(String.valueOf(userId));
//        String id = value.substring(0, index);
        return Long.parseLong(value);
    }

    private static Key generateKey() {
        String idSecret = SquireProperties.getProperty("idSecret");
        return new SecretKeySpec(idSecret.getBytes(), ALGORITHM);
    }

    public static String joinStrings(List<String> ids) {
        return ids.stream().map(String::valueOf).collect(Collectors.joining(","));
    }

    public static String joinIds(List<Integer> ids) {
        return ids.stream().map(String::valueOf).collect(Collectors.joining(","));
    }

    public static String joinLongIds(List<Long> ids) {
        return ids.stream().map(String::valueOf).collect(Collectors.joining(","));
    }

    public static List<String> joinLongIds(List<Long> ids, int maxLength) {
        List<String> list = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (Long id : ids) {
            String value = id.toString();
            if (current.toString().equals("")) {
                current = new StringBuilder(value);
            } else {
                if (current.length() + value.length() + 1 >= maxLength) {
                    list.add(current.toString());
                    current = new StringBuilder(value);
                } else {
                    current.append(",").append(value);
                }
            }
        }
        if (!current.toString().equals("")) {
            list.add(current.toString());
        }
        return list;
    }
}
