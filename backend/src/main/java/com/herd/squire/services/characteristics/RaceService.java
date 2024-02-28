package com.herd.squire.services.characteristics;

import com.herd.squire.models.*;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.Race;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.characteristics.starting_equipment.StartingEquipment;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.powers.Feature;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_MISC;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class RaceService implements CharacteristicDetailsService {

    @Override
    public Characteristic get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getRaceFull(statement, resultSet, userId, true, true);
    }

    public static Race getRaceFull(Statement statement, ResultSet resultSet, int userId, boolean includeSubRaces, boolean includeParent) throws Exception {
        long parentId = resultSet.getLong("parent_characteristic_id");
        Race race = getRace(statement, resultSet, userId);
        long raceId = MySql.decodeId(race.getId(), userId);

        List<Long> subRaceIds = new ArrayList<>();

        // Sub-races
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                subRaceIds.add(resultSet.getLong("id"));
            }
        }

        if (includeSubRaces) {
            race.setSubRaces(getSubRaces(raceId, subRaceIds, userId));
        }

        if (includeParent && parentId != 0 && parentId != raceId) {
            Race parent = get(parentId, userId, raceId, true);
            if (parent != null) {
                race.setParent(parent);
            }
        }

        return race;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, boolean includeChildren, boolean authorOnly, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Characteristics_GetList_Races (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setBoolean(5, includeChildren);
        statement.setBoolean(6, authorOnly);
        statement.setInt(7, listSource.getValue());
        return statement;
    }

    public static Race get(long id, int userId, long originalId, boolean includeParent) throws Exception {
        if (id == 0) {
            return null;
        }
        long parentId = 0;
        Race race = null;
        List<Long> subRaceIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get_Race(?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    parentId = resultSet.getLong("parent_characteristic_id");
                    race = getRace(statement, resultSet, userId);
                }
            }

            // Sub-races
            if (race != null && statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    subRaceIds.add(resultSet.getLong("id"));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (race != null) {
            race.setSubRaces(getSubRaces(id, subRaceIds, userId));

            if (includeParent && parentId != 0 && parentId != originalId) {
                Race parent = get(parentId, userId, originalId, true);
                if (parent != null) {
                    race.setParent(parent);
                }
            }
        }
        return race;
    }

    private static List<Race> getSubRaces(long raceId, List<Long> subRaceIds, int userId) throws Exception {
        List<Race> subRaces = new ArrayList<>();
        for (Long subRaceId : subRaceIds) {
            subRaces.add(get(subRaceId, userId, raceId, false));
        }
        return subRaces;
    }

    public static Race getRace(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Race race = new Race(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("num_abilities"),
                resultSet.getInt("num_languages"),
                resultSet.getInt("num_saving_throws"),
                resultSet.getInt("num_skills"),
                resultSet.getInt("num_tools"),
                MySql.encodeId(resultSet.getLong("spellcasting_ability_id"), userId),
                Size.valueOf(resultSet.getInt("size_id")),
                resultSet.getString("description"),
                resultSet.getBoolean("hover"),
                resultSet.getInt("starting_gold")
        );

        // Profs and Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> abilityModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            race.setAbilityModifiers(abilityModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> miscModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            race.setMiscModifiers(miscModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> abilityProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setSavingThrowProfs(abilityProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setArmorTypeProfs(armorTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> languageProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setLanguageProfs(languageProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setSkillProfs(skillProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setToolCategoryProfs(toolCategoryProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            race.setWeaponTypeProfs(weaponTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillChoices = CharacteristicService.getProfs(resultSet, userId, true);
            race.setSkillChoiceProfs(skillChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryChoices = CharacteristicService.getProfs(resultSet, userId, true);
            race.setToolCategoryChoiceProfs(toolCategoryChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorProfs = CharacteristicService.getProfs(resultSet, userId, false);
            race.setArmorProfs(armorProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolProfs = CharacteristicService.getProfs(resultSet, userId, false);
            race.setToolProfs(toolProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponProfs = CharacteristicService.getProfs(resultSet, userId, false);
            race.setWeaponProfs(weaponProfs);
        }

        // SpellConfigurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SpellConfiguration> spellConfigurations = CharacteristicService.getSpellConfigurations(resultSet, userId);
            race.setSpellConfigurations(spellConfigurations);
        }

        // Starting Equipment
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<StartingEquipment> startingEquipment = CharacteristicService.getStartingEquipments(resultSet, userId);
            race.setStartingEquipment(startingEquipment);
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageModifier> damageModifiers = CharacteristicService.getDamageModifiers(resultSet, userId);
            race.setDamageModifiers(damageModifiers);
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ListObject> conditionImmunities = CharacteristicService.getConditionImmunities(resultSet, userId);
            race.setConditionImmunities(conditionImmunities);
        }

        // Senses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SenseValue> senses = CharacteristicService.getSenses(resultSet);
            race.setSenses(senses);
        }

        // Speeds
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Speed> speeds = new ArrayList<>();
            while (resultSet.next()) {
                speeds.add(getSpeed(resultSet));
            }
            race.setSpeeds(speeds);
        }
        return race;
    }

    private static Speed getSpeed(ResultSet resultSet) throws Exception {
        return new Speed(
                SpeedType.valueOf(resultSet.getInt("speed_id")),
                resultSet.getInt("value")
        );
    }

    @Override
    public long create(Characteristic characteristic, int userId) throws Exception {
        if (!(characteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        Race race = (Race) characteristic;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Create_Race (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");

            statement.setString(1, MySql.getValue(characteristic.getName(), 45));
            MySql.setId(2, characteristic.getParent() == null ? null : characteristic.getParent().getId(), userId, statement);
            statement.setInt(3, MySql.getValue(characteristic.getNumAbilities(), 0, 9));
            statement.setInt(4, MySql.getValue(characteristic.getNumLanguages(), 0, 99));
            statement.setInt(5, MySql.getValue(characteristic.getNumSavingThrows(), 0, 9));
            statement.setInt(6, MySql.getValue(characteristic.getNumSkills(), 0, 99));
            statement.setInt(7, MySql.getValue(characteristic.getNumTools(), 0, 99));
            MySql.setId(8, characteristic.getSpellCastingAbility().equals("0") ? null : characteristic.getSpellCastingAbility(), userId, statement);

            statement.setString(9, MySql.getValue(race.getDescription(), 1000));
            statement.setInt(10, race.getSize().getValue());
            statement.setBoolean(11, race.isHover());
            statement.setInt(12, MySql.getValue(race.getStartingGold(), 0, 9999));

            statement.setInt(13, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("characteristic_id");
                    race.setId(MySql.encodeId(id, userId));
                }
            }

            if (id != -1) {
                updateSpeeds(id, race.getSpeeds(), connection);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

//        if (id != -1) {
//            // update sub-races after the main race has been committed
//            updateSubclasses(id, race, userId);
//        }

        return id;
    }

    @Override
    public boolean update(Characteristic characteristic, long id, int userId) throws Exception {
        if (!(characteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        Race race = (Race) characteristic;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Update_Race (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(characteristic.getName(), 45));
            MySql.setId(4, characteristic.getParent() == null ? null : characteristic.getParent().getId(), userId, statement);
            statement.setInt(5, MySql.getValue(characteristic.getNumAbilities(), 0, 9));
            statement.setInt(6, MySql.getValue(characteristic.getNumLanguages(), 0, 99));
            statement.setInt(7, MySql.getValue(characteristic.getNumSavingThrows(), 0, 9));
            statement.setInt(8, MySql.getValue(characteristic.getNumSkills(), 0, 99));
            statement.setInt(9, MySql.getValue(characteristic.getNumTools(), 0, 99));
            MySql.setId(10, characteristic.getSpellCastingAbility().equals("0") ? null : characteristic.getSpellCastingAbility(), userId, statement);

            statement.setString(11, MySql.getValue(race.getDescription(), 1000));
            statement.setInt(12, race.getSize().getValue());
            statement.setBoolean(13, race.isHover());
            statement.setInt(14, MySql.getValue(race.getStartingGold(), 0, 9999));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateSpeeds(id, race.getSpeeds(), connection);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

//        if (success) {
//            // update sub-races after main race has been committed
//            updateSubclasses(id, race, userId);
//        }

        return success;
    }

    private void updateSubRaces(long raceId, Race race, int userId) throws Exception {
        List<Long> deletedSubRaces = getDeletedSubRaces(raceId, race, userId);
        try {
            // if one of these sub-races are currently in use, this will throw an exception
            for (Long deleted : deletedSubRaces) {
                CharacteristicService.delete(deleted, userId);
            }
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }

        for (Race subRace : race.getSubRaces()) {
            long id = MySql.decodeId(subRace.getId(), userId);
            subRace.setParent(race);
            if (id > 0) {
                CharacteristicService.updateCharacteristic(subRace, userId);
            } else {
                create(subRace, userId);
            }
        }
    }

    private List<Long> getDeletedSubRaces(long raceId, Race race, int userId) throws Exception {
        List<Long> children = CharacteristicService.getChildrenCharacteristics(raceId, userId);
        List<Long> deleted = new ArrayList<>();
        for(Long child : children) {
            int index = getIndexOfChild(race, child, userId);
            if (index == -1) {
                deleted.add(child);
            }
        }
        return deleted;
    }

    private int getIndexOfChild(Race race, long childId, int userId) throws Exception {
        for (int i = 0; i < race.getSubRaces().size(); i++) {
            if (MySql.decodeId(race.getSubRaces().get(i).getId(), userId) == childId) {
                return i;
            }
        }
        return -1;
    }

    private void updateSpeeds(long raceId, List<Speed> speeds, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM race_speeds WHERE race_id = ?");
            statement.setLong(1, raceId);
            statement.executeUpdate();

            if (!speeds.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `race_speeds` (`race_id`, `speed_id`, `value`) VALUES (?, ?, ?)");
                for (Speed speed : speeds) {
                    statement.setLong(1, raceId);
                    statement.setInt(2, speed.getSpeedType().getValue());
                    statement.setInt(3, MySql.getValue(speed.getValue(), 0, 999));
                    statement.addBatch();
                }
                statement.executeBatch();
            }
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    @Override
    public String duplicate(Characteristic characteristic, int userId) throws Exception {
        if (!(characteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        Race race = (Race) characteristic;
        long raceId = MySql.decodeId(race.getId(), userId);

        List<Long> originalRaces = new ArrayList<>();
        originalRaces.add(raceId);
        race.setId("0");

        for (Race subRace : race.getSubRaces()) {
            originalRaces.add(MySql.decodeId(subRace.getId(), userId));
            subRace.setId("0");
        }

        List<Long> newRaces = new ArrayList<>();

        long newId = create(race, userId);
        newRaces.add(newId);
        updateSubRaces(newId, race, userId);
        for (Race subRace : race.getSubRaces()) {
            newRaces.add(MySql.decodeId(subRace.getId(), userId));
        }

        String encodedNewId = MySql.encodeId(newId, userId);

        if (originalRaces.size() != newRaces.size()) {
            throw new Exception("race not duplicated properly");
        }

        for (int i = 0; i < originalRaces.size(); i++) {
            long originalRaceId = originalRaces.get(i);
            long newRaceId = newRaces.get(i);
            Race currentRace = i == 0 ? race : race.getSubRaces().get(i - 1);
            String encodedNewRaceId = MySql.encodeId(newRaceId, userId);

            List<Feature> features = FeatureService.getFeaturesForCharacteristic(originalRaceId, userId);
            for (Feature feature : features) {
                feature.setId("0");
                feature.getCharacteristic().setId(encodedNewRaceId);
                PowerService.createPower(feature, userId);
            }

            CharacteristicService.addSpellConfigurations(newRaceId, currentRace.getSpellConfigurations(), userId);
        }

        return encodedNewId;
    }

    @Override
    public long addToMyStuff(Characteristic authorCharacteristic, int authorUserId, ListObject existingCharacteristic, int userId) throws Exception {
        if (!(authorCharacteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        long authorCharacteristicId = MySql.decodeId(authorCharacteristic.getId(), authorUserId);
        Race race = (Race)authorCharacteristic;

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToMyStuff(race.getAbilityModifiers(), userId);
            SharingUtilityService.addProficienciesToMyStuff(race.getSavingThrowProfs(), userId, true, false);

            String spellcastingAbility = AttributeService.addToMyStuff(race.getSpellCastingAbility(), userId);
            race.setSpellCastingAbility(spellcastingAbility);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToMyStuff(race.getMiscModifiers(), userId);
        }

        SharingUtilityService.addProficienciesToMyStuff(race.getArmorProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(race.getToolProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(race.getWeaponProfs(), userId, false, true);

        SharingUtilityService.addProficienciesToMyStuff(race.getArmorTypeProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getLanguageProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getSkillProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getSkillChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getToolCategoryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getToolCategoryChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(race.getWeaponTypeProfs(), userId, true, false);

        SharingUtilityService.addSpellConfigurationsToMyStuff(race.getSpellConfigurations(), userId);
        SharingUtilityService.addStartingEquipmentToMyStuff(race.getStartingEquipment(), userId);
        SharingUtilityService.addDamageModifiersToMyStuff(race.getDamageModifiers(), userId);
        AttributeService.addToMyStuff(race.getConditionImmunities(), userId);

        long raceId;
        if (race.getSid() != 0) {
            CharacteristicService.addSystemCharacteristic(MySql.decodeId(race.getId(), authorUserId), userId);
            raceId = MySql.decodeId(race.getId(), authorUserId);
        } else {
            if (existingCharacteristic == null) {
                raceId = create(race, userId);
            } else {
                raceId = MySql.decodeId(existingCharacteristic.getId(), userId);
                update(race, raceId, userId);
            }
        }

        CharacteristicService.addCharacteristicFeaturesToMyStuff(authorCharacteristicId, raceId, userId, authorUserId);
        if (race.getSid() == 0) {
            CharacteristicService.deleteSpellConfigurations(raceId, userId);
            CharacteristicService.addSpellConfigurations(raceId, race.getSpellConfigurations(), userId);
        }

        for (Race subRace : race.getSubRaces()) {
            CharacteristicService.addToMyStuff(MySql.decodeId(subRace.getId(), authorUserId), raceId, userId, false);
        }

        return raceId;
    }

    @Override
    public void addToShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        Race race = (Race)characteristic;
        long raceId = MySql.decodeId(race.getId(), userId);

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToShareList(race.getAbilityModifiers(), userId, shareList);
            SharingUtilityService.addProficienciesToShareList(race.getSavingThrowProfs(), userId, true, false, shareList);

            AttributeService.addToShareList(race.getSpellCastingAbility(), userId, shareList);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToShareList(race.getMiscModifiers(), userId, shareList);
        }

        SharingUtilityService.addProficienciesToShareList(race.getArmorProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getToolProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getWeaponProfs(), userId, false, true, shareList);

        SharingUtilityService.addProficienciesToShareList(race.getArmorTypeProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getLanguageProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getSkillProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getSkillChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getToolCategoryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getToolCategoryChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(race.getWeaponTypeProfs(), userId, true, false, shareList);

        SharingUtilityService.addSpellConfigurationsToShareList(race.getSpellConfigurations(), userId, shareList);
        SharingUtilityService.addStartingEquipmentToShareList(race.getStartingEquipment(), userId, shareList);
        SharingUtilityService.addDamageModifiersToShareList(race.getDamageModifiers(), userId, shareList);
        AttributeService.addToShareList(race.getConditionImmunities(), userId, shareList);

        shareList.getCharacteristics().add(race.getId());

        CharacteristicService.addCharacteristicFeaturesToShareList(raceId, userId, shareList);

        for (Race subRace : race.getSubRaces()) {
            CharacteristicService.addToShareList(MySql.decodeId(subRace.getId(), userId), userId, shareList);
        }
    }

    @Override
    public void addToUnShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof Race)) {
            throw new Exception("Invalid characteristic type");
        }
        Race race = (Race)characteristic;
        long raceId = MySql.decodeId(race.getId(), userId);

        shareList.getCharacteristics().add(race.getId());

        CharacteristicService.addCharacteristicFeaturesToUnShareList(raceId, userId, shareList);

        for (Race subRace : race.getSubRaces()) {
            CharacteristicService.addToShareList(MySql.decodeId(subRace.getId(), userId), userId, shareList);
        }
    }
}
