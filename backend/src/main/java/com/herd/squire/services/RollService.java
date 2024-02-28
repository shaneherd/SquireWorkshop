package com.herd.squire.services;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.rolls.*;
import com.herd.squire.utilities.MySql;
import org.apache.commons.lang.StringUtils;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

public class RollService {
    private static final int NUM_ROLLS_TO_KEEP = 10;

    public static void archive(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        archive(creatureId);
    }

    private static void archive(long creatureId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE rolls SET archived = 1 WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void archive(String id, String rollIdStr, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        long rollId = MySql.decodeId(rollIdStr, userId);
        archive(creatureId, rollId);
    }

    private static void archive(long creatureId, long rollId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE rolls SET archived = 1 WHERE creature_id = ? AND id = ?");
            statement.setLong(1, creatureId);
            statement.setLong(2, rollId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static Roll roll(String id, RollRequest rollRequest, HttpHeaders headers) throws Exception {
        return roll(id, rollRequest, headers, true);
    }

    public static Roll roll(String id, RollRequest rollRequest, HttpHeaders headers, boolean logResults) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return roll(creatureId, rollRequest, userId, logResults);
    }

    public static Roll roll(String id, AttackDamageRollRequest rollRequest, HttpHeaders headers) throws Exception {
        return roll(id, rollRequest, headers, true);
    }

    public static Roll roll(String id, AttackDamageRollRequest rollRequest, HttpHeaders headers, boolean logResults) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        if (rollRequest.getAttack() != null) {
            Roll attackRoll = roll(creatureId, rollRequest.getAttack(), userId, logResults);
            Roll damageRoll = rollDamage(creatureId, rollRequest.getDamage(), userId, attackRoll.isCritical(), attackRoll, logResults);
            if (damageRoll != null) {
                attackRoll.getChildrenRolls().add(damageRoll);
            }
            return attackRoll;
        } else {
            return rollDamage(creatureId, rollRequest.getDamage(), userId, false, null, logResults);
        }
    }

    private static Roll roll(long creatureId, RollRequest rollRequest, int userId, boolean logResults) throws Exception {
        List<RollResult> rollResults = new ArrayList<>();

        rollResults.add(getRollResult(rollRequest.getDiceCollections()));
        if ((rollRequest.getRollType() == RollType.STANDARD || rollRequest.getRollType() == RollType.ATTACK) && (rollRequest.isAdvantage() || rollRequest.isDisadvantage()) && !(rollRequest.isAdvantage() && rollRequest.isDisadvantage())) {
            rollResults.add(getRollResult(rollRequest.getDiceCollections()));
        }

        Roll roll =  new Roll(
                "0",
                rollRequest.getRollType(),
                rollRequest.getReason(),
                rollRequest.isHalfOnMiss(),
                rollRequest.isAdvantage(),
                rollRequest.isDisadvantage(),
                false,
                new Date(),
                rollResults,
                0
        );
        roll.setCritical(isCritical(roll));

        if (logResults) {
            //log the results
            long id = logRollResult(roll, creatureId, userId, null);
            roll.setId(MySql.encodeId(id, userId));
        }

        return roll;
    }

    private static boolean isCritical(Roll roll) {
        if (roll.isAdvantage() || roll.isDisadvantage()) {
            if (roll.getResults().size() > 1) {
                int total = roll.getTotalResult();
                if (roll.getResults().get(0).getTotalResult() == total) {
                    return roll.getResults().get(0).getResults().get(0).isCritical();
                } else {
                    return roll.getResults().get(1).getResults().get(0).isCritical();
                }
            } else {
                return roll.getResults().get(0).getResults().get(0).isCritical();
            }
        } else {
            return roll.getResults().get(0).getResults().get(0).isCritical();
        }
    }

    private static Roll rollDamage(long creatureId, RollRequest rollRequest, int userId, boolean critical, Roll parentRoll, boolean logResults) throws Exception {
        if (rollRequest == null) {
            return null;
        }
        List<RollResult> rollResults = new ArrayList<>();

        rollResults.add(getDamageRollResult(rollRequest.getDiceCollections(), critical));

        Roll roll =  new Roll(
                "0",
                rollRequest.getRollType(),
                rollRequest.getReason(),
                rollRequest.isHalfOnMiss(),
                rollRequest.isAdvantage(),
                rollRequest.isDisadvantage(),
                false,
                new Date(),
                rollResults,
                0
        );
        roll.setCritical(isCritical(roll));

        if (logResults) {
            //log the results
            long id = logRollResult(roll, creatureId, userId, parentRoll == null ? null : parentRoll.getId());
            roll.setId(MySql.encodeId(id, userId));
        }

        return roll;
    }

    private static RollResult getRollResult(List<RollRequestDiceCollection> collections) {
        List<DiceResult> results = new ArrayList<>();
        for (RollRequestDiceCollection collection : collections) {
            DiceResult diceResult = new DiceResult(
                    collection.getDiceSize(),
                    collection.getDamageType(),
                    collection.getModifier(),
                    roll(collection, false),
                    false
            );
            diceResult.setCritical(isCritical(diceResult));
            results.add(diceResult);
        }
        return new RollResult(results);
    }

    private static boolean isCritical(DiceResult diceResult) {
        int total = diceResult.getTotalResult();
        int modifier = diceResult.getModifier();
        int naturalRoll = total - modifier;
        return naturalRoll == 20; //todo - use character settings
    }

    private static RollResult getDamageRollResult(List<RollRequestDiceCollection> collections, boolean critical) {
        List<DiceResult> results = new ArrayList<>();
        for (RollRequestDiceCollection collection : collections) {
            results.add(new DiceResult(
                    collection.getDiceSize(),
                    collection.getDamageType(),
                    collection.getModifier(),
                    roll(collection, critical),
                    false
            ));
        }
        return new RollResult(results);
    }

    private static List<Integer> roll(RollRequestDiceCollection rollRequestDiceCollection, boolean doubleDice) {
        List<Integer> rolls = new ArrayList<>();
        for (int i = 0; i < rollRequestDiceCollection.getNumDice(); i++) {
            int roll = rollDie(rollRequestDiceCollection.getDiceSize());
            rolls.add(roll);
        }
        if (doubleDice) { //todo - check character setting to double dice value or double number of dice
            for (int i = 0; i < rollRequestDiceCollection.getNumDice(); i++) {
                int roll = rollDie(rollRequestDiceCollection.getDiceSize());
                rolls.add(roll);
            }
        }
        return rolls;
    }

    private static int rollDie(DiceSize diceSize) {
        if (diceSize == DiceSize.ONE) {
            return 1;
        }
        int max = diceSize.getNumberValue();
        int min = 1;
        return new Random().nextInt((max - min) + 1) + min;
    }

    private static long logRollResult(Roll roll, long creatureId, int userId, String parentRollId) throws Exception {
        long id = -1;
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareStatement("INSERT INTO `rolls` (`creature_id`, `roll_type_id`, `reason`, `half_on_miss`, `advantage`, `disadvantage`, `critical`, `timestamp`, `result`, `parent_roll_id`) VALUES (?,?,?,?,?,?,?,?,?,?);", Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, creatureId);
            statement.setInt(2, roll.getRollType().getValue());
            statement.setString(3, roll.getReason());
            statement.setBoolean(4, (roll.getRollType() == RollType.ATTACK || roll.getRollType() == RollType.SAVE) && roll.isHalfOnMiss());
            statement.setBoolean(5, (roll.getRollType() == RollType.STANDARD || roll.getRollType() == RollType.ATTACK) && roll.isAdvantage());
            statement.setBoolean(6, (roll.getRollType() == RollType.STANDARD || roll.getRollType() == RollType.ATTACK) && roll.isDisadvantage());
            statement.setBoolean(7, (roll.getRollType() == RollType.STANDARD || roll.getRollType() == RollType.ATTACK) && roll.isCritical());

            SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String timestamp = sdf.format(roll.getTimestamp());
            statement.setString(8, timestamp);
            statement.setInt(9, roll.getTotalResult());
            MySql.setId(10, parentRollId, userId, statement);
            statement.executeUpdate();
            id = MySql.getGeneratedLongId(statement);

            for (RollResult rollResult : roll.getResults()) {
                logRollResult(connection, id, rollResult, userId);
            }

            archivePreviousRolls(connection, creatureId);

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return id;
    }

    private static void logRollResult(Connection connection, long rollId, RollResult rollResult, int userId) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `roll_results` (`roll_id`, `result`) VALUES (?,?);", Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, rollId);
            statement.setInt(2, getTotalResult(rollResult));
            statement.executeUpdate();
            long id = MySql.getGeneratedLongId(statement);

            statement = connection.prepareStatement("INSERT INTO `roll_dice_results` (`roll_result_id`, `dice_size_id`, `damage_type_id`, `modifier`, `results`, `total`, `critical`) VALUES (?,?,?,?,?,?,?);");
            for (DiceResult diceResult : rollResult.getResults()) {
                statement.setLong(1, id);
                statement.setInt(2, diceResult.getDiceSize().getValue());
                MySql.setId(3, diceResult.getDamageType() == null ? null : diceResult.getDamageType().getId(), userId, statement);
                statement.setInt(4, diceResult.getModifier());
                statement.setString(5, StringUtils.join(diceResult.getResults(), ","));
                statement.setInt(6, getTotalResult(diceResult));
                statement.setBoolean(7, diceResult.isCritical());
                statement.addBatch();
            }
            statement.executeBatch();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void archivePreviousRolls(Connection connection, long creatureId) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE rolls AS r" +
                    " SET r.archived = 1" +
                    " WHERE r.creature_id = ?" +
                    " AND r.parent_roll_id IS NULL" +
                    " AND r.archived = 0" +
                    " AND r.id < (SELECT id FROM (SELECT id FROM rolls WHERE creature_id = ? AND archived = 0 AND parent_roll_id IS NULL ORDER BY id DESC LIMIT ?, 1) AS r2);");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureId);
            statement.setInt(3, NUM_ROLLS_TO_KEEP - 1);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static int getTotalResult(RollResult rollResult) {
        int total = 0;
        for (DiceResult diceResult : rollResult.getResults()) {
            total += getTotalResult(diceResult);
        }
        return total;
    }

    private static int getTotalResult(DiceResult diceResult) {
        int total = diceResult.getModifier();
        for (Integer result : diceResult.getResults()) {
            total += result == null ? 0 : result;
        }
        return total;
    }

    public static List<Roll> getRolls(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getRolls(creatureId, userId, false);
    }

    private static List<Roll> getRolls(long creatureId, int userId, boolean archived) throws Exception {
        List<Roll> rolls = new ArrayList<>();
        Map<Long, Roll> map = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Rolls_GetList (?,?)}");
            statement.setLong(1, creatureId);
            statement.setBoolean(2, archived);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                // Rolls
                while (resultSet.next()) {
                    Roll roll = getRoll(resultSet, userId);
                    rolls.add(roll);
                    map.put(MySql.decodeId(roll.getId(), userId), roll);
                }
            }
            // Children Rolls
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    long parentId = resultSet.getLong("parent_roll_id");
                    Roll parent = map.get(parentId);
                    if (parent != null) {
                        parent.getChildrenRolls().add(getRoll(resultSet, userId));
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return rolls;
    }

    private static Roll getRoll(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("id");
        return new Roll(
                MySql.encodeId(id, userId),
                RollType.valueOf(resultSet.getInt("roll_type_id")),
                resultSet.getString("reason"),
                resultSet.getBoolean("half_on_miss"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                resultSet.getBoolean("critical"),
                null,
                null,
                resultSet.getInt("result")
        );
    }

    public static Roll getRoll(String id, String rollIdStr, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        long rollId = MySql.decodeId(rollIdStr, userId);
        return getRoll(creatureId, rollId, userId);
    }

    private static Roll getRoll(long creatureId, long rollId, int userId) throws Exception {
        Roll roll = null;
        Map<Long, Roll> rollMap = new HashMap<>();
        Map<Long, RollResult> rollResultMap = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Rolls_Get (?,?,?)}");
            statement.setLong(1, rollId);
            statement.setLong(2, creatureId);
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                // Rolls
                if (resultSet.next()) {
                    roll = getRoll(resultSet, userId);
                    rollMap.put(MySql.decodeId(roll.getId(), userId), roll);
                }
            }

            // Children Rolls
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    if (roll != null) {
                        Roll childRoll = getRoll(resultSet, userId);
                        roll.getChildrenRolls().add(childRoll);
                        rollMap.put(MySql.decodeId(childRoll.getId(), userId), childRoll);
                    }
                }
            }

            // Roll Results
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    long currentRollId = resultSet.getLong("roll_id");
                    Roll currentRoll = rollMap.get(currentRollId);
                    if (currentRoll != null) {
                        long rollResultId = resultSet.getLong("result_id");
                        RollResult rollResult = new RollResult();
                        rollResultMap.put(rollResultId, rollResult);
                        currentRoll.getResults().add(rollResult);
                    }
                }
            }

            // Dice Results
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    long rollResultId = resultSet.getLong("roll_result_id");
                    RollResult rollResult = rollResultMap.get(rollResultId);
                    if (rollResult != null) {
                        DiceResult diceResult = getDiceResult(resultSet, userId);
                        rollResult.getResults().add(diceResult);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return roll;
    }

    private static DiceResult getDiceResult(ResultSet resultSet, int userId) throws Exception {
        String resultsStr = resultSet.getString("results");
        String[] resultParts = resultsStr.split(",");
        List<Integer> results = new ArrayList<>();
        if (!resultsStr.equals("")) {
            for (int i = 0; i < resultParts.length; i++) {
                results.add(Integer.parseInt(resultParts[i]));
            }
        }
        return new DiceResult(
                DiceSize.valueOf(resultSet.getInt("dice_size_id")),
                getDamageType(resultSet, userId),
                resultSet.getInt("modifier"),
                results,
                resultSet.getBoolean("critical")
        );
    }

    private static DamageType getDamageType(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("damage_type_id");
        if (id == 0) {
            return null;
        }
        return new DamageType(
                MySql.encodeId(id, userId),
                resultSet.getString("damage_type_name"),
                resultSet.getString("damage_type_description"),
                resultSet.getInt("damage_type_sid"),
                resultSet.getBoolean("damage_type_is_author"),
                resultSet.getInt("damage_type_version")
        );
    }
}
