package com.herd.squire.services.characteristics;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.characteristics.background.BackgroundTrait;
import com.herd.squire.models.characteristics.starting_equipment.StartingEquipment;
import com.herd.squire.models.characteristics.starting_equipment.StartingEquipmentType;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.powers.Feature;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.proficiency.ProficiencyCategory;
import com.herd.squire.models.proficiency.ProficiencyListObject;
import com.herd.squire.models.proficiency.ProficiencyType;
import com.herd.squire.models.sharing.*;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.InUseFactory;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.PowerDetailsService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CharacteristicService {
    private static final BackgroundService backgroundService = new BackgroundService();
    private static final ClassService classService = new ClassService();
    private static final RaceService raceService = new RaceService();

    private static CharacteristicDetailsService getService(CharacteristicType characteristicType) throws Exception {
        CharacteristicDetailsService characteristicDetailsService = null;
        switch (characteristicType) {
            case RACE:
                characteristicDetailsService = raceService;
                break;
            case CLASS:
                characteristicDetailsService = classService;
                break;
            case BACKGROUND:
                characteristicDetailsService = backgroundService;
                break;
        }
        if (characteristicDetailsService == null) {
            throw new Exception("Invalid Characteristic Type");
        }
        return characteristicDetailsService;
    }

    public static Characteristic getCharacteristic(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getCharacteristic(decodedId, userId);
    }

    public static Characteristic getCharacteristic(String id, int userId) throws Exception {
        long decodedId = MySql.decodeId(id, userId);
        return getCharacteristic(decodedId, userId);
    }

    private static Characteristic getCharacteristic(long id, int userId) throws Exception {
        Characteristic characteristic = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    CharacteristicType characteristicType = CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id"));

                    if (statement.getMoreResults()) {
                        CharacteristicDetailsService detailsService = getService(characteristicType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            characteristic = detailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return characteristic;
    }

    public static Characteristic getParent(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getParent(decodedId, userId);
    }

    private static Characteristic getParent(long childId, int userId) throws Exception {
        Characteristic characteristic = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get_Parent (?,?)}");
            statement.setLong(1, childId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    CharacteristicType characteristicType = CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id"));

                    if (statement.getMoreResults()) {
                        CharacteristicDetailsService detailsService = getService(characteristicType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            characteristic = detailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return characteristic;
    }

    public static List<BackgroundTrait> getCharacteristicTraits(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return BackgroundService.getBackgroundTraits(decodedId, userId);
    }

    public static List<Feature> getFeaturesForCharacteristic(String id, boolean includeChildren, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return getFeaturesForCharacteristic(characteristicId, includeChildren, userId);
    }

    public static List<Feature> getFeaturesForCharacteristic(long characteristicId, boolean includeChildren, int userId) throws Exception {
        List<Feature> features = FeatureService.getFeaturesForCharacteristic(characteristicId, userId);

        if (includeChildren) {
            List<Long> children = getChildrenCharacteristics(characteristicId, userId);
            for (Long child : children) {
                features.addAll(FeatureService.getFeaturesForCharacteristic(child, userId));
            }
        }

        return features;
    }

    public static String createCharacteristic(Characteristic characteristic, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = createCharacteristic(characteristic, userId);
        return MySql.encodeId(newId, userId);
    }

    public static long createCharacteristic(Characteristic characteristic, int userId) throws Exception {
        CharacteristicDetailsService characteristicDetailsService = getService(characteristic.getCharacteristicType());
        long id = characteristicDetailsService.create(characteristic, userId);
        if (characteristic.getParent() != null) {
            updateVersion(characteristic.getParent().getId(), userId);
        }
        return id;
    }

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return getPublishedDetails(characteristicId, userId);
    }

    private static PublishDetails getPublishedDetails(long characteristicId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_GetPublishedDetails (?,?)}");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    boolean published = resultSet.getBoolean("published");
                    publishDetails.setPublished(published);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<String> users = publishDetails.getUsers();
                    while (resultSet.next()) {
                        String username = resultSet.getString("username");
                        users.add(username);
                    }
                    if (!users.isEmpty()) {
                        publishDetails.setPublishType(PublishType.PRIVATE);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return publishDetails;
    }

    public static VersionInfo getVersionInfo(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return getVersionInfo(characteristicId, userId);
    }

    private static VersionInfo getVersionInfo(long characteristicId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get_VersionInfo (?,?)}");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    versionInfo = new VersionInfo(
                            resultSet.getInt("version"),
                            resultSet.getInt("author_version")
                    );
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return versionInfo;
    }

    /********************************************************************************************/

    public static void addToShareList(List<ListObject> characteristics, int userId, ShareList shareList) throws Exception {
        if (characteristics != null) {
            for (ListObject item : characteristics) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject creature, int userId, ShareList shareList) throws Exception {
        if (creature != null) {
            long id = MySql.decodeId(creature.getId(), userId);
            if (id != 0) {
                addToShareList(id, userId, shareList);
            }
        }
    }

    public static void addToShareList(String id, int userId, ShareList shareList) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                addToShareList(decodeId, userId, shareList);
            }
        }
    }

    public static void addToShareList(long characteristicId, int userId, ShareList shareList) throws Exception {
        Characteristic characteristic = getCharacteristic(characteristicId, userId);
        addToShareList(characteristic, userId, shareList);
    }

    public static void addToShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (characteristic != null) {
            CharacteristicDetailsService characteristicDetailsService = getService(characteristic.getCharacteristicType());
            characteristicDetailsService.addToShareList(characteristic, userId, shareList);
        }
    }

    public static void addCharacteristicFeaturesToShareList(long characteristicId, int userId, ShareList shareList) throws Exception {
        List<Feature> features = getFeaturesForCharacteristic(characteristicId, false, userId);
        for (Feature feature : features) {
            PowerService.addToShareList(feature, userId, shareList);
        }
    }

    public static void addCharacteristicFeaturesToUnShareList(long characteristicId, int userId, ShareList shareList) throws Exception {
        List<Feature> features = getFeaturesForCharacteristic(characteristicId, false, userId);
        for (Feature feature : features) {
            shareList.getPowers().add(feature.getId());
        }
    }

    /********************************************************************************************/

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        if (characteristicId == 0) {
            return "0";
        }
        long newId = addToMyStuff(characteristicId, 0, userId, true);
        return MySql.encodeId(newId, userId);
    }

    public static void addToMyStuff(List<ListObject> items, int userId) throws Exception {
        if (items != null) {
            for (ListObject item : items) {
                addToMyStuff(item, userId);
            }
        }
    }

    public static void addToMyStuff(ListObject characteristic, int userId) throws Exception {
        if (characteristic != null) {
            long id = MySql.decodeId(characteristic.getId(), userId);
            if (id != 0) {
                long characteristicId = addToMyStuff(id, 0, userId, false);
                characteristic.setId(MySql.encodeId(characteristicId, userId));
            }
        }
    }

    public static void addToMyStuff(Characteristic characteristic, int userId) throws Exception {
        if (characteristic != null) {
            long id = MySql.decodeId(characteristic.getId(), userId);
            if (id != 0) {
                long characteristicId = addToMyStuff(id, 0, userId, false);
                characteristic.setId(MySql.encodeId(characteristicId, userId));
            }
        }
    }

    public static String addToMyStuff(String id, int userId) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                long characteristicId = addToMyStuff(decodeId, 0, userId, false);
                return MySql.encodeId(characteristicId, userId);
            }
        }
        return "0";
    }

    public static long addToMyStuff(long characteristicId, long parentId, int userId, boolean checkRights) throws Exception {
        long authorCharacteristicId = 0;
        int authorUserId = 0;
        long existingCharacteristicId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorCharacteristicId = resultSet.getLong("author_characteristic_id");
                    if (authorCharacteristicId == 0) {
                        throw new Exception("unable to find characteristic to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingCharacteristicId = resultSet.getLong("existing_characteristic_id");

                    int authorCharacteristicTypeId = resultSet.getInt("author_characteristic_type_id");
                    int existingCharacteristicTypeId = resultSet.getInt("existing_characteristic_type_id");
                    if (existingCharacteristicId > 0 && authorCharacteristicTypeId != existingCharacteristicTypeId) {
                        throw new Exception("unable to update existing characteristic");
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        Characteristic authorCharacteristic = getCharacteristic(authorCharacteristicId, authorUserId);
        if (authorCharacteristic == null) {
            throw new Exception("unable to find characteristic to add");
        }

        if (parentId > 0 && authorCharacteristic.getParent() != null) {
            //update the parent
            authorCharacteristic.getParent().setId(MySql.encodeId(parentId, userId));
        }

        ListObject existingCharacteristic = null;
        if (existingCharacteristicId != 0) {
            existingCharacteristic = new ListObject(
                    MySql.encodeId(existingCharacteristicId, userId),
                    "",
                    0,
                    false
            );
        }

        CharacteristicDetailsService characteristicDetailsService = getService(authorCharacteristic.getCharacteristicType());
        long newId = characteristicDetailsService.addToMyStuff(authorCharacteristic, authorUserId, existingCharacteristic, userId);
        if (newId < 1) {
            throw new Exception("unable to add characteristic");
        }
        if (authorCharacteristic.getSid() == 0) {
            updateParentId(newId, authorCharacteristicId, authorCharacteristic.getVersion());
        }
        return newId;
    }

    public static void addCharacteristicFeaturesToMyStuff(long authorCharacteristicId, long characteristicId, int userId, int authorUserId) throws Exception {
        String encodedId = MySql.encodeId(characteristicId, userId);
        List<Feature> features = getFeaturesForCharacteristic(authorCharacteristicId, false, authorUserId);
        Map<Long, Feature> featureMap = new HashMap<>();
        for (Feature feature : features) {
            feature.getCharacteristic().setId(encodedId);
            featureMap.put(MySql.decodeId(feature.getId(), authorUserId), feature);
        }
        List<Long> featuresToDelete = new ArrayList<>();

        List<FeatureAddToMyStuffDetails> details = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_ForCharacteristic_GetAddToMyStuffDetails (?,?,?,?)}");
            statement.setLong(1, authorCharacteristicId);
            statement.setInt(2, authorUserId);
            statement.setLong(3, characteristicId);
            statement.setInt(4, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    long authorPowerId = resultSet.getLong("author_power_id");
                    long existingPowerId = resultSet.getLong("existing_power_id");
                    int authorPowerTypeId = resultSet.getInt("author_power_type_id");
                    int existingPowerTypeId = resultSet.getInt("existing_power_type_id");
                    Feature feature = featureMap.get(authorPowerId);

                    if (authorPowerId != 0 && (existingPowerId == 0 || authorPowerTypeId == existingPowerTypeId)) {
                        details.add(new FeatureAddToMyStuffDetails(
                                authorPowerId,
                                authorUserId,
                                authorPowerTypeId,
                                existingPowerId,
                                existingPowerTypeId,
                                feature
                        ));
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    while (resultSet.next()) {
                        featuresToDelete.add(resultSet.getLong("id"));
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        for (FeatureAddToMyStuffDetails featureDetails : details) {
            ListObject existingPower = null;
            if (featureDetails.getExistingPowerId() != 0) {
                existingPower = new ListObject(
                        MySql.encodeId(featureDetails.getExistingPowerId(), userId),
                        "",
                        0,
                        false
                );
            }

            Feature authorPower = featureDetails.getAuthorFeature();
            PowerDetailsService powerDetailsService = PowerService.getService(authorPower.getPowerType());
            long newId = powerDetailsService.addToMyStuff(authorPower, authorUserId, existingPower, userId);
            if (newId < 1) {
                throw new Exception("unable to add power");
            }
            if (authorPower.getSid() == 0) {
                PowerService.updateParentId(newId, featureDetails.getAuthorPowerId(), authorPower.getVersion());
            }
        }

        if (!featuresToDelete.isEmpty()) {
            for (Long featureId : featuresToDelete) {
                PowerService.delete(featureId, userId);
            }
        }
    }

    public static void addSystemCharacteristic(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO characteristics_shared (characteristic_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE characteristics SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
            statement.setLong(1, parentId);
            statement.setInt(2, parentVersion);

            // This is intentionally the same value as the previous column. Make sure the version matches the parent version whenever updating.
            statement.setInt(3, parentVersion);
            statement.setLong(4, id);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateVersion(String characteristicId, int userId) throws Exception {
        long id = MySql.decodeId(characteristicId, userId);
        updateVersion(id, userId);
    }

    public static void updateVersion(long characteristicId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE characteristics SET version = version + 1 WHERE user_id = ? AND id = ?;");
            statement.setInt(1, userId);
            statement.setLong(2, characteristicId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void publishCharacteristic(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        publishCharacteristic(characteristicId, publishRequest, userId);
    }

    private static long publishCharacteristic(long characteristicId, PublishRequest publishRequest, int userId) throws Exception {
        if (publishRequest.getPublishType() == PublishType.PUBLIC) {
            publishPublic(characteristicId, userId);
        } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(characteristicId, publishRequest.getUsers(), userId);
        } else {
            unPublish(characteristicId, userId);
        }

        return characteristicId;
    }

    private static void publishPublic(long characteristicId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getCharacteristicShareList(characteristicId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long characteristicId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getCharacteristicShareList(characteristicId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long characteristicId, int userId) throws Exception {
        Characteristic characteristic = getCharacteristic(characteristicId, userId);
        CharacteristicDetailsService detailsService = getService(characteristic.getCharacteristicType());
        ShareList shareList = new ShareList();
        detailsService.addToUnShareList(characteristic, userId, shareList);
        SharingUtilityService.unSharePrivate(shareList, userId);
    }

    public static void updateCommonCharacteristics(long id, Characteristic characteristic, int userId, Connection connection) throws Exception {
        updateProfs(id, characteristic, userId, connection);
        updateStartingEquipment(id, characteristic, userId, connection);
        updateDamageModifiers(id, characteristic, userId, connection);
        updateConditionImmunities(id, characteristic, userId, connection);
        updateSenses(id, characteristic, connection);
    }

    public static List<ListObject> getCharacteristics(CharacteristicType characteristicType, boolean includeChildren, boolean authorOnly, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            CharacteristicDetailsService detailsService = getService(characteristicType);
            statement = detailsService.getListObjectStatement(connection, null, 0, userId, includeChildren, authorOnly, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    items.add(
                            new ListObject(
                                    MySql.encodeId(resultSet.getLong("characteristic_id"), userId),
                                    resultSet.getString("name"),
                                    resultSet.getInt("sid"),
                                    resultSet.getBoolean("is_author")
                            )
                    );
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static List<ListObject> getChildrenCharacteristicList(String parentId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareCall("{call Characteristics_Get_Children (?, ?, ?)}");
            MySql.setId(1, parentId, userId, statement);
            statement.setInt(2, userId);
            statement.setBoolean(3, false);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    items.add(MySql.getListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static List<Long> getChildrenCharacteristics(String parentId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(parentId, userId);
        return getChildrenCharacteristics(decodedId, userId);
    }

    public static List<Long> getChildrenCharacteristics(long parentId, int userId) throws Exception {
        List<Long> childrenIds = new ArrayList<>();
        if (parentId == 0) {
            return childrenIds;
        }

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareCall("{call Characteristics_Get_Children (?, ?, ?)}");
            statement.setLong(1, parentId);
            statement.setInt(2, userId);
            statement.setBoolean(3, true);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    childrenIds.add(resultSet.getLong("id"));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return childrenIds;
    }

    private static boolean isIdInList(List<Long> ids, long id) {
        for (int i = 0; i < ids.size(); i++) {
            if (id == ids.get(i)) {
                return true;
            }
        }
        return false;
    }

    public static void updateCharacteristic(Characteristic characteristic, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        updateCharacteristic(characteristic, userId);
    }

    public static void updateCharacteristic(Characteristic characteristic, int userId) throws Exception {
        long id = MySql.decodeId(characteristic.getId(), userId);
        checkForCircularDependencies(id, characteristic, userId);
        CharacteristicDetailsService detailsService = getService(characteristic.getCharacteristicType());
        boolean success = detailsService.update(characteristic, id, userId);
        if (!success) {
            throw new Exception("Unable to update characteristic");
        }

        if (characteristic.getParent() != null) {
            updateVersion(characteristic.getParent().getId(), userId);
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    private static void checkForCircularDependencies(long id, Characteristic characteristic, int userId) throws Exception {
        if (characteristic.getParent() != null) {
            long parentId = MySql.decodeId(characteristic.getParent().getId(), userId);
            List<Long> children = new ArrayList<>();
            List<Long> parents = new ArrayList<>();

            Connection connection = null;
            CallableStatement statement = null;
            try {
                connection = MySql.getConnection();

                statement = connection.prepareCall("{call Characteristics_Get_Relatives (?, ?, ?)}");
                statement.setLong(1, id);
                statement.setLong(2, parentId);
                statement.setInt(3, userId);
                boolean hasResult = statement.execute();
                ResultSet resultSet = null;
                if (hasResult) {
                    resultSet = statement.getResultSet();

                    while (resultSet.next()) {
                        children.add(resultSet.getLong("id"));
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    while (resultSet.next()) {
                        parents.add(resultSet.getLong("parent_characteristic_id"));
                    }
                }

                MySql.closeConnections(resultSet, statement, connection);
            } catch (Exception e) {
                MySql.closeConnectionsAndThrow(null, statement, connection, e);
            }

            if (isIdInList(children, parentId)) {
                throw new Exception("Circular dependency found");
            }
            if (isIdInList(parents, id)) {
                throw new Exception("Circular dependency found");
            }
        }
    }

    private static void updateProfs(long characteristicId, Characteristic characteristic, int userId, Connection connection) throws Exception {
        deleteAllProfs(characteristicId, connection);
        updateItemProfs(characteristicId, characteristic.getArmorProfs(), userId, connection);
        updateAttributeModifiers(characteristicId, characteristic.getAbilityModifiers(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getArmorTypeProfs(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getLanguageProfs(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getSavingThrowProfs(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getSkillProfs(), userId, connection);
        updateChoiceProfs(characteristicId, characteristic.getSkillChoiceProfs(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getToolCategoryProfs(), userId, connection);
        updateChoiceProfs(characteristicId, characteristic.getToolCategoryChoiceProfs(), userId, connection);
        updateItemProfs(characteristicId, characteristic.getToolProfs(), userId, connection);
        updateItemProfs(characteristicId, characteristic.getWeaponProfs(), userId, connection);
        updateAttributeProfs(characteristicId, characteristic.getWeaponTypeProfs(), userId, connection);
    }

    private static void updateAttributeModifiers(long characteristicId, List<Modifier> modifiers, int userId, Connection connection) throws Exception {
        if (modifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_attribute_modifiers` (`characteristic_id`, `attribute_id`, `value`) VALUES (?, ?, ?)");
            for (Modifier modifier : modifiers) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, modifier.getAttribute().getId(), userId, statement);
                statement.setInt(3, MySql.getValue(modifier.getValue(), -99, 99));
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

    private static void updateAttributeProfs(long characteristicId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_attribute_profs` (`characteristic_id`, `attribute_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, prof.getAttribute().getId(), userId, statement);
                statement.setBoolean(3, prof.isAdvantage());
                statement.setBoolean(4, prof.isDisadvantage());
                statement.setBoolean(5, prof.isDoubleProf());
                statement.setBoolean(6, prof.isHalfProf());
                statement.setBoolean(7, prof.isRoundUp());
                statement.setInt(8, prof.getMiscModifier());
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

    private static void updateChoiceProfs(long characteristicId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_choice_profs` (`characteristic_id`, `attribute_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, prof.getAttribute().getId(), userId, statement);
                statement.setBoolean(3, prof.isAdvantage());
                statement.setBoolean(4, prof.isDisadvantage());
                statement.setBoolean(5, prof.isDoubleProf());
                statement.setBoolean(6, prof.isHalfProf());
                statement.setBoolean(7, prof.isRoundUp());
                statement.setInt(8, prof.getMiscModifier());
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

    private static void updateItemProfs(long characteristicId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_item_profs` (`characteristic_id`, `item_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, prof.getAttribute().getId(), userId, statement);
                statement.setBoolean(3, prof.isAdvantage());
                statement.setBoolean(4, prof.isDisadvantage());
                statement.setBoolean(5, prof.isDoubleProf());
                statement.setBoolean(6, prof.isHalfProf());
                statement.setBoolean(7, prof.isRoundUp());
                statement.setInt(8, prof.getMiscModifier());
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

    public static List<InUse> inUse(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return inUse(decodedId, userId);
    }

    public static List<InUse> inUse(long id, int userId) throws Exception {
        List<InUse> results = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_InUse (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    results.add(InUseFactory.getInUse(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return results;
    }

    public static void delete(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        delete(decodedId, headers);
    }

    public static void delete(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        delete(id, userId);
    }

    public static void delete(long id, int userId) throws Exception {
        //todo - handle deleting children
        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Delete (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    result = resultSet.getInt("result");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (result != 1) {
            throw new Exception("unable to delete");
        }
    }

    private static void deleteAllProfs(long characteristicId, Connection connection) throws Exception {
        deleteAllAttributeModifiers(characteristicId, connection);
        deleteAllAttributeProfs(characteristicId, connection);
        deleteAllChoiceProfs(characteristicId, connection);
        deleteAllItemProfs(characteristicId, connection);
    }

    private static void deleteAllAttributeModifiers(long characteristicId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_attribute_modifiers WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllAttributeProfs(long characteristicId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_attribute_profs WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllChoiceProfs(long characteristicId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_choice_profs WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllItemProfs(long characteristicId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_item_profs WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static String duplicate(String id, String name, HttpHeaders headers) throws Exception {
        Characteristic characteristic = getCharacteristic(id, headers);
        if (characteristic == null) {
            throw new Exception("characteristic not found");
        }
        characteristic.setName(name);

        int userId = AuthenticationService.getUserId(headers);
        CharacteristicDetailsService characteristicDetailsService = getService(characteristic.getCharacteristicType());
        return characteristicDetailsService.duplicate(characteristic, userId);
    }

    /********************** Get Profs **********************/

    public static List<Modifier> getAttributeModifiers(ResultSet resultSet, int userId) throws Exception {
        List<Modifier> modifiers = new ArrayList<>();
        while (resultSet.next()) {
            modifiers.add(getModifier(resultSet, userId));
        }
        return modifiers;
    }

    public static List<Proficiency> getProfs(ResultSet resultSet, int userId, boolean attribute) throws Exception {
        List<Proficiency> profs = new ArrayList<>();
        while (resultSet.next()) {
            if (attribute) {
                profs.add(getAttributeProf(resultSet, userId));
            } else {
                profs.add(getItemProf(resultSet, userId));
            }
        }
        return profs;
    }

    private static Modifier getModifier(ResultSet resultSet, int userId) throws Exception {
        return new Modifier(
                new Attribute(MySql.encodeId(resultSet.getLong("attribute_id"), userId), resultSet.getString("name"), resultSet.getString("description"), resultSet.getInt("sid")),
                resultSet.getInt("value")
        );
    }

    private static Proficiency getAttributeProf(ResultSet resultSet, int userId) throws Exception {
        return new Proficiency(
                new ProficiencyListObject(
                        MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        ProficiencyType.valueOf(ProficiencyCategory.ATTRIBUTE, resultSet.getInt("attribute_type_id"))
                ),
                true,
                resultSet.getInt("misc_modifier"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                resultSet.getBoolean("double_prof"),
                resultSet.getBoolean("half_prof"),
                resultSet.getBoolean("round_up")
        );
    }

    private static Proficiency getItemProf(ResultSet resultSet, int userId) throws Exception {
        return new Proficiency(
                new ProficiencyListObject(
                        MySql.encodeId(resultSet.getLong("item_id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        ProficiencyType.valueOf(ProficiencyCategory.ITEM, resultSet.getInt("item_type_id")),
                        MySql.encodeId(resultSet.getLong("category_id"), userId)
                ),
                true,
                resultSet.getInt("misc_modifier"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                resultSet.getBoolean("double_prof"),
                resultSet.getBoolean("half_prof"),
                resultSet.getBoolean("round_up")
        );
    }

    /******************************** Spell Configurations ************************/

    public static List<SpellConfiguration> getSpellConfigurations(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return getSpellConfigurations(characteristicId, userId);
    }

    private static List<SpellConfiguration> getSpellConfigurations(long characteristicId, int userId) throws Exception {
        List<SpellConfiguration> spellConfigurations = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{CALL Characteristics_SpellConfigurations(?,?)}");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    spellConfigurations = getSpellConfigurations(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return spellConfigurations;
    }

    public static List<SpellConfiguration> getSpellConfigurations(ResultSet resultSet, int userId) throws Exception {
        List<SpellConfiguration> spellConfigurations = new ArrayList<>();
        while (resultSet.next()) {
            spellConfigurations.add(getSpellConfiguration(resultSet, userId));
        }
        return spellConfigurations;
    }

    private static SpellConfiguration getSpellConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new SpellConfiguration(
                new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                new ListObject(MySql.encodeId(resultSet.getLong("level_gained"), userId), resultSet.getString("level_name"), resultSet.getInt("level_sid"), resultSet.getBoolean("level_is_author")),
                resultSet.getBoolean("always_prepared"),
                resultSet.getBoolean("counts_towards_prepared_limit"),
                resultSet.getString("notes"),
                resultSet.getBoolean("config_is_author")
        );
    }

    public static List<SpellConfiguration> addSpells(String id, List<ListObject> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return addSpells(characteristicId, spells, userId);
    }

    public static void addSpellConfigurations(String id, List<SpellConfiguration> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        addSpellConfigurations(characteristicId, spells, userId);
    }

    public static void addSpellConfigurations(long characteristicId, List<SpellConfiguration> spells, int userId) throws Exception {
        if (spells.isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT IGNORE INTO `characteristic_spell_configurations` (`characteristic_id`, `spell_id`, `level_gained`, `always_prepared`, `counts_towards_prepared_limit`, `notes`, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
            for (SpellConfiguration config : spells) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                MySql.setId(3, config.getLevelGained() == null ? null : config.getLevelGained().getId(), userId, statement);
                statement.setBoolean(4, config.isAlwaysPrepared());
                statement.setBoolean(5, config.isCountTowardsPrepared());
                statement.setString(6, config.getNotes());
                statement.setInt(7, userId);
                statement.addBatch();
            }
            statement.executeBatch();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(characteristicId, userId);
    }

    private static List<SpellConfiguration> addSpells(long characteristicId, List<ListObject> spells, int userId) throws Exception {
        List<SpellConfiguration> configurations = new ArrayList<>();
        for (ListObject spell : spells) {
            SpellConfiguration config = new SpellConfiguration(spell, null, false, true, "", true);
            configurations.add(config);
        }
        addSpellConfigurations(characteristicId, configurations, userId);

        return configurations;
    }

    public static void updateSpellConfiguration(String id, SpellConfiguration config, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        updateSpellConfiguration(characteristicId, config, userId);
    }

    private static void updateSpellConfiguration(long characteristicId, SpellConfiguration config, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE characteristic_spell_configurations SET level_gained = ?, always_prepared = ?, counts_towards_prepared_limit = ?, notes = ? WHERE characteristic_id = ? AND spell_id = ? AND user_id = ?");

            MySql.setId(1, config.getLevelGained() == null ? null : config.getLevelGained().getId(), userId, statement);
            statement.setBoolean(2, config.isAlwaysPrepared());
            statement.setBoolean(3, config.isCountTowardsPrepared());
            statement.setString(4, config.getNotes());
            statement.setLong(5, characteristicId);
            MySql.setId(6, config.getSpell().getId(), userId, statement);
            statement.setInt(7, userId);

            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(characteristicId, userId);
    }

    public static void deleteSpell(String id, String spellId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        long decodedSpellId = MySql.decodeId(spellId, userId);
        deleteSpell(characteristicId, decodedSpellId, userId);
        updateVersion(characteristicId, userId);
    }

    private static void deleteSpell(long characteristicId, long spellId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM characteristic_spell_configurations WHERE characteristic_id = ? AND spell_id = ? AND user_id = ?");
            statement.setLong(1, characteristicId);
            statement.setLong(2, spellId);
            statement.setInt(3, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteSpellConfigurations(long characteristicId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM characteristic_spell_configurations WHERE characteristic_id = ? AND user_id = ?");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /**************************** Starting Equipment ********************************/

    public static List<StartingEquipment> getFilteredStartingEquipment(String id, boolean includeParents, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characteristicId = MySql.decodeId(id, userId);
        return getStartingEquipment(characteristicId, includeParents, userId);
    }

    public static List<StartingEquipment> getStartingEquipments(ResultSet resultSet, int userId) throws Exception {
        List<StartingEquipment> startingEquipment = new ArrayList<>();
        while (resultSet.next()) {
            startingEquipment.add(getStartingEquipment(resultSet, userId));
        }
        return startingEquipment;
    }

    public static StartingEquipment getStartingEquipment(ResultSet resultSet, int userId) throws Exception {
        long itemId = resultSet.getLong("item_id");
        ListObject item = null;
        if (itemId > 0) {
            item = new ListObject(MySql.encodeId(itemId, userId), resultSet.getString("item_name"), resultSet.getInt("item_sid"), resultSet.getBoolean("item_is_author"));
        }

        return new StartingEquipment(
                resultSet.getInt("item_group"),
                resultSet.getInt("item_option"),
                StartingEquipmentType.valueOf(resultSet.getInt("item_type")),
                item,
                new Filters(resultSet.getString("filters"), userId),
                resultSet.getInt("quantity")
        );
    }

    public static List<StartingEquipment> getStartingEquipment(long characteristicId, boolean includeParents, int userId) throws Exception {
        List<StartingEquipment> startingEquipment = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            //Characteristic_StartingEquipment - characteristicId INT, includeParents BIT
            statement = connection.prepareCall("{call Characteristics_StartingEquipment (?,?,?)}");
            statement.setLong(1, characteristicId);
            statement.setBoolean(2, includeParents);
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                startingEquipment = getStartingEquipments(resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return startingEquipment;
    }

    private static void updateStartingEquipment(long characteristicId, Characteristic characteristic, int userId, Connection connection) throws Exception {
        deleteStartingEquipment(characteristicId, connection);
        List<StartingEquipment> startingEquipment = characteristic.getStartingEquipment();

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO characteristic_starting_equipments (characteristic_id, item_group, item_option, item_type, item_id, filters, quantity) VALUE (?,?,?,?,?,?,?)");

            for (StartingEquipment equipment : startingEquipment) {
                statement.setLong(1, characteristicId);
                statement.setInt(2, equipment.getItemGroup());
                statement.setInt(3, equipment.getItemOption());
                statement.setInt(4, equipment.getStartingEquipmentType().getValue());
                MySql.setId(5, equipment.getStartingEquipmentType() == StartingEquipmentType.ITEM ? equipment.getItem() : null, userId, statement);
                statement.setString(6, equipment.getStartingEquipmentType() == StartingEquipmentType.ITEM || equipment.getFilters() == null ? "" : equipment.getFilters().getFiltersString(userId));
                statement.setInt(7, MySql.getValue(equipment.getQuantity(), 1, 99));
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

    private static void deleteStartingEquipment(long characteristicId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_starting_equipments WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Damage Modifiers ********************************/

    public static List<DamageModifier> getDamageModifiers(ResultSet resultSet, int userId) throws Exception {
        List<DamageModifier> damageModifiers = new ArrayList<>();
        while (resultSet.next()) {
            damageModifiers.add(getDamageModifier(resultSet, userId));
        }
        return damageModifiers;
    }

    private static DamageModifier getDamageModifier(ResultSet resultSet, int userId) throws Exception {
        return new DamageModifier(
                getDamageType(resultSet, userId),
                DamageModifierType.valueOf(resultSet.getInt("damage_modifier_type_id"))
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

    private static void updateDamageModifiers(long characteristicId, Characteristic characteristic, int userId, Connection connection) throws Exception {
        deleteDamageModifiers(characteristicId, connection);
        List<DamageModifier> damageModifiers = characteristic.getDamageModifiers();
        if (damageModifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_damage_modifiers` (`characteristic_id`, `damage_type_id`, `damage_modifier_type_id`) VALUES (?, ?, ?)");
            for (DamageModifier damageModifier : damageModifiers) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, damageModifier.getDamageType().getId(), userId, statement);
                statement.setInt(3, damageModifier.getDamageModifierType().getValue());
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

    private static void deleteDamageModifiers(long characteristicId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_damage_modifiers WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Condition Immunities ********************************/

    public static List<ListObject> getConditionImmunities(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> conditionImmunities = new ArrayList<>();
        while (resultSet.next()) {
            conditionImmunities.add(MySql.getListObject(resultSet, userId));
        }
        return conditionImmunities;
    }

    private static void updateConditionImmunities(long characteristicId, Characteristic characteristic, int userId, Connection connection) throws Exception {
        deleteConditionImmunities(characteristicId, connection);
        List<ListObject> conditionImmunities = characteristic.getConditionImmunities();
        if (conditionImmunities.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_condition_immunities` (`characteristic_id`, `condition_id`) VALUES (?, ?)");
            for (ListObject conditionImmunity : conditionImmunities) {
                statement.setLong(1, characteristicId);
                MySql.setId(2, conditionImmunity.getId(), userId, statement);
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

    private static void deleteConditionImmunities(long characteristicId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_condition_immunities WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Senses ********************************/

    public static List<SenseValue> getSenses(ResultSet resultSet) throws Exception {
        List<SenseValue> senses = new ArrayList<>();
        while (resultSet.next()) {
            senses.add(getSenseValue(resultSet));
        }
        return senses;
    }

    private static SenseValue getSenseValue(ResultSet resultSet) throws Exception {
        return new SenseValue(
                Sense.valueOf(resultSet.getInt("sense_id")),
                resultSet.getInt("range")
        );
    }

    private static void updateSenses(long characteristicId, Characteristic characteristic, Connection connection) throws Exception {
        deleteSenses(characteristicId, connection);
        List<SenseValue> senses = characteristic.getSenses();
        if (senses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `characteristic_senses` (`characteristic_id`, `sense_id`, `range`) VALUES (?, ?, ?)");
            for (SenseValue senseValue : senses) {
                statement.setLong(1, characteristicId);
                statement.setInt(2, MySql.getValue(senseValue.getSense().getValue(), 0, 999));
                statement.setInt(3, senseValue.getRange());
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

    private static void deleteSenses(long characteristicId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM characteristic_senses WHERE characteristic_id = ?");
            statement.setLong(1, characteristicId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }
}
