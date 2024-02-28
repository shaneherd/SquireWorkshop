package com.herd.squire.services.characteristics;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.CasterType;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.characteristics.character_class.CharacterClass;
import com.herd.squire.models.characteristics.character_class.ClassSpellPreparation;
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
import com.herd.squire.services.attributes.CasterTypeService;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_MISC;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class ClassService implements CharacteristicDetailsService {

    @Override
    public Characteristic get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getCharacterClassFull(statement, resultSet, userId, true, true);
    }

    public static CharacterClass getCharacterClassFull(Statement statement, ResultSet resultSet, int userId, boolean includeSubclasses, boolean includeParent) throws Exception {
        long parentId = resultSet.getLong("parent_characteristic_id");
        CharacterClass characterClass = getCharacterClass(statement, resultSet, userId);
        long classId = MySql.decodeId(characterClass.getId(), userId);


        List<Long> subclassIds = new ArrayList<>();

        // Subclasses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                subclassIds.add(resultSet.getLong("id"));
            }
        }

        if (includeSubclasses) {
            characterClass.setSubclasses(getSubclasses(classId, subclassIds, userId));
        }

        if (includeParent && parentId != 0 && parentId != classId) {
            CharacterClass parent = get(parentId, userId, classId, true);
            if (parent != null) {
                characterClass.setParent(parent);
            }
        }

        return characterClass;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, boolean includeChildren, boolean authorOnly, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Characteristics_GetList_Classes (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setBoolean(5, includeChildren);
        statement.setBoolean(6, authorOnly);
        statement.setInt(7, listSource.getValue());
        return statement;
    }

    public static CharacterClass get(long id, int userId, long originalId) throws Exception {
        return get(id, userId, originalId, true);
    }

    public static CharacterClass get(long id, int userId, long originalId, boolean includeParent) throws Exception {
        if (id == 0) {
            return null;
        }
        long parentId = 0;
        CharacterClass characterClass = null;
        List<Long> subclassIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Characteristics_Get_Class(?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    parentId = resultSet.getLong("parent_characteristic_id");
                    characterClass = getCharacterClass(statement, resultSet, userId);
                }
            }

            // Subclasses
            if (characterClass != null && statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    subclassIds.add(resultSet.getLong("id"));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (characterClass != null) {
            characterClass.setSubclasses(getSubclasses(id, subclassIds, userId));

            if (includeParent && parentId != 0 && parentId != originalId) {
                CharacterClass parent = get(parentId, userId, originalId, true);
                if (parent != null) {
                    characterClass.setParent(parent);
                }
            }
        }
        return characterClass;
    }

    private static List<CharacterClass> getSubclasses(long classId, List<Long> subclassIds, int userId) throws Exception {
        List<CharacterClass> subclasses = new ArrayList<>();
        for (Long subClassId : subclassIds) {
            subclasses.add(get(subClassId, userId, classId, false));
        }
        return subclasses;
    }

    private static CharacterClass getCharacterClass(Statement statement, ResultSet resultSet, int userId) throws Exception {
        CharacterClass characterClass = new CharacterClass(
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
                getHpAtFirst(resultSet, userId),
                getHitDice(resultSet),
                getHpGain(resultSet, userId),
                getStartingGold(resultSet),
                getClassSpellPreparation(resultSet, userId),
                resultSet.getInt("num_secondary_skills"),
                resultSet.getInt("num_secondary_tools")
            );

        // Profs and Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> abilityModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            characterClass.setAbilityModifiers(abilityModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Modifier> miscModifiers = CharacteristicService.getAttributeModifiers(resultSet, userId);
            characterClass.setMiscModifiers(miscModifiers);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> abilityProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSavingThrowProfs(abilityProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setArmorTypeProfs(armorTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> languageProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setLanguageProfs(languageProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSkillProfs(skillProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setToolCategoryProfs(toolCategoryProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setWeaponTypeProfs(weaponTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillChoices = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSkillChoiceProfs(skillChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryChoices = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setToolCategoryChoiceProfs(toolCategoryChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setArmorProfs(armorProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setToolProfs(toolProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setWeaponProfs(weaponProfs);
        }

        // SpellConfigurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SpellConfiguration> spellConfigurations = CharacteristicService.getSpellConfigurations(resultSet, userId);
            characterClass.setSpellConfigurations(spellConfigurations);
        }

        // Starting Equipment
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<StartingEquipment> startingEquipment = CharacteristicService.getStartingEquipments(resultSet, userId);
            characterClass.setStartingEquipment(startingEquipment);
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageModifier> damageModifiers = CharacteristicService.getDamageModifiers(resultSet, userId);
            characterClass.setDamageModifiers(damageModifiers);
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ListObject> conditionImmunities = CharacteristicService.getConditionImmunities(resultSet, userId);
            characterClass.setConditionImmunities(conditionImmunities);
        }

        // Senses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SenseValue> senses = CharacteristicService.getSenses(resultSet);
            characterClass.setSenses(senses);
        }

        // Secondary Profs and Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> abilityProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSavingThrowSecondaryProfs(abilityProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setArmorTypeSecondaryProfs(armorTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> languageProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setLanguageSecondaryProfs(languageProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSkillSecondaryProfs(skillProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setToolCategorySecondaryProfs(toolCategoryProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponTypeProfs = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setWeaponTypeSecondaryProfs(weaponTypeProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> skillChoices = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setSkillSecondaryChoiceProfs(skillChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolCategoryChoices = CharacteristicService.getProfs(resultSet, userId, true);
            characterClass.setToolCategorySecondaryChoiceProfs(toolCategoryChoices);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> armorProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setArmorSecondaryProfs(armorProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> toolProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setToolSecondaryProfs(toolProfs);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Proficiency> weaponProfs = CharacteristicService.getProfs(resultSet, userId, false);
            characterClass.setWeaponSecondaryProfs(weaponProfs);
        }

        // Ability Score Increases
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<String> abilityScoreIncreases = new ArrayList<>();
            while (resultSet.next()) {
                abilityScoreIncreases.add(MySql.encodeId(resultSet.getLong("level_id"), userId));
            }
            characterClass.setAbilityScoreIncreases(abilityScoreIncreases);
        }

        // Caster Type
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                characterClass.setCasterType(getCasterType(statement, resultSet, userId));
            } else {
                // Discard Caster Type Spell Slots result
                if (statement.getMoreResults()) {
                    statement.getResultSet();
                }
            }
        }

        return characterClass;
    }

    private static CasterType getCasterType(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("spellcaster_type_id");
        CasterType casterType = null;
        if (id != 0) {
            casterType = new CasterType(
                    MySql.encodeId(id, userId),
                    resultSet.getString("name"),
                    resultSet.getString("description"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author"),
                    resultSet.getInt("version"),
                    resultSet.getInt("multiclass_weight"),
                    resultSet.getBoolean("round_up")
            );
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (casterType != null) {
                casterType.setSpellSlots(CasterTypeService.getSpellSlots(resultSet, userId));
            }
        }

        return casterType;
    }

    private static DiceCollection getHpAtFirst(ResultSet resultSet, int userId) throws Exception {
        return new DiceCollection(
                resultSet.getInt("hp_at_first"),
                null,
                getHpAtFirstAbilityModifier(resultSet, userId),
                0
        );
    }

    private static Ability getHpAtFirstAbilityModifier(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("hp_at_first_ability_modifier_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("hp_at_first_ability_modifier_name"),
                resultSet.getString("hp_at_first_ability_modifier_description"),
                resultSet.getInt("hp_at_first_ability_modifier_sid"),
                resultSet.getBoolean("hp_at_first_ability_modifier_is_author"),
                resultSet.getInt("hp_at_first_ability_modifier_version"),
                resultSet.getString("hp_at_first_ability_modifier_abbr")
        );
    }

    private static DiceCollection getHitDice(ResultSet resultSet) throws Exception {
        return new DiceCollection(
                resultSet.getInt("hit_dice_num_dice"),
                DiceSize.valueOf(resultSet.getInt("hit_dice_size_id")),
                null,
                resultSet.getInt("hit_dice_misc_modifier")
        );
    }

    private static DiceCollection getHpGain(ResultSet resultSet, int userId) throws Exception {
        return new DiceCollection(
                resultSet.getInt("hp_gain_num_dice"),
                DiceSize.valueOf(resultSet.getInt("hp_gain_dice_size_id")),
                getHpGainAbilityModifier(resultSet, userId),
                resultSet.getInt("hp_gain_misc_modifier")
        );
    }

    private static Ability getHpGainAbilityModifier(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("hp_gain_ability_modifier_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("hp_gain_ability_modifier_name"),
                resultSet.getString("hp_gain_ability_modifier_description"),
                resultSet.getInt("hp_gain_ability_modifier_sid"),
                resultSet.getBoolean("hp_gain_ability_modifier_is_author"),
                resultSet.getInt("hp_gain_ability_modifier_version"),
                resultSet.getString("hp_gain_ability_modifier_abbr")
        );
    }

    private static DiceCollection getStartingGold(ResultSet resultSet) throws Exception {
        return new DiceCollection(
                resultSet.getInt("starting_gold_num_dice"),
                DiceSize.valueOf(resultSet.getInt("starting_gold_dice_size")),
                null,
                resultSet.getInt("starting_gold_misc_modifier")
        );
    }

    private static ClassSpellPreparation getClassSpellPreparation(ResultSet resultSet, int userId) throws Exception {
        return new ClassSpellPreparation(
                resultSet.getBoolean("requires_spell_preparation"),
                getPrepareAbilityModifier(resultSet, userId),
                resultSet.getBoolean("prepare_include_class_level"),
                resultSet.getBoolean("prepare_include_half_class_level"),
                resultSet.getInt("prepare_misc_modifier")
        );
    }

    private static Ability getPrepareAbilityModifier(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("prepare_ability_modifier_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("prepare_ability_modifier_name"),
                resultSet.getString("prepare_ability_modifier_description"),
                resultSet.getInt("prepare_ability_modifier_sid"),
                resultSet.getBoolean("prepare_ability_modifier_is_author"),
                resultSet.getInt("prepare_ability_modifier_version"),
                resultSet.getString("prepare_ability_modifier_abbr")
        );
    }

    @Override
    public long create(Characteristic characteristic, int userId) throws Exception {
        if (!(characteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        CharacterClass characterClass = (CharacterClass) characteristic;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Create_Class (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");

            statement.setString(1, MySql.getValue(characteristic.getName(), 45));
            MySql.setId(2, characteristic.getParent() == null ? null : characteristic.getParent().getId(), userId, statement);
            statement.setInt(3, MySql.getValue(characteristic.getNumAbilities(), 0, 9));
            statement.setInt(4, MySql.getValue(characteristic.getNumLanguages(), 0, 99));
            statement.setInt(5, MySql.getValue(characteristic.getNumSavingThrows(), 0, 9));
            statement.setInt(6, MySql.getValue(characteristic.getNumSkills(), 0, 99));
            statement.setInt(7, MySql.getValue(characteristic.getNumTools(), 0, 99));
            MySql.setId(8, characteristic.getSpellCastingAbility() == null || characteristic.getSpellCastingAbility().equals("0") ? null : characteristic.getSpellCastingAbility(), userId, statement);

            statement.setString(9, MySql.getValue(characterClass.getDescription(), 2000)); //description
            statement.setInt(10, MySql.getValue(characterClass.getHpAtFirst().getNumDice(), 0, 99)); //hp_at_first
            setAbilityLong(11, characterClass.getHpAtFirst().getAbilityModifier(), userId, statement); //hp_at_first_ability_modifier_id
            statement.setInt(12, MySql.getValue(characterClass.getHitDice().getNumDice(), 0, 99)); //hit_dice_num_dice
            statement.setInt(13, characterClass.getHitDice().getDiceSize().getValue()); //hit_dice_size_id
            statement.setInt(14, MySql.getValue(characterClass.getHitDice().getMiscModifier(), 0, 99)); //hit_dice_misc_modifier
            statement.setInt(15, MySql.getValue(characterClass.getHpGain().getNumDice(), 0, 99)); //hp_gain_num_dice
            statement.setInt(16, characterClass.getHpGain().getDiceSize().getValue()); //hp_gain_dice_size_id
            setAbilityLong(17, characterClass.getHpGain().getAbilityModifier(), userId, statement); //hp_gain_ability_modifier_id
            statement.setInt(18, MySql.getValue(characterClass.getHpGain().getMiscModifier(), 0, 99)); //hp_gain_misc_modifier
            MySql.setId(19, characterClass.getCasterType() == null ? null : characterClass.getCasterType().getId(), userId, statement); //spellcaster_type_id
            statement.setBoolean(20, characterClass.getClassSpellPreparation().isRequirePreparation()); //requires_spell_preparation
            setAbilityLong(21, characterClass.getClassSpellPreparation().getNumToPrepareAbilityModifier(), userId, statement); //prepare_ability_modifier_id
            statement.setBoolean(22, characterClass.getClassSpellPreparation().isNumToPrepareIncludeLevel()); //prepare_include_class_level
            statement.setBoolean(23, characterClass.getClassSpellPreparation().isNumToPrepareIncludeHalfLevel()); //prepare_include_half_class_level
            statement.setInt(24, MySql.getValue(characterClass.getClassSpellPreparation().getNumToPrepareMiscModifier(), 0, 99)); //prepare_misc_modifier
            statement.setInt(25, MySql.getValue(characterClass.getStartingGold().getNumDice(), 0, 99)); //starting_gold_num_dice
            statement.setInt(26, characterClass.getStartingGold() == null || characterClass.getStartingGold().getDiceSize() == null ? DiceSize.ONE.getValue() : characterClass.getStartingGold().getDiceSize().getValue()); //starring_gold_dice_size
            statement.setInt(27, characterClass.getStartingGold() == null ? 0 : MySql.getValue(characterClass.getStartingGold().getMiscModifier(), 0, 99)); //starting_gold_misc_modifier
            statement.setInt(28, MySql.getValue(characterClass.getNumSecondarySkills(), 0, 99)); //num_secondary_skills
            statement.setInt(29, MySql.getValue(characterClass.getNumSecondaryTools(), 0, 99)); //num_secondary_tools

            statement.setInt(30, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("characteristic_id");
                    characterClass.setId(MySql.encodeId(id, userId));
                }
            }

            if (id != -1) {
                updateProfs(id, characterClass, userId, connection);
                updateClassAbilityScoreIncreases(id, characterClass, userId, connection);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

//        if (id != -1) {
//            // update subclasses after the main class has been committed
//            updateSubclasses(id, characterClass, userId);
//        }

        return id;
    }

    private void setAbilityLong(int index, Ability ability, int userId, PreparedStatement statement) throws Exception {
        String value = null;
        if (ability != null) {
            value = ability.getId();

            if (value.equals("0")) {
                value = null;
            }
        }
        MySql.setId(index, value, userId, statement);
    }

    @Override
    public boolean update(Characteristic characteristic, long id, int userId) throws Exception {
        if (!(characteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        CharacterClass characterClass = (CharacterClass) characteristic;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Characteristics_Update_Class (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
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

            statement.setString(11, MySql.getValue(characterClass.getDescription(), 2000)); //description
            statement.setInt(12, MySql.getValue(characterClass.getHpAtFirst().getNumDice(), 0, 99)); //hp_at_first
            setAbilityLong(13, characterClass.getHpAtFirst().getAbilityModifier(), userId, statement); //hp_at_first_ability_modifier_id
            statement.setInt(14, MySql.getValue(characterClass.getHitDice().getNumDice(), 0, 99)); //hit_dice_num_dice
            statement.setInt(15, characterClass.getHitDice().getDiceSize().getValue()); //hit_dice_size_id
            statement.setInt(16, MySql.getValue(characterClass.getHitDice().getMiscModifier(), 0, 99)); //hit_dice_misc_modifier
            statement.setInt(17, MySql.getValue(characterClass.getHpGain().getNumDice(), 0, 99)); //hp_gain_num_dice
            statement.setInt(18, characterClass.getHpGain().getDiceSize().getValue()); //hp_gain_dice_size_id
            setAbilityLong(19, characterClass.getHpGain().getAbilityModifier(), userId, statement); //hp_gain_ability_modifier_id
            statement.setInt(20, MySql.getValue(characterClass.getHpGain().getMiscModifier(), 0, 99)); //hp_gain_misc_modifier
            MySql.setId(21, characterClass.getCasterType() == null ? null : characterClass.getCasterType().getId(), userId, statement); //spellcaster_type_id
            statement.setBoolean(22, characterClass.getClassSpellPreparation().isRequirePreparation()); //requires_spell_preparation
            setAbilityLong(23, characterClass.getClassSpellPreparation().getNumToPrepareAbilityModifier(), userId, statement); //prepare_ability_modifier_id
            statement.setBoolean(24, characterClass.getClassSpellPreparation().isNumToPrepareIncludeLevel()); //prepare_include_class_level
            statement.setBoolean(25, characterClass.getClassSpellPreparation().isNumToPrepareIncludeHalfLevel()); //prepare_include_half_class_level
            statement.setInt(26, MySql.getValue(characterClass.getClassSpellPreparation().getNumToPrepareMiscModifier(), 0, 99)); //prepare_misc_modifier
            statement.setInt(27, MySql.getValue(characterClass.getStartingGold().getNumDice(), 0, 99)); //starting_gold_num_dice
            statement.setInt(28, characterClass.getStartingGold().getDiceSize().getValue()); //starring_gold_dice_size
            statement.setInt(29, MySql.getValue(characterClass.getStartingGold().getMiscModifier(), 0, 99)); //starting_gold_misc_modifier
            statement.setInt(30, MySql.getValue(characterClass.getNumSecondarySkills(), 0, 99)); //num_secondary_skills
            statement.setInt(31, MySql.getValue(characterClass.getNumSecondaryTools(), 0, 99)); //num_secondary_tools

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateProfs(id, characterClass, userId, connection);
                updateClassAbilityScoreIncreases(id, characterClass, userId, connection);
                CharacteristicService.updateCommonCharacteristics(id, characteristic, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

//        if (success) {
//            // update subclasses after main class has been committed
//            updateSubclasses(id, characterClass, userId);
//        }

        return success;
    }

    private void updateSubclasses(long classId, CharacterClass characterClass, int userId) throws Exception {
        List<Long> deletedSubclasses = getDeletedSubclasses(classId, characterClass, userId);
        try {
            // if one of these subclasses are currently in use, this will throw an exception
            for (Long deleted : deletedSubclasses) {
                CharacteristicService.delete(deleted, userId);
            }
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }

        for (CharacterClass subclass : characterClass.getSubclasses()) {
            long id = MySql.decodeId(subclass.getId(), userId);
            subclass.setParent(characterClass);
            if (id > 0) {
                CharacteristicService.updateCharacteristic(subclass, userId);
            } else {
                create(subclass, userId);
            }
        }
    }

    private List<Long> getDeletedSubclasses(long classId, CharacterClass characterClass, int userId) throws Exception {
        List<Long> children = CharacteristicService.getChildrenCharacteristics(classId, userId);
        List<Long> deleted = new ArrayList<>();
        for(Long child : children) {
            int index = getIndexOfChild(characterClass, child, userId);
            if (index == -1) {
                deleted.add(child);
            }
        }
        return deleted;
    }

    private int getIndexOfChild(CharacterClass characterClass, long childId, int userId) throws Exception {
        for (int i = 0; i < characterClass.getSubclasses().size(); i++) {
            if (MySql.decodeId(characterClass.getSubclasses().get(i).getId(), userId) == childId) {
                return i;
            }
        }
        return -1;
    }

    private static void updateProfs(long classId, CharacterClass characterClass, int userId, Connection connection) throws Exception {
        deleteAllProfs(classId, connection);
        updateItemProfs(classId, characterClass.getArmorSecondaryProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getArmorTypeSecondaryProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getLanguageSecondaryProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getSavingThrowSecondaryProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getSkillSecondaryProfs(), userId, connection);
        updateChoiceProfs(classId, characterClass.getSkillSecondaryChoiceProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getToolCategorySecondaryProfs(), userId, connection);
        updateChoiceProfs(classId, characterClass.getToolCategorySecondaryChoiceProfs(), userId, connection);
        updateItemProfs(classId, characterClass.getToolSecondaryProfs(), userId, connection);
        updateItemProfs(classId, characterClass.getWeaponSecondaryProfs(), userId, connection);
        updateAttributeProfs(classId, characterClass.getWeaponTypeSecondaryProfs(), userId, connection);
    }

    private static void updateClassAbilityScoreIncreases(long classId, CharacterClass characterClass, int userId, Connection connection) throws Exception {
        deleteAllClassAbilityScoreIncreases(classId, connection);
        List<String> abilityScoreIncreases = characterClass.getAbilityScoreIncreases();
        if (abilityScoreIncreases.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `class_ability_score_increases` (`class_id`, `level_id`) VALUES (?, ?)");
            for (String abilityScoreIncrease : abilityScoreIncreases) {
                statement.setLong(1, classId);
                MySql.setId(2, abilityScoreIncrease, userId, statement);
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

    private static void updateAttributeProfs(long classId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `class_secondary_attribute_profs` (`class_id`, `attribute_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, classId);
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

    private static void updateItemProfs(long classId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `class_secondary_item_profs` (`class_id`, `item_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, classId);
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

    private static void updateChoiceProfs(long classId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `class_secondary_choice_profs` (`class_id`, `attribute_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, classId);
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

        @Override
    public String duplicate(Characteristic characteristic, int userId) throws Exception {
        if (!(characteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        CharacterClass characterClass = (CharacterClass) characteristic;
        long classId = MySql.decodeId(characterClass.getId(), userId);

        List<Long> originalClasses = new ArrayList<>();
        List<Long> newClasses = new ArrayList<>();
        originalClasses.add(classId);

        characterClass.setId("0");

        for (CharacterClass subclass : characterClass.getSubclasses()) {
            originalClasses.add(MySql.decodeId(subclass.getId(), userId));
            subclass.setId("0");
        }

        long newId = create(characterClass, userId);
        newClasses.add(newId);
        updateSubclasses(newId, characterClass, userId);
        for (CharacterClass subclass : characterClass.getSubclasses()) {
            newClasses.add(MySql.decodeId(subclass.getId(), userId));
        }

        String encodedNewId = MySql.encodeId(newId, userId);

        if (originalClasses.size() != newClasses.size()) {
            throw new Exception("class not duplicated properly");
        }

        for (int i = 0; i < originalClasses.size(); i++) {
            long originalClassId = originalClasses.get(i);
            long newClassId = newClasses.get(i);
            CharacterClass currentClass = i == 0 ? characterClass : characterClass.getSubclasses().get(i - 1);
            String encodedNewClassId = MySql.encodeId(newClassId, userId);

            List<Feature> features = FeatureService.getFeaturesForCharacteristic(originalClassId, userId);
            for (Feature feature : features) {
                feature.setId("0");
                feature.getCharacteristic().setId(encodedNewClassId);
                PowerService.createPower(feature, userId);
            }

            CharacteristicService.addSpellConfigurations(newClassId, currentClass.getSpellConfigurations(), userId);
        }

        return encodedNewId;
    }

    @Override
    public long addToMyStuff(Characteristic authorCharacteristic, int authorUserId, ListObject existingCharacteristic, int userId) throws Exception {
        if (!(authorCharacteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        long authorCharacteristicId = MySql.decodeId(authorCharacteristic.getId(), authorUserId);
        CharacterClass characterClass = (CharacterClass)authorCharacteristic;

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToMyStuff(characterClass.getAbilityModifiers(), userId);
            SharingUtilityService.addProficienciesToMyStuff(characterClass.getSavingThrowProfs(), userId, true, false);

            SharingUtilityService.addProficienciesToMyStuff(characterClass.getSavingThrowSecondaryProfs(), userId, true, false);

            String spellcastingAbility = AttributeService.addToMyStuff(characterClass.getSpellCastingAbility(), userId);
            characterClass.setSpellCastingAbility(spellcastingAbility);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToMyStuff(characterClass.getMiscModifiers(), userId);
        }

        SharingUtilityService.addProficienciesToMyStuff(characterClass.getArmorProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getWeaponProfs(), userId, false, true);

        SharingUtilityService.addProficienciesToMyStuff(characterClass.getArmorTypeProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getLanguageProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getSkillProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getSkillChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolCategoryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolCategoryChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getWeaponTypeProfs(), userId, true, false);

        SharingUtilityService.addSpellConfigurationsToMyStuff(characterClass.getSpellConfigurations(), userId);
        SharingUtilityService.addStartingEquipmentToMyStuff(characterClass.getStartingEquipment(), userId);
        SharingUtilityService.addDamageModifiersToMyStuff(characterClass.getDamageModifiers(), userId);
        AttributeService.addToMyStuff(characterClass.getConditionImmunities(), userId);

        AttributeService.addToMyStuff(characterClass.getCasterType(), userId);
        SharingUtilityService.addDiceCollectionToMyStuff(characterClass.getHpAtFirst(), userId);
        SharingUtilityService.addDiceCollectionToMyStuff(characterClass.getHitDice(), userId);
        SharingUtilityService.addDiceCollectionToMyStuff(characterClass.getHpGain(), userId);
        SharingUtilityService.addDiceCollectionToMyStuff(characterClass.getStartingGold(), userId);

        ClassSpellPreparation classSpellPreparation = characterClass.getClassSpellPreparation();
        if (classSpellPreparation != null) {
            AttributeService.addToMyStuff(classSpellPreparation.getNumToPrepareAbilityModifier(), userId);
        }

        SharingUtilityService.addProficienciesToMyStuff(characterClass.getArmorSecondaryProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolSecondaryProfs(), userId, false, true);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getWeaponSecondaryProfs(), userId, false, true);

        SharingUtilityService.addProficienciesToMyStuff(characterClass.getArmorTypeSecondaryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getLanguageSecondaryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getSkillSecondaryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getSkillSecondaryChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolCategorySecondaryProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getToolCategorySecondaryChoiceProfs(), userId, true, false);
        SharingUtilityService.addProficienciesToMyStuff(characterClass.getWeaponTypeSecondaryProfs(), userId, true, false);

        if (CUSTOM_ABILITIES && characterClass.getAbilityScoreIncreases() != null) {
            for (int i = 0; i < characterClass.getAbilityScoreIncreases().size(); i++) {
                String newId = AttributeService.addToMyStuff(characterClass.getAbilityScoreIncreases().get(i), userId);
                characterClass.getAbilityScoreIncreases().set(i, newId);
            }
        }

        long classId;
        if (characterClass.getSid() != 0) {
            CharacteristicService.addSystemCharacteristic(MySql.decodeId(characterClass.getId(), authorUserId), userId);
            classId = MySql.decodeId(characterClass.getId(), authorUserId);
        } else {
            if (existingCharacteristic == null) {
                classId = create(characterClass, userId);
            } else {
                classId = MySql.decodeId(existingCharacteristic.getId(), userId);
                update(characterClass, classId, userId);
            }
        }

        CharacteristicService.addCharacteristicFeaturesToMyStuff(authorCharacteristicId, classId, userId, authorUserId);
        if (characterClass.getSid() == 0) {
            CharacteristicService.deleteSpellConfigurations(classId, userId);
            CharacteristicService.addSpellConfigurations(classId, characterClass.getSpellConfigurations(), userId);
        }

        for (CharacterClass subClass : characterClass.getSubclasses()) {
            CharacteristicService.addToMyStuff(MySql.decodeId(subClass.getId(), authorUserId), classId, userId, false);
        }

        return classId;
    }

    @Override
    public void addToShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        CharacterClass characterClass = (CharacterClass)characteristic;
        long classId = MySql.decodeId(characterClass.getId(), userId);

        if (CUSTOM_ABILITIES) {
            SharingUtilityService.addModifiersToShareList(characterClass.getAbilityModifiers(), userId, shareList);
            SharingUtilityService.addProficienciesToShareList(characterClass.getSavingThrowProfs(), userId, true, false, shareList);

            SharingUtilityService.addProficienciesToShareList(characterClass.getSavingThrowSecondaryProfs(), userId, true, false, shareList);

            AttributeService.addToShareList(characterClass.getSpellCastingAbility(), userId, shareList);
        }

        if (CUSTOM_MISC) {
            SharingUtilityService.addModifiersToShareList(characterClass.getMiscModifiers(), userId, shareList);
        }

        SharingUtilityService.addProficienciesToShareList(characterClass.getArmorProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getWeaponProfs(), userId, false, true, shareList);

        SharingUtilityService.addProficienciesToShareList(characterClass.getArmorTypeProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getLanguageProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getSkillProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getSkillChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolCategoryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolCategoryChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getWeaponTypeProfs(), userId, true, false, shareList);

        SharingUtilityService.addSpellConfigurationsToShareList(characterClass.getSpellConfigurations(), userId, shareList);
        SharingUtilityService.addStartingEquipmentToShareList(characterClass.getStartingEquipment(), userId, shareList);
        SharingUtilityService.addDamageModifiersToShareList(characterClass.getDamageModifiers(), userId, shareList);
        AttributeService.addToShareList(characterClass.getConditionImmunities(), userId, shareList);

        AttributeService.addToShareList(characterClass.getCasterType(), userId, shareList);
        SharingUtilityService.addDiceCollectionToShareList(characterClass.getHpAtFirst(), userId, shareList);
        SharingUtilityService.addDiceCollectionToShareList(characterClass.getHitDice(), userId, shareList);
        SharingUtilityService.addDiceCollectionToShareList(characterClass.getHpGain(), userId, shareList);
        SharingUtilityService.addDiceCollectionToShareList(characterClass.getStartingGold(), userId, shareList);

        ClassSpellPreparation classSpellPreparation = characterClass.getClassSpellPreparation();
        if (classSpellPreparation != null) {
            AttributeService.addToShareList(classSpellPreparation.getNumToPrepareAbilityModifier(), userId, shareList);
        }

        SharingUtilityService.addProficienciesToShareList(characterClass.getArmorSecondaryProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolSecondaryProfs(), userId, false, true, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getWeaponSecondaryProfs(), userId, false, true, shareList);

        SharingUtilityService.addProficienciesToShareList(characterClass.getArmorTypeSecondaryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getLanguageSecondaryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getSkillSecondaryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getSkillSecondaryChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolCategorySecondaryProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getToolCategorySecondaryChoiceProfs(), userId, true, false, shareList);
        SharingUtilityService.addProficienciesToShareList(characterClass.getWeaponTypeSecondaryProfs(), userId, true, false, shareList);

        if (CUSTOM_ABILITIES && characterClass.getAbilityScoreIncreases() != null) {
            for (int i = 0; i < characterClass.getAbilityScoreIncreases().size(); i++) {
                AttributeService.addToShareList(characterClass.getAbilityScoreIncreases().get(i), userId, shareList);
            }
        }

        shareList.getCharacteristics().add(characterClass.getId());

        CharacteristicService.addCharacteristicFeaturesToShareList(classId, userId, shareList);

        for (CharacterClass subclass : characterClass.getSubclasses()) {
            CharacteristicService.addToShareList(MySql.decodeId(subclass.getId(), userId), userId, shareList);
        }
    }

    @Override
    public void addToUnShareList(Characteristic characteristic, int userId, ShareList shareList) throws Exception {
        if (!(characteristic instanceof CharacterClass)) {
            throw new Exception("Invalid characteristic type");
        }
        CharacterClass characterClass = (CharacterClass)characteristic;
        long classId = MySql.decodeId(characterClass.getId(), userId);

        shareList.getCharacteristics().add(characterClass.getId());

        CharacteristicService.addCharacteristicFeaturesToUnShareList(classId, userId, shareList);

        for (CharacterClass subclass : characterClass.getSubclasses()) {
            CharacteristicService.addToShareList(MySql.decodeId(subclass.getId(), userId), userId, shareList);
        }
    }

    private static void deleteAllProfs(long classId, Connection connection) throws Exception {
        deleteAllAttributeProfs(classId, connection);
        deleteAllItemProfs(classId, connection);
        deleteAllChoiceProfs(classId, connection);
    }

    private static void deleteAllAttributeProfs(long classId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM class_secondary_attribute_profs WHERE class_id = ?");
            statement.setLong(1, classId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllItemProfs(long classId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM class_secondary_item_profs WHERE class_id = ?");
            statement.setLong(1, classId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllChoiceProfs(long classId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM class_secondary_choice_profs WHERE class_id = ?");
            statement.setLong(1, classId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllClassAbilityScoreIncreases(long classId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM class_ability_score_increases WHERE class_id = ?");
            statement.setLong(1, classId);
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
