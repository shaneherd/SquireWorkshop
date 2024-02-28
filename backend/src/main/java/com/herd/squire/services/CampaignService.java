package com.herd.squire.services;

import com.herd.squire.models.GroupCheckType;
import com.herd.squire.models.campaigns.*;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.campaigns.encounters.EncounterListObject;
import com.herd.squire.models.campaigns.settings.*;
import com.herd.squire.models.creatures.characters.HealthCalculationType;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class CampaignService {

    public static String createCampaign(Campaign campaign, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = -1;
        UUID generatedToken = UUID.randomUUID();
        Timestamp createdAt = new Timestamp(System.currentTimeMillis());

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Create (?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(campaign.getName(), 255));
            statement.setString(2, MySql.getValue(campaign.getDescription(), 1000));
            statement.setString(3, MySql.getValue(generatedToken.toString(), 36));
            statement.setTimestamp(4, createdAt);
            statement.setInt(5, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("id");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    public static void updateCampaign(Campaign campaign, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(campaign.getId(), userId);
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Update (?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(campaign.getName(), 255));
            statement.setString(4, MySql.getValue(campaign.getDescription(), 1000));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (!success) {
            throw new Exception("Unable to update campaign");
        }
    }

    public static List<ListObject> getCampaigns(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_GetList (?,?,?,?)}");
            statement.setInt(1, userId);
            MySql.setString(2, "", statement);
            statement.setLong(3, 0);
            statement.setLong(4, PAGE_SIZE);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    items.add(
                            new ListObject(
                                    MySql.encodeId(resultSet.getLong("id"), userId),
                                    resultSet.getString("name"),
                                    resultSet.getString("description"),
                                    0,
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

    public static Campaign getCampaign(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getCampaign(decodedId, headers);
    }

    private static Campaign getCampaign(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getCampaign(id, userId);
    }

    private static Campaign getCampaign(long id, int userId) throws Exception {
        Campaign campaign = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    campaign = getCampaign(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return campaign;
    }

    private static Campaign getCampaign(CallableStatement statement, ResultSet resultSet, int userId) throws Exception {
        Campaign campaign = new Campaign(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getString("token"),
                resultSet.getBoolean("is_author")
        );

        // characters
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<CampaignCharacter> characters = new ArrayList<>();
            while (resultSet.next()) {
                characters.add(getCampaignCharacter(resultSet, userId));
            }
            campaign.setCharacters(characters);
        }

        // encounters
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<EncounterListObject> encounters = new ArrayList<>();
            while (resultSet.next()) {
                encounters.add(getEncounterListObject(resultSet, userId));
            }
            campaign.setEncounters(encounters);
        }

        // settings
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            campaign.setSettings(getCampaignSettings(statement, resultSet));
        }

        return campaign;
    }

    private static CampaignCharacter getCampaignCharacter(ResultSet resultSet, int userId) throws Exception {
        long creatureId = resultSet.getLong("creature_id");
        return new CampaignCharacter(
                MySql.encodeId(resultSet.getLong("id"), userId),
                MySql.encodeId(creatureId, userId),
                CampaignCharacterType.CHARACTER,
                resultSet.getString("name"),
                getCampaignCharacterClass(resultSet, userId),
                getCampaignCharacterSubclass(resultSet, userId),
                getCampaignCharacterRace(resultSet, userId),
                getCampaignCharacterBackground(resultSet, userId),
                CreatureService.getInitiativeModifier(creatureId, userId),
                CreatureService.getPerception(creatureId, userId),
                CreatureService.getStealth(creatureId, userId),
                resultSet.getInt("proficiency_misc"),
                resultSet.getInt("exp")
        );
    }

    private static ListObject getCampaignCharacterClass(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("class_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(id, userId),
                resultSet.getString("class_name"),
                0,
                false
        );
    }

    private static ListObject getCampaignCharacterSubclass(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("subclass_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(id, userId),
                resultSet.getString("subclass_name"),
                0,
                false
        );
    }

    private static ListObject getCampaignCharacterRace(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("race_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(id, userId),
                resultSet.getString("race_name"),
                0,
                false
        );
    }

    private static ListObject getCampaignCharacterBackground(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("background_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(id, userId),
                resultSet.getString("background_name"),
                0,
                false
        );
    }

    private static EncounterListObject getEncounterListObject(ResultSet resultSet, int userId) throws Exception {
        return new EncounterListObject(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getTimestamp("started_at"),
                resultSet.getTimestamp("last_played_at"),
                resultSet.getTimestamp("finished_at")
        );
    }

    public static void deleteCampaign(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);

        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Delete (?,?)}");
            MySql.setId(1, id, userId, statement);
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

    public static String duplicateCampaign(String id, String name, HttpHeaders headers) throws Exception {
        Campaign campaign = getCampaign(id, headers);
        if (campaign == null) {
            throw new Exception("campaign not found");
        }
        campaign.setId("0");
        campaign.setName(name);
        return createCampaign(campaign, headers);
    }

    public static void removeCharacterFromCampaign(String id, String characterId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long campaignId = MySql.decodeId(id, userId);
        long charId = MySql.decodeId(characterId, userId);
        removeCharacterFromCampaign(campaignId, charId, userId);
    }

    private static void removeCharacterFromCampaign(long campaignId, long characterId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        boolean success = false;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_RemoveCreature (?,?,?)}");
            statement.setLong(1, campaignId);
            statement.setLong(2, characterId);
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    int count = resultSet.getInt("count_creatures");

                    for (int i = 0; i < count; i++) {
                        if (statement.getMoreResults()) {
                            resultSet = statement.getResultSet();
                            if (resultSet.next()) {
                                boolean battleCreatureDeleteSuccess = resultSet.getBoolean("result");
                            }
                        }
                    }

                    if (statement.getMoreResults()) {
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            success = resultSet.getBoolean("valid_request");
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        if (!success) {
            throw new Exception("Unable to remove character from campaign");
        }
    }

    public static String refreshToken(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long campaignId = MySql.decodeId(id, userId);
        return refreshToken(campaignId, userId);
    }

    private static String refreshToken(long campaignId, int userId) throws Exception {
        UUID generatedToken = UUID.randomUUID();
        String token = generatedToken.toString();

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE campaigns SET token = ? WHERE user_id = ? AND id = ?");
            statement.setString(1, MySql.getValue(token, 36));
            statement.setInt(2, userId);
            statement.setLong(3, campaignId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return token;
    }

    /********************** Settings **********************/

    private static CampaignSettings getCampaignSettings(Statement statement, ResultSet resultSet) throws Exception {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
//        List<CampaignPage> pages = new ArrayList<>();

        //setting values
        while(resultSet.next()) {
            CampaignSettingCategory category = CampaignSettingCategory.valueOf(resultSet.getInt("campaign_setting_category_id"));
            CampaignSetting setting = CampaignSetting.valueOf(resultSet.getInt("campaign_setting_id"));
            int value = resultSet.getInt("value");

            CampaignSettingValue settingValue = new CampaignSettingValue(category, setting, value);
            settingValues.add(settingValue);
        }

        //pages
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//
//            while (resultSet.next()) {
//                pages.add(getCharacterPage(resultSet));
//            }
//        }
        return getCampaignSettings(settingValues);
    }

    private static CampaignSettings getCampaignSettings(List<CampaignSettingValue> settingValues) {
        CampaignSettings campaignSetting = new CampaignSettings();
//        campaignSetting.setPages(pages);

        for (CampaignSettingValue settingValue : settingValues) {
            processSettingValue(settingValue, campaignSetting);
        }

        return campaignSetting;
    }

    private static void processSettingValue(CampaignSettingValue settingValue, CampaignSettings campaignSettings) {
        switch (settingValue.getCategory()) {
            case HEALTH:
                processHealthSettingValue(settingValue, campaignSettings);
                break;
            case INITIATIVE:
                processInitiativeSettingValue(settingValue, campaignSettings);
                break;
            case EXPERIENCE:
                processExperienceSettingValue(settingValue, campaignSettings);
                break;
            case SURPRISE:
                processSurpriseRoundSettingValue(settingValue, campaignSettings);
                break;
        }
    }

    private static void processHealthSettingValue(CampaignSettingValue settingValue, CampaignSettings campaignSettings) {
        switch (settingValue.getSetting()) {
            case HEALTH_CALCULATION_TYPE:
                campaignSettings.getHealth().setHealthCalculationType(HealthCalculationType.valueOf(settingValue.getValue()));
                break;
            case GROUPED_HP:
                campaignSettings.getHealth().setGrouped(settingValue.getValue() == 1);
                break;
            case KILL_MONSTERS:
                campaignSettings.getHealth().setKillMonsters(settingValue.getValue() == 1);
                break;
        }
    }

    private static void processInitiativeSettingValue(CampaignSettingValue settingValue, CampaignSettings campaignSettings) {
        switch (settingValue.getSetting()) {
            case GROUPED_INITIATIVE:
                campaignSettings.getInitiative().setGrouped(settingValue.getValue() == 1);
                break;
            case NATURAL_20_GOES_FIRST:
                campaignSettings.getInitiative().setNatural20First(settingValue.getValue() == 1);
                break;
            case HIDE_KILLED:
                campaignSettings.getInitiative().setHideKilled(settingValue.getValue() == 1);
                break;
        }
    }

    private static void processExperienceSettingValue(CampaignSettingValue settingValue, CampaignSettings campaignSettings) {
        switch (settingValue.getSetting()) {
            case EXPERIENCE_TYPE:
                campaignSettings.getExperience().setExperienceType(ExperienceType.valueOf(settingValue.getValue()));
                break;
            case USE_ADJUSTED:
                campaignSettings.getExperience().setUseAdjusted(settingValue.getValue() == 1);
                break;
            case SPLIT_EVENLY:
                campaignSettings.getExperience().setSplitEvenly(settingValue.getValue() == 1);
                break;
        }
    }

    private static void processSurpriseRoundSettingValue(CampaignSettingValue settingValue, CampaignSettings campaignSettings) {
        switch (settingValue.getSetting()) {
            case GROUP_CHECK_TYPE:
                campaignSettings.getSurpriseRound().setGroupCheckType(GroupCheckType.valueOf(settingValue.getValue()));
                break;
            case CRITICAL_DOUBLES:
                campaignSettings.getSurpriseRound().setCriticalDoubles(settingValue.getValue() == 1);
                break;
        }
    }

    public static void updateSettings(String id, CampaignSettings settings, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long campaignId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            updateSettings(campaignId, settings, connection);
            connection.commit();

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void updateSettings(long campaignId, CampaignSettings settings, Connection connection) throws Exception {
        List<CampaignSettingValue> settingValues = getSettingValuesList(settings);
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Campaign_Settings_Update (?,?,?)}");

            for (CampaignSettingValue settingValue : settingValues) {
                statement.setLong(1, campaignId);
                statement.setInt(2, settingValue.getSetting().getValue());
                statement.setInt(3, settingValue.getValue());
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

    private static List<CampaignSettingValue> getSettingValuesList(CampaignSettings campaignSettings) {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
        settingValues.addAll(getSettingValuesList(campaignSettings.getHealth()));
        settingValues.addAll(getSettingValuesList(campaignSettings.getInitiative()));
        settingValues.addAll(getSettingValuesList(campaignSettings.getExperience()));
        settingValues.addAll(getSettingValuesList(campaignSettings.getSurpriseRound()));
        return settingValues;
    }

    private static List<CampaignSettingValue> getSettingValuesList(CampaignHealthSettings settings) {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.HEALTH, CampaignSetting.HEALTH_CALCULATION_TYPE, settings.getHealthCalculationType().getValue()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.HEALTH, CampaignSetting.GROUPED_HP, settings.isGrouped()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.HEALTH, CampaignSetting.KILL_MONSTERS, settings.isKillMonsters()));
        return settingValues;
    }

    private static List<CampaignSettingValue> getSettingValuesList(CampaignInitiativeSettings settings) {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.INITIATIVE, CampaignSetting.GROUPED_INITIATIVE, settings.isGrouped()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.INITIATIVE, CampaignSetting.NATURAL_20_GOES_FIRST, settings.isNatural20First()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.INITIATIVE, CampaignSetting.HIDE_KILLED, settings.isHideKilled()));
        return settingValues;
    }

    private static List<CampaignSettingValue> getSettingValuesList(CampaignExperienceSettings settings) {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.EXPERIENCE, CampaignSetting.EXPERIENCE_TYPE, settings.getExperienceType().getValue()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.EXPERIENCE, CampaignSetting.USE_ADJUSTED, settings.isUseAdjusted()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.EXPERIENCE, CampaignSetting.SPLIT_EVENLY, settings.isSplitEvenly()));
        return settingValues;
    }

    private static List<CampaignSettingValue> getSettingValuesList(CampaignSurpriseRoundSettings settings) {
        List<CampaignSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.SURPRISE, CampaignSetting.GROUP_CHECK_TYPE, settings.getGroupCheckType().getValue()));
        settingValues.add(new CampaignSettingValue(CampaignSettingCategory.SURPRISE, CampaignSetting.CRITICAL_DOUBLES, settings.isCriticalDoubles()));
        return settingValues;
    }

    private static void deleteSettings(long characterId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
//            statement = connection.prepareStatement("DELETE FROM character_setting_values WHERE character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

}
