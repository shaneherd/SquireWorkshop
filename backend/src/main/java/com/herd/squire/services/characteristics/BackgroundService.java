package com.herd.squire.services.characteristics;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.Modifier;
import com.herd.squire.models.SenseValue;
import com.herd.squire.models.characteristics.BackgroundTraitType;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.characteristics.background.Background;
import com.herd.squire.models.characteristics.background.BackgroundTrait;
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

public class BackgroundService implements CharacteristicDetailsService {

    @Override
    public Characteristic get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getFullBackground(statement, resultSet, userId, true, true);
    }

    public static Background getFullBackground(Statement statement, ResultSet resultSet, int userId, boolean includeSubBackgrounds, boolean includeParent) throws Exception {
        long parentId = resultSet.getLong("parent_characteristic_id");
        Background background = getBackground(statement, resultSet, userId);
        long backgroundId = MySql.decodeId(background.getId(), userId);

        List<Long> subBackgroundIds = new ArrayList<>();

        // Sub-backgrounds
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                subBackgroundIds.add(resultSet.getLong("id"));
            }
        }

        if (includeSubBackgrounds) {
            background.setSubBackgrounds(getSubBackgrounds(backgroundId, subBackgroundIds, userId));
        }

        if (includeParent && parentId != 0 && parentId != backgroundId) {
            Background parent = get(parentId, userId, backgroundId, true);
            if (parent != null) {
                background.setParent(parent);
            }
        }

        return background;
    }

    private static List<Background> getSubBackgrounds(long backgroundId, List<Long> subBackgroundIds, int userId) throws Exception {
        List<Background> subBackgrounds = new ArrayList<>();
        for (Long subBackgroundId : subBackgroundIds) {
            Background subBackground = get(subBackgroundId, userId, backgroundId, false);
            if (subBackground != null) {
                subBackgrounds.add(subBackground);
            }
        }
        return subBackgrounds;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, boolean includeChildren, boolean authorOnly, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Characteristics_GetList_Backgrounds (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setBoolean(5, includeChildren);
        statement.setBoolean(6, authorOnly);
        statement.setInt(7, listSource.getValue());
        return statement;
    }

    public static Background get(long id, int userId, long originalId, boolean includeParent) throws Exception {
        if (id == 0) {
            return null;
        }
        long parentId = 0;
        Background background = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get_Background(?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    parentId = resultSet.getLong("parent_characteristic_id");
                    background = getBackground(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (background != null) {
            if (includeParent && parentId != 0 && parentId != originalId) {
                Background parent = get(parentId, userId, originalId, true);
                if (parent != null) {
                    background.setParent(parent);
                }
            }
        }
        return background;
    }

    public static Background getBackground(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Background background = new Background(
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
                resultSet.getString("description"),
                resultSet.getInt("starting_gold")
        );

        // Profs and Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> abilityModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            background.setAbilityModifiers(abilityModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> miscModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            background.setMiscModifiers(miscModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> abilityProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setSavingThrowProfs(abilityProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setArmorTypeProfs(armorTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> languageProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setLanguageProfs(languageProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setSkillProfs(skillProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setToolCategoryProfs(toolCategoryProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            background.setWeaponTypeProfs(weaponTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillChoices = CharacteristicService.getProfs(resultSet, userId, true);
            background.setSkillChoiceProfs(skillChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryChoices = CharacteristicService.getProfs(resultSet, userId, true);
            background.setToolCategoryChoiceProfs(toolCategoryChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorProfs = CharacteristicService.getProfs(resultSet, userId, false);
            background.setArmorProfs(armorProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolProfs = CharacteristicService.getProfs(resultSet, userId, false);
            background.setToolProfs(toolProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponProfs = CharacteristicService.getProfs(resultSet, userId, false);
            background.setWeaponProfs(weaponProfs);
        }

        // SpellConfigurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SpellConfiguration> spellConfigurations = CharacteristicService.getSpellConfigurations(resultSet, userId);
            background.setSpellConfigurations(spellConfigurations);
        }

        // Starting Equipment
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<StartingEquipment> startingEquipment = CharacteristicService.getStartingEquipments(resultSet, userId);
            background.setStartingEquipment(startingEquipment);
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageModifier> damageModifiers = CharacteristicService.getDamageModifiers(resultSet, userId);
            background.setDamageModifiers(damageModifiers);
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ListObject> conditionImmunities = CharacteristicService.getConditionImmunities(resultSet, userId);
            background.setConditionImmunities(conditionImmunities);
        }

        // Senses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SenseValue> senses = CharacteristicService.getSenses(resultSet);
            background.setSenses(senses);
        }

        // Traits
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                BackgroundTrait trait = getTrait(resultSet, userId);
                background.addTrait(trait);
            }
        }

        return background;
    }

    private static List<BackgroundTrait> getTraits(ResultSet resultSet, int userId) throws Exception {
        List<BackgroundTrait> traits = new ArrayList<>();
        while (resultSet.next()) {
            traits.add(getTrait(resultSet, userId));
        }
        return traits;
    }

    private static BackgroundTrait getTrait(ResultSet resultSet, int userId) throws Exception {
        return new BackgroundTrait(
                MySql.encodeId(resultSet.getLong("id"), userId),
                BackgroundTraitType.valueOf(resultSet.getInt("background_trait_type_id")),
                resultSet.getString("description")
        );
    }

    @Override
    public long create(Characteristic characteristic, int userId) throws Exception {
        if (!(characteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        Background background = (Background) characteristic;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Create_Background (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");

            statement.setString(1, MySql.getValue(characteristic.getName(), 45));
            MySql.setId(2, characteristic.getParent() == null ? null : characteristic.getParent().getId(), userId, statement);
            statement.setInt(3, MySql.getValue(characteristic.getNumAbilities(), 0, 9));
            statement.setInt(4, MySql.getValue(characteristic.getNumLanguages(), 0, 99));
            statement.setInt(5, MySql.getValue(characteristic.getNumSavingThrows(), 0, 9));
            statement.setInt(6, MySql.getValue(characteristic.getNumSkills(), 0, 99));
            statement.setInt(7, MySql.getValue(characteristic.getNumTools(), 0, 99));
            MySql.setId(8, characteristic.getSpellCastingAbility().equals("0") ? null : characteristic.getSpellCastingAbility(), userId, statement);

            statement.setString(9, MySql.getValue(background.getDescription(), 1000));
            statement.setInt(10, MySql.getValue(background.getStartingGold(), 0, 9999));

            statement.setInt(11, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("characteristic_id");
                    background.setId(MySql.encodeId(id, userId));
                }
            }

            if (id != -1) {
                updateAllTraits(id, background, connection, userId);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Characteristic characteristic, long id, int userId) throws Exception {
        if (!(characteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        Background background = (Background) characteristic;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Update_Background (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
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

            statement.setString(11, MySql.getValue(background.getDescription(), 1000));
            statement.setInt(12, MySql.getValue(background.getStartingGold(), 0, 9999));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateAllTraits(id, background, connection, userId);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    private void updateAllTraits(long backgroundId, Background background, Connection connection, int userId) throws Exception {
        List<Long> deletedTraits = getDeletedTraits(backgroundId, background, userId, connection);
        try {
            // If one of these traits are currently being used by a character, this will throw an exception
            deleteTraits(deletedTraits, connection);
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }
        updateTraits(getUpdatedTraits(background), userId, connection);
        createTraits(backgroundId, getNewTraits(background), connection);
    }

    private List<Long> getDeletedTraits(long backgroundId, Background background, int userId, Connection connection) throws Exception {
        List<BackgroundTrait> traits = getBackgroundTraits(backgroundId, userId, connection);
        List<Long> deleted = new ArrayList<>();
        for(BackgroundTrait trait : traits) {
            if (!hasTrait(trait, background)) {
                deleted.add(MySql.decodeId(trait.getId(), userId));
            }
        }
        return deleted;
    }

    private List<BackgroundTrait> getUpdatedTraits(Background background){
        List<BackgroundTrait> traits = getTraits(background.getVariations(), false);
        traits.addAll(getTraits(background.getPersonalities(), false));
        traits.addAll(getTraits(background.getIdeals(), false));
        traits.addAll(getTraits(background.getBonds(), false));
        traits.addAll(getTraits(background.getFlaws(), false));
        return traits;
    }

    private List<BackgroundTrait> getNewTraits(Background background) {
        List<BackgroundTrait> traits = getTraits(background.getVariations(), true);
        traits.addAll(getTraits(background.getPersonalities(), true));
        traits.addAll(getTraits(background.getIdeals(), true));
        traits.addAll(getTraits(background.getBonds(), true));
        traits.addAll(getTraits(background.getFlaws(), true));
        return traits;
    }

    private List<BackgroundTrait> getTraits(List<BackgroundTrait> traits, boolean isNew) {
        List<BackgroundTrait> list = new ArrayList<>();
        for (BackgroundTrait trait : traits) {
            if ((isNew && (trait.getId() == null || trait.getId().equals("0"))) || (!isNew && trait.getId() != null && !trait.getId().equals("0"))) {
                list.add(trait);
            }
        }
        return list;
    }

    public static List<BackgroundTrait> getBackgroundTraits(long characteristicId, int userId) throws Exception {
        List<BackgroundTrait> traits = new ArrayList<>();
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            traits = getBackgroundTraits(characteristicId, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
        return traits;
    }

    private static List<BackgroundTrait> getBackgroundTraits(long backgroundId, int userId, Connection connection) throws Exception {
        List<BackgroundTrait> traits = new ArrayList<>();
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            statement = connection.prepareStatement("SELECT id, background_trait_type_id, description FROM background_traits WHERE background_id = ?");
            statement.setLong(1, backgroundId);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                traits.add(getBackgroundTrait(resultSet, userId));
            }

            resultSet.close();
            statement.close();
        } catch (Exception e) {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            throw e;
        }

        return traits;
    }

    private static BackgroundTrait getBackgroundTrait(ResultSet resultSet, int userId) throws Exception {
        return new BackgroundTrait(
                MySql.encodeId(resultSet.getLong("id"), userId),
                BackgroundTraitType.valueOf(resultSet.getInt("background_trait_type_id")),
                resultSet.getString("description")
        );
    }

    private boolean hasTrait(BackgroundTrait trait, Background background) {
        return hasTrait(trait, background.getVariations())
            || hasTrait(trait, background.getPersonalities())
            || hasTrait(trait, background.getIdeals())
            || hasTrait(trait, background.getBonds())
            || hasTrait(trait, background.getFlaws());
    }

    private boolean hasTrait(BackgroundTrait trait, List<BackgroundTrait> traits) {
        for (int i = 0; i < traits.size(); i++) {
            if (traits.get(i).getId() != null && traits.get(i).getId().equals(trait.getId())) {
                return true;
            }
        }
        return false;
    }

    private void createTraits(long background, List<BackgroundTrait> traits, Connection connection) throws Exception {
        if (traits.size() == 0) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `background_traits` (`background_id`, `background_trait_type_id`, `description`) VALUES (?, ?, ?)");
            for (BackgroundTrait trait : traits) {
                statement.setLong(1, background);
                statement.setInt(2, trait.getBackgroundTraitType().getValue());
                statement.setString(3, MySql.getValue(trait.getDescription(), 1000));
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

    private void updateTraits(List<BackgroundTrait> traits, int userId, Connection connection) throws Exception {
        if (traits.size() == 0) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE `background_traits` SET description = ? WHERE id = ?");
            for (BackgroundTrait trait : traits) {
                statement.setString(1, MySql.getValue(trait.getDescription(), 1000));
                MySql.setId(2, trait.getId(), userId, statement);
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

    private void deleteTraits(List<Long> deletedTraits, Connection connection) throws Exception {
        if (deletedTraits.size() == 0) {
            return;
        }
        PreparedStatement statement = null;
        try {
            String traitIds = MySql.joinLongIds(deletedTraits);
            statement = connection.prepareStatement("DELETE FROM background_traits WHERE id IN (" + traitIds + ")");
            statement.executeUpdate();
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
        if (!(characteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        Background background = (Background) characteristic;
        long backgroundId = MySql.decodeId(background.getId(), userId);

        List<Long> originalBackgrounds = new ArrayList<>();
        List<Long> newBackgrounds = new ArrayList<>();
        originalBackgrounds.add(backgroundId);
        
        background.setId("0");

        resetTraitIds(background.getVariations());
        resetTraitIds(background.getPersonalities());
        resetTraitIds(background.getIdeals());
        resetTraitIds(background.getBonds());
        resetTraitIds(background.getFlaws());

        for (Background subBackground : background.getSubBackgrounds()) {
            originalBackgrounds.add(MySql.decodeId(subBackground.getId(), userId));
            subBackground.setId("0");

            resetTraitIds(subBackground.getVariations());
            resetTraitIds(subBackground.getPersonalities());
            resetTraitIds(subBackground.getIdeals());
            resetTraitIds(subBackground.getBonds());
            resetTraitIds(subBackground.getFlaws());
        }

        long newId = create(background, userId);
        newBackgrounds.add(newId);
        updateSubBackgrounds(newId, background, userId);
        for (Background subBackground : background.getSubBackgrounds()) {
            newBackgrounds.add(MySql.decodeId(subBackground.getId(), userId));
        }
        
        String encodedNewId = MySql.encodeId(newId, userId);

        if (originalBackgrounds.size() != newBackgrounds.size()) {
            throw new Exception("background not duplicated properly");
        }

        for (int i = 0; i < originalBackgrounds.size(); i++) {
            long originalBackgroundId = originalBackgrounds.get(i);
            long newBackgroundId = newBackgrounds.get(i);
            Background currentBackground = i == 0 ? background : background.getSubBackgrounds().get(i - 1);
            String encodedNewBackgroundId = MySql.encodeId(newBackgroundId, userId);

            List<Feature> features = FeatureService.getFeaturesForCharacteristic(originalBackgroundId, userId);
            for (Feature feature : features) {
                feature.setId("0");
                feature.getCharacteristic().setId(encodedNewBackgroundId);
                PowerService.createPower(feature, userId);
            }

            CharacteristicService.addSpellConfigurations(newBackgroundId, currentBackground.getSpellConfigurations(), userId);
        }

        return encodedNewId;
    }

    @Override
    public void addToShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        Background background = (Background)characteristic;
        long backgroundId = MySql.decodeId(background.getId(), userId);

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToShareList(background.getAbilityModifiers(), userId, shareList);
            SharingUtilityService.addProficienciesToShareList(background.getSavingThrowProfs(), userId, true, false, shareList);
            AttributeService.addToShareList(background.getSpellCastingAbility(), userId, shareList);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToShareList(background.getMiscModifiers(), userId, shareList);
        }

        SharingUtilityService.addProficienciesToShareList(background.getArmorProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getToolProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getWeaponProfs(), userId, false, true, shareList);

        SharingUtilityService.addProficienciesToShareList(background.getArmorTypeProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getLanguageProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getSkillProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getSkillChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getToolCategoryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getToolCategoryChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(background.getWeaponTypeProfs(), userId, true, false, shareList);

        SharingUtilityService.addSpellConfigurationsToShareList(background.getSpellConfigurations(), userId, shareList);
        SharingUtilityService.addStartingEquipmentToShareList(background.getStartingEquipment(), userId, shareList);
        SharingUtilityService.addDamageModifiersToShareList(background.getDamageModifiers(), userId, shareList);
        AttributeService.addToShareList(background.getConditionImmunities(), userId, shareList);

        shareList.getCharacteristics().add(background.getId());

        CharacteristicService.addCharacteristicFeaturesToShareList(backgroundId, userId, shareList);

        for (Background subBackground : background.getSubBackgrounds()) {
            CharacteristicService.addToShareList(MySql.decodeId(subBackground.getId(), userId), userId, shareList);
        }
    }

    @Override
    public void addToUnShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        Background background = (Background)characteristic;
        long backgroundId = MySql.decodeId(background.getId(), userId);

        shareList.getCharacteristics().add(background.getId());

        CharacteristicService.addCharacteristicFeaturesToUnShareList(backgroundId, userId, shareList);

        for (Background subBackground : background.getSubBackgrounds()) {
            CharacteristicService.addToShareList(MySql.decodeId(subBackground.getId(), userId), userId, shareList);
        }
    }

    @Override
    public long addToMyStuff(Characteristic authorCharacteristic, int authorUserId, ListObject existingCharacteristic, int userId) throws Exception {
        if (!(authorCharacteristic instanceof Background)) {
            throw new Exception("Invalid characteristic type");
        }
        long authorCharacteristicId = MySql.decodeId(authorCharacteristic.getId(), authorUserId);
        Background background = (Background)authorCharacteristic;

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToMyStuff(background.getAbilityModifiers(), userId);
            SharingUtilityService.addProficienciesToMyStuff(background.getSavingThrowProfs(), userId, true, false);

            String spellcastingAbility = AttributeService.addToMyStuff(background.getSpellCastingAbility(), userId);
            background.setSpellCastingAbility(spellcastingAbility);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToMyStuff(background.getMiscModifiers(), userId);
        }

        SharingUtilityService.addProficienciesToMyStuff(background.getArmorProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(background.getToolProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(background.getWeaponProfs(), userId, false, true);

        SharingUtilityService.addProficienciesToMyStuff(background.getArmorTypeProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getLanguageProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getSkillProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getSkillChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getToolCategoryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getToolCategoryChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(background.getWeaponTypeProfs(), userId, true, false);

        SharingUtilityService.addSpellConfigurationsToMyStuff(background.getSpellConfigurations(), userId);
        SharingUtilityService.addStartingEquipmentToMyStuff(background.getStartingEquipment(), userId);
        SharingUtilityService.addDamageModifiersToMyStuff(background.getDamageModifiers(), userId);
        AttributeService.addToMyStuff(background.getConditionImmunities(), userId);

        long backgroundId;
        if (background.getSid() != 0) {
            CharacteristicService.addSystemCharacteristic(MySql.decodeId(background.getId(), authorUserId), userId);
            backgroundId = MySql.decodeId(background.getId(), authorUserId);
        } else {
            if (existingCharacteristic == null) {
                backgroundId = create(background, userId);
            } else {
                backgroundId = MySql.decodeId(existingCharacteristic.getId(), userId);
                update(background, backgroundId, userId);
            }
        }

        CharacteristicService.addCharacteristicFeaturesToMyStuff(authorCharacteristicId, backgroundId, userId, authorUserId);
        if (background.getSid() == 0) {
            CharacteristicService.deleteSpellConfigurations(backgroundId, userId);
            CharacteristicService.addSpellConfigurations(backgroundId, background.getSpellConfigurations(), userId);
        }

        for (Background subBackground : background.getSubBackgrounds()) {
            CharacteristicService.addToMyStuff(MySql.decodeId(subBackground.getId(), authorUserId), backgroundId, userId, false);
        }

        return backgroundId;
    }

    private void updateSubBackgrounds(long classId, Background background, int userId) throws Exception {
        List<Long> deletedSubBackgrounds = getDeletedSubBackgrounds(classId, background, userId);
        try {
            // if one of these subBackgrounds are currently in use, this will throw an exception
            for (Long deleted : deletedSubBackgrounds) {
                CharacteristicService.delete(deleted, userId);
            }
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }

        for (Background subBackground : background.getSubBackgrounds()) {
            long id = MySql.decodeId(subBackground.getId(), userId);
            subBackground.setParent(background);
            if (id > 0) {
                CharacteristicService.updateCharacteristic(subBackground, userId);
            } else {
                create(subBackground, userId);
            }
        }
    }

    private List<Long> getDeletedSubBackgrounds(long classId, Background background, int userId) throws Exception {
        List<Long> children = CharacteristicService.getChildrenCharacteristics(classId, userId);
        List<Long> deleted = new ArrayList<>();
        for(Long child : children) {
            int index = getIndexOfChild(background, child, userId);
            if (index == -1) {
                deleted.add(child);
            }
        }
        return deleted;
    }

    private int getIndexOfChild(Background background, long childId, int userId) throws Exception {
        for (int i = 0; i < background.getSubBackgrounds().size(); i++) {
            if (MySql.decodeId(background.getSubBackgrounds().get(i).getId(), userId) == childId) {
                return i;
            }
        }
        return -1;
    }

    private void resetTraitIds(List<BackgroundTrait> traits) {
        for (BackgroundTrait trait : traits) {
            trait.setId("0");
        }
    }
}
