package com.herd.squire.services.powers;

import com.herd.squire.models.CastingTimeUnit;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.Tag;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.AreaOfEffect;
import com.herd.squire.models.attributes.SpellSchool;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.powers.*;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_SPELL_SCHOOLS;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class SpellService implements PowerDetailsService {
    @Override
    public Power get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getSpell(statement, resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String spellSchoolId = FilterService.getFilterValue(filterValues, FilterKey.SCHOOL);
        String spellSchoolIdValue = null;
        if (spellSchoolId != null && !spellSchoolId.equals(FilterValue.DEFAULT_OPTION)) {
            spellSchoolIdValue = spellSchoolId;
        }
        Boolean isRitual = FilterService.getFilterBoolean(filterValues, FilterKey.RITUAL);
        String spellLevel = FilterService.getFilterValue(filterValues, FilterKey.LEVEL);
        String spellLevelValue = null;
        if (spellLevel != null && !spellLevel.equals(FilterValue.DEFAULT_OPTION)) {
            spellLevelValue = spellLevel;
        }
        Boolean isAreaOfEffect = FilterService.getFilterBoolean(filterValues, FilterKey.AREA_OF_EFFECT);
        String areaOfEffectId = FilterService.getFilterValue(filterValues, FilterKey.SPELL_AREA_OF_EFFECT);
        String areaOfEffectIdValue = null;
        if (isAreaOfEffect != null && isAreaOfEffect && !areaOfEffectId.equals(FilterValue.DEFAULT_OPTION)) {
            areaOfEffectIdValue = areaOfEffectId;
        }
        Boolean isVerbal = FilterService.getFilterBoolean(filterValues, FilterKey.VERBAL);
        Boolean isSomatic = FilterService.getFilterBoolean(filterValues, FilterKey.SOMATIC);
        Boolean isMaterial = FilterService.getFilterBoolean(filterValues, FilterKey.MATERIAL);
        Boolean isConcentration = FilterService.getFilterBoolean(filterValues, FilterKey.CONCENTRATION);
        Boolean isInstantaneous = FilterService.getFilterBoolean(filterValues, FilterKey.INSTANTANEOUS);

        String characteristicId = "";
        String spellClass = FilterService.getFilterValue(filterValues, FilterKey.SPELL_CLASS);
        if (spellClass != null && !spellClass.equals(FilterValue.DEFAULT_OPTION)) {
            characteristicId = spellClass;
        }

        CallableStatement statement = connection.prepareCall("{call Powers_GetList_Spells (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);

        MySql.setId(3, spellSchoolIdValue, userId, statement);
        MySql.setBoolean(4, isRitual, statement);
        MySql.setInteger(5, spellLevelValue, statement);
        MySql.setBoolean(6, isVerbal, statement);
        MySql.setBoolean(7, isSomatic, statement);
        MySql.setBoolean(8, isMaterial, statement);
        MySql.setBoolean(9, isInstantaneous, statement);
        MySql.setBoolean(10, isConcentration, statement);
        MySql.setBoolean(11, isAreaOfEffect, statement);
        MySql.setId(12, areaOfEffectIdValue, userId, statement);
        MySql.setId(13, characteristicId, userId, statement);

        statement.setLong(14, offset);
        statement.setLong(15, PAGE_SIZE);
        statement.setInt(16, listSource.getValue());
        return statement;
    }

    public static CallableStatement getMissingSpellsStatement(long characterId, long assignedCharacteristicId, Connection connection, List<FilterValue> filterValues, long offset, int userId, boolean innate) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String spellSchoolId = FilterService.getFilterValue(filterValues, FilterKey.SCHOOL);
        String spellSchoolIdValue = null;
        if (spellSchoolId != null && !spellSchoolId.equals(FilterValue.DEFAULT_OPTION)) {
            spellSchoolIdValue = spellSchoolId;
        }
        Boolean isRitual = FilterService.getFilterBoolean(filterValues, FilterKey.RITUAL);
        String spellLevel = FilterService.getFilterValue(filterValues, FilterKey.LEVEL);
        String spellLevelValue = null;
        if (spellLevel != null && !spellLevel.equals(FilterValue.DEFAULT_OPTION)) {
            spellLevelValue = spellLevel;
        }
        Boolean isAreaOfEffect = FilterService.getFilterBoolean(filterValues, FilterKey.AREA_OF_EFFECT);
        String areaOfEffectId = FilterService.getFilterValue(filterValues, FilterKey.SPELL_AREA_OF_EFFECT);
        String areaOfEffectIdValue = null;
        if (isAreaOfEffect != null && isAreaOfEffect && !areaOfEffectId.equals(FilterValue.DEFAULT_OPTION)) {
            areaOfEffectIdValue = areaOfEffectId;
        }
        Boolean isVerbal = FilterService.getFilterBoolean(filterValues, FilterKey.VERBAL);
        Boolean isSomatic = FilterService.getFilterBoolean(filterValues, FilterKey.SOMATIC);
        Boolean isMaterial = FilterService.getFilterBoolean(filterValues, FilterKey.MATERIAL);
        Boolean isConcentration = FilterService.getFilterBoolean(filterValues, FilterKey.CONCENTRATION);
        Boolean isInstantaneous = FilterService.getFilterBoolean(filterValues, FilterKey.INSTANTANEOUS);

        String characteristicId = "";
        String spellClass = FilterService.getFilterValue(filterValues, FilterKey.SPELL_CLASS);
        if (spellClass != null && !spellClass.equals(FilterValue.DEFAULT_OPTION)) {
            characteristicId = spellClass;
        }

        String tags = FilterService.getFilterValue(filterValues, FilterKey.TAGS);
        String tagIds = null;
        if (tags != null && !tags.equals(FilterValue.DEFAULT_TAG_OPTION)) {
            List<Long> tagsIdsList = PowerService.getTagIds(tags.split(","), userId);
            tagIds = MySql.joinLongIds(tagsIdsList);
        }

        CallableStatement statement = connection.prepareCall("{call Creatures_Get_MissingSpells (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setLong(1, characterId);
        if (assignedCharacteristicId == 0) {
            statement.setNull(2, Types.BIGINT);
        } else {
            statement.setLong(2, assignedCharacteristicId);
        }
        statement.setInt(3, userId);

        MySql.setString(4, search, statement);
        MySql.setId(5, spellSchoolIdValue, userId, statement);
        MySql.setBoolean(6, isRitual, statement);
        MySql.setInteger(7, spellLevelValue, statement);
        MySql.setBoolean(8, isVerbal, statement);
        MySql.setBoolean(9, isSomatic, statement);
        MySql.setBoolean(10, isMaterial, statement);
        MySql.setBoolean(11, isInstantaneous, statement);
        MySql.setBoolean(12, isConcentration, statement);
        MySql.setBoolean(13, isAreaOfEffect, statement);
        MySql.setId(14, areaOfEffectIdValue, userId, statement);
        MySql.setId(15, characteristicId, userId, statement);
        MySql.setString(16, tagIds, statement);

        statement.setLong(17, offset);
        statement.setLong(18, PAGE_SIZE);
        statement.setBoolean(19, innate);
        return statement;
    }

    public static Map<Long, SpellListObject> getSpellListObjectsMapped(Long creatureId, int userId, List<Long> spellIds) throws Exception {
        Map<Long, SpellListObject> map = new HashMap<>();
        List<SpellListObject> spells = getSpellListObjects(creatureId, userId, spellIds);
        for (SpellListObject spell : spells) {
            map.put(MySql.decodeId(spell.getId(), userId), spell);
        }
        return map;
    }

    public static List<SpellListObject> getSpellListObjects(Long creatureId, int userId, List<Long> spellIds) throws Exception {
        List<SpellListObject> spells = new ArrayList<>();
        if (spellIds.isEmpty()) {
            return new ArrayList<>();
        }

        String ids = MySql.joinLongIds(spellIds);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_GetList_SpellsInList (?,?,?)}");
            MySql.setLong(1, creatureId, statement);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(ids, 500));
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    spells.add(getSpellListObject(resultSet, userId));
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                addTagsToSpells(spells, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return spells;
    }

    public static void addTagsToSpells(List<SpellListObject> spells, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (SpellListObject spell : spells) {
            long powerId = MySql.decodeId(spell.getId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                spell.setTags(tags);
            }
        }
    }

    public static Tag getTag(ResultSet resultSet, int userId) throws Exception {
        return new Tag(
                MySql.encodeId(resultSet.getLong("id"), userId),
                PowerType.valueOf(resultSet.getInt("power_type_id")),
                resultSet.getString("title"),
                resultSet.getString("color")
        );
    }

    public static List<SpellListObject> getSpells(ResultSet resultSet, int userId) throws Exception {
        List<SpellListObject> spells = new ArrayList<>();
        while (resultSet.next()) {
            spells.add(getSpellListObject(resultSet, userId));
        }
        return spells;
    }

    public static SpellListObject getSpellListObject(ResultSet resultSet, int userId) throws Exception {
        long spellId = resultSet.getLong("spell_id");
        return new SpellListObject(
                MySql.encodeId(spellId, userId),
                resultSet.getString("spell_name"),
                resultSet.getInt("spell_sid"),
                resultSet.getBoolean("spell_is_author"),
                resultSet.getInt("spell_level")
        );
    }

    public Spell get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Spell spell = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_Get_Spell (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    spell = getSpell(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return spell;
    }

    public static List<Spell> getSpells(List<Long> ids, int userId) throws Exception {
        if (ids.isEmpty()) {
            return null;
        }
        List<Spell> spells = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            for (Long id : ids) {
                statement = connection.prepareCall("{call Powers_Get_Spell (?,?)}");
                statement.setLong(1, id);
                statement.setInt(2, userId);
                boolean hasResult = statement.execute();
                if (hasResult) {
                    ResultSet resultSet = statement.getResultSet();
                    if (resultSet.next()) {
                        Spell spell = getSpell(statement, resultSet, userId);
                        if (spell != null) {
                            spells.add(spell);
                        }
                    }
                    resultSet.close();
                }
            }

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return spells;
    }

    private static Spell getSpell(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("power_id");
        if (id == 0) {
            return null;
        }
        Spell spell = new Spell(
                MySql.encodeId(id, userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                AttackType.valueOf(resultSet.getInt("attack_type")),
                resultSet.getBoolean("temporary_hp"),
                resultSet.getInt("attack_mod"),
                getSaveType(resultSet, userId),
                resultSet.getBoolean("half_on_save"),
                resultSet.getBoolean("extra_damage"),
                resultSet.getInt("num_levels_above_base"),
                resultSet.getBoolean("advancement"),
                resultSet.getBoolean("extra_modifiers"),
                resultSet.getInt("modifiers_num_levels_above_base"),
                resultSet.getBoolean("modifier_advancement"),
                resultSet.getInt("level"),
                getSpellSchool(resultSet, userId),
                resultSet.getBoolean("ritual"),
                resultSet.getInt("casting_time"),
                CastingTimeUnit.valueOf(resultSet.getInt("casting_time_unit")),
                RangeType.valueOf(resultSet.getInt("range_type")),
                resultSet.getInt("range"),
                RangeUnit.valueOf(resultSet.getInt("range_unit")),
                getPowerAreaOfEffect(resultSet, userId),
                resultSet.getBoolean("verbal"),
                resultSet.getBoolean("somatic"),
                resultSet.getBoolean("material"),
                resultSet.getString("components"),
                resultSet.getBoolean("instantaneous"),
                resultSet.getBoolean("concentration"),
                resultSet.getString("duration"),
                resultSet.getString("description"),
                resultSet.getString("higher_levels")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            spell.setDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            spell.setExtraDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            spell.setAdvancementDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            spell.setModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            spell.setExtraModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            spell.setAdvancementModifierConfigurations(modifierConfigurations);
        }

        return spell;
    }

    private static Ability getSaveType(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("save_type_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("save_type_name"),
                resultSet.getString("save_type_description"),
                resultSet.getInt("save_type_sid"),
                resultSet.getBoolean("save_type_is_author"),
                resultSet.getInt("save_type_version"),
                resultSet.getString("save_type_abbr")
        );
    }

    private static SpellSchool getSpellSchool(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("spell_school_id");
        if (id == 0) {
            return null;
        }
        return new SpellSchool(
                MySql.encodeId(id, userId),
                resultSet.getString("spell_school_name"),
                resultSet.getString("spell_school_description"),
                resultSet.getInt("spell_school_sid"),
                resultSet.getBoolean("spell_school_is_author"),
                resultSet.getInt("spell_school_version")
        );
    }

    private static PowerAreaOfEffect getPowerAreaOfEffect(ResultSet resultSet, int userId) throws Exception {
        return new PowerAreaOfEffect(
                getAreaOfEffect(resultSet, userId),
                resultSet.getInt("radius"),
                resultSet.getInt("width"),
                resultSet.getInt("height"),
                resultSet.getInt("length")
        );
    }

    private static AreaOfEffect getAreaOfEffect(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("area_of_effect_id");
        if (id == 0) {
            return null;
        }
        return new AreaOfEffect(
                MySql.encodeId(id, userId),
                resultSet.getString("area_of_effect_name"),
                resultSet.getString("area_of_effect_description"),
                resultSet.getInt("area_of_effect_sid"),
                resultSet.getBoolean("area_of_effect_is_author"),
                resultSet.getInt("area_of_effect_version"),
                resultSet.getBoolean("area_of_effect_radius"),
                resultSet.getBoolean("area_of_effect_width"),
                resultSet.getBoolean("area_of_effect_height"),
                resultSet.getBoolean("area_of_effect_length")
        );
    }

    @Override
    public long create(Power power, int userId) throws Exception {
        if (!(power instanceof Spell)) {
            throw new Exception("Invalid power type");
        }
        Spell spell = (Spell) power;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Powers_Create_Spell (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(power.getName(), 50));
            statement.setInt(2, power.getAttackType().getValue());
            statement.setBoolean(3, power.isTemporaryHP());
            statement.setInt(4, MySql.getValue(power.getAttackMod(), 0, 99));
            MySql.setId(5, power.getSaveType() == null ? null : power.getSaveType().getId(), userId, statement);
            statement.setBoolean(6, power.isHalfOnSave());
            statement.setBoolean(7, power.isExtraDamage());
            statement.setInt(8, MySql.getValue(power.getNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(9, power.isAdvancement());
            statement.setBoolean(10, power.isExtraModifiers());
            statement.setInt(11, MySql.getValue(power.getModifiersNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(12, power.isAdvancementModifiers());
            statement.setInt(13, power.getRangeType().getValue());
            statement.setInt(14, MySql.getValue(power.getRange(), 0, 9999));
            statement.setInt(15, power.getRangeUnit().getValue());
            MySql.setLong(16, getAreaOfEffect(power, userId), statement);
            statement.setInt(17, MySql.getValue(power.getPowerAreaOfEffect().getRadius(), 0, 9999));
            statement.setInt(18, MySql.getValue(power.getPowerAreaOfEffect().getWidth(), 0, 9999));
            statement.setInt(19, MySql.getValue(power.getPowerAreaOfEffect().getHeight(), 0, 9999));
            statement.setInt(20, MySql.getValue(power.getPowerAreaOfEffect().getLength(), 0, 9999));

            statement.setInt(21, spell.getLevel());
            MySql.setId(22, spell.getSpellSchool().getId(), userId, statement);
            statement.setBoolean(23, spell.isRitual());
            statement.setInt(24, MySql.getValue(spell.getCastingTime(), 0, 99));
            statement.setInt(25, spell.getCastingTimeUnit().getValue());
            statement.setBoolean(26, spell.isVerbal());
            statement.setBoolean(27, spell.isSomatic());
            statement.setBoolean(28, spell.isMaterial());
            statement.setString(29, MySql.getValue(spell.getComponents(), 500));
            statement.setBoolean(30, spell.isInstantaneous());
            statement.setBoolean(31, spell.isConcentration());
            statement.setString(32, MySql.getValue(spell.getDuration(), 45));
            statement.setString(33, MySql.getValue(spell.getDescription(), 4000));
            statement.setString(34, MySql.getValue(spell.getHigherLevels(), 1000));

            statement.setInt(35, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getInt("power_id");
                }
            }

            if (id != -1) {
                PowerService.updateCommonPowerTraits(id, power, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    private static Long getAreaOfEffect(Power power, int userId) throws Exception {
        return power.getPowerAreaOfEffect().getAreaOfEffect() == null || power.getPowerAreaOfEffect().getAreaOfEffect().getId().equals("0") ? null : MySql.decodeId(power.getPowerAreaOfEffect().getAreaOfEffect().getId(), userId);
    }

    @Override
    public boolean update(Power power, long powerId, int userId) throws Exception {
        if (!(power instanceof Spell)) {
            throw new Exception("Invalid power type");
        }
        Spell spell = (Spell) power;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Powers_Update_Spell (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, powerId);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(power.getName(), 50));
            statement.setInt(4, power.getAttackType().getValue());
            statement.setBoolean(5, power.isTemporaryHP());
            statement.setInt(6, MySql.getValue(power.getAttackMod(), 0, 99));
            MySql.setId(7, power.getSaveType() == null ? null : power.getSaveType().getId(), userId, statement);
            statement.setBoolean(8, power.isHalfOnSave());
            statement.setBoolean(9, power.isExtraDamage());
            statement.setInt(10, MySql.getValue(power.getNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(11, power.isAdvancement());
            statement.setBoolean(12, power.isExtraModifiers());
            statement.setInt(13, MySql.getValue(power.getModifiersNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(14, power.isAdvancementModifiers());
            statement.setInt(15, power.getRangeType().getValue());
            statement.setInt(16, MySql.getValue(power.getRange(), 0, 9999));
            statement.setInt(17, power.getRangeUnit().getValue());
            MySql.setLong(18, getAreaOfEffect(power, userId), statement);
            statement.setInt(19, MySql.getValue(power.getPowerAreaOfEffect().getRadius(), 0, 9999));
            statement.setInt(20, MySql.getValue(power.getPowerAreaOfEffect().getWidth(), 0, 9999));
            statement.setInt(21, MySql.getValue(power.getPowerAreaOfEffect().getHeight(), 0, 9999));
            statement.setInt(22, MySql.getValue(power.getPowerAreaOfEffect().getLength(), 0, 9999));

            statement.setInt(23, spell.getLevel());
            MySql.setId(24, spell.getSpellSchool().getId(), userId, statement);
            statement.setBoolean(25, spell.isRitual());
            statement.setInt(26, MySql.getValue(spell.getCastingTime(), 0, 99));
            statement.setInt(27, spell.getCastingTimeUnit().getValue());
            statement.setBoolean(28, spell.isVerbal());
            statement.setBoolean(29, spell.isSomatic());
            statement.setBoolean(30, spell.isMaterial());
            statement.setString(31, MySql.getValue(spell.getComponents(), 500));
            statement.setBoolean(32, spell.isInstantaneous());
            statement.setBoolean(33, spell.isConcentration());
            statement.setString(34, MySql.getValue(spell.getDuration(), 45));
            statement.setString(35, MySql.getValue(spell.getDescription(), 4000));
            statement.setString(36, MySql.getValue(spell.getHigherLevels(), 1000));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                PowerService.updateCommonPowerTraits(powerId, power, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    @Override
    public long addToMyStuff(Power authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception {
        if (!(authorPower instanceof Spell)) {
            throw new Exception("Invalid power type");
        }
        Spell spell = (Spell)authorPower;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(spell.getSaveType(), userId);
        }
        SharingUtilityService.addDamageConfigurationsToMyStuff(spell.getDamageConfigurations(), userId);
        SharingUtilityService.addDamageConfigurationsToMyStuff(spell.getExtraDamageConfigurations(), userId);
        SharingUtilityService.addDamageConfigurationsToMyStuff(spell.getAdvancementDamageConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(spell.getModifierConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(spell.getExtraModifierConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(spell.getAdvancementModifierConfigurations(), userId);
        SharingUtilityService.addPowerAreaOfEffectToMyStuff(spell.getPowerAreaOfEffect(), userId);
        SharingUtilityService.addLimitedUsesToMyStuff(spell.getLimitedUses(), userId);

        if (CUSTOM_SPELL_SCHOOLS) {
            AttributeService.addToMyStuff(spell.getSpellSchool(), userId);
        }

        long spellId;
        if (spell.getSid() != 0) {
            PowerService.addSystemPower(MySql.decodeId(spell.getId(), authorUserId), userId);
            spellId = MySql.decodeId(spell.getId(), authorUserId);
        } else {
            if (existingPower == null) {
                spellId = create(spell, userId);
            } else {
                spellId = MySql.decodeId(existingPower.getId(), userId);
                update(spell, spellId, userId);
            }
        }

        return spellId;
    }

    @Override
    public void addToShareList(Power power, int userId, ShareList shareList) throws Exception {
        if (!(power instanceof Spell)) {
            throw new Exception("Invalid power type");
        }
        Spell spell = (Spell)power;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(spell.getSaveType(), userId, shareList);
        }
        SharingUtilityService.addDamageConfigurationsToShareList(spell.getDamageConfigurations(), userId, shareList);
        SharingUtilityService.addDamageConfigurationsToShareList(spell.getExtraDamageConfigurations(), userId, shareList);
        SharingUtilityService.addDamageConfigurationsToShareList(spell.getAdvancementDamageConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(spell.getModifierConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(spell.getExtraModifierConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(spell.getAdvancementModifierConfigurations(), userId, shareList);
        SharingUtilityService.addPowerAreaOfEffectToShareList(spell.getPowerAreaOfEffect(), userId, shareList);
        SharingUtilityService.addLimitedUsesToShareList(spell.getLimitedUses(), userId, shareList);

        if (CUSTOM_SPELL_SCHOOLS) {
            AttributeService.addToShareList(spell.getSpellSchool(), userId, shareList);
        }
        shareList.getPowers().add(power.getId());
    }
}
