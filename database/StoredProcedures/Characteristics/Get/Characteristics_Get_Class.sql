DROP PROCEDURE IF EXISTS Characteristics_Get_Class;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Class(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE casterTypeId INT UNSIGNED;
    DECLARE classId INT UNSIGNED;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_secondary_class_attribute_profs
    (
        attribute_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_secondary_class_choice_profs
    (
        attribute_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_secondary_class_item_profs
    (
        item_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    SET classId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);
    IF classId IS NULL THEN
        SET classId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = characteristicId);
    END IF;
    IF classId IS NULL THEN
        SET classId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = characteristicId);
    END IF;

    SET casterTypeId = (SELECT spellcaster_type_id FROM classes WHERE characteristic_id = classId);

    SELECT c.id, c.name, c.sid, c.parent_characteristic_id, c.num_abilities, c.num_languages, c.num_saving_throws,
           c.num_skills, c.num_tools, c.spellcasting_ability_id, cl.description, cl.hp_at_first,
           cl.hp_at_first_ability_modifier_id, hpAtFirst.name AS hp_at_first_ability_modifier_name, hpAtFirst.description AS hp_at_first_ability_modifier_description, hpAtFirst.sid AS hp_at_first_ability_modifier_sid, hpAtFirst.user_id = userId AS hp_at_first_ability_modifier_is_author, hpAtFirst.version AS hp_at_first_ability_modifier_version, hpAtFirst2.abbr AS hp_at_first_ability_modifier_abbr,
           cl.hit_dice_num_dice, cl.hit_dice_size_id, cl.hit_dice_misc_modifier, cl.hp_gain_num_dice, cl.hp_gain_dice_size_id,
           cl.hp_gain_ability_modifier_id, hpGainAbility.name AS hp_gain_ability_modifier_name, hpGainAbility.description AS hp_gain_ability_modifier_description, hpGainAbility.sid AS hp_gain_ability_modifier_sid, hpGainAbility.user_id = userId AS hp_gain_ability_modifier_is_author, hpGainAbility.version AS hp_gain_ability_modifier_version, hpGainAbiltiy2.abbr AS hp_gain_ability_modifier_abbr,
           cl.hp_gain_misc_modifier, cl.spellcaster_type_id, cl.requires_spell_preparation,
           cl.prepare_ability_modifier_id, prepareAbility.name AS prepare_ability_modifier_name, prepareAbility.description AS prepare_ability_modifier_description, prepareAbility.sid AS prepare_ability_modifier_sid, prepareAbility.user_id = userId AS prepare_ability_modifier_is_author, prepareAbility.version AS prepare_ability_modifier_version, prepareAbility2.abbr AS prepare_ability_modifier_abbr,
           cl.prepare_include_class_level, cl.prepare_include_half_class_level, cl.prepare_misc_modifier,
           cl.starting_gold_num_dice, cl.starting_gold_dice_size, cl.starting_gold_misc_modifier,
           cl.num_secondary_skills, cl.num_secondary_tools, c.user_id = userId AS is_author, c.version
    FROM characteristics c
        JOIN classes cl on c.id = cl.characteristic_id AND c.id = classId
        LEFT JOIN attributes hpAtFirst ON hpAtFirst.id = cl.hp_at_first_ability_modifier_id
        LEFT JOIN abilities hpAtFirst2 ON hpAtFirst2.attribute_id = hpAtFirst.id
        LEFT JOIN attributes hpGainAbility ON hpGainAbility.id = cl.hp_gain_ability_modifier_id
        LEFT JOIN abilities hpGainAbiltiy2 ON hpGainAbiltiy2.attribute_id = hpGainAbility.id
        LEFT JOIN attributes prepareAbility ON prepareAbility.id = cl.prepare_ability_modifier_id
        LEFT JOIN abilities prepareAbility2 ON prepareAbility2.attribute_id = prepareAbility.id;

    IF classID IS NOT NULL THEN
        CALL Characteristics_ProfsAndModifiers(classId);
        CALL Characteristics_SpellConfigurations(classId, userId);
        CALL Characteristics_StartingEquipment(classId, 0, userId);
        CALL Characteristics_DamageModifiers(classId, userId);
        CALL Characteristics_ConditionImmunities(classId, userId);
        CALL Characteristics_Senses(classId);

        INSERT INTO temp_secondary_class_attribute_profs
        SELECT attribute_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
        FROM class_secondary_attribute_profs
        WHERE class_id = classId;

        INSERT INTO temp_secondary_class_choice_profs
        SELECT attribute_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
        FROM class_secondary_choice_profs
        WHERE class_id = classId;

        INSERT INTO temp_secondary_class_item_profs
        SELECT item_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
        FROM class_secondary_item_profs
        WHERE class_id = classId;

        # Ability Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN abilities joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Armor Type Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN armor_types joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Language Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN languages joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Skill Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN skills joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Tool Category Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN tool_categories joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Weapon Type Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_attribute_profs profTable
            JOIN weapon_types joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Skill Choice Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_choice_profs profTable
            JOIN skills joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Tool Category Choice Profs
        SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
        FROM temp_secondary_class_choice_profs profTable
            JOIN tool_categories joinTable ON profTable.attribute_id = joinTable.attribute_id
            JOIN attributes a ON profTable.attribute_id = a.id;

        # Armor Profs
        SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, joinTable.armor_type_id AS category_id
        FROM temp_secondary_class_item_profs profTable
            JOIN armors joinTable ON profTable.item_id = joinTable.item_id
            JOIN items i ON profTable.item_id = i.id;

        # Tool Profs
        SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, null AS category_id
        FROM temp_secondary_class_item_profs profTable
            JOIN tools joinTable ON profTable.item_id = joinTable.item_id
            JOIN items i ON profTable.item_id = i.id;

        # Weapon Profs
        SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, joinTable.weapon_type_id AS category_id
        FROM temp_secondary_class_item_profs profTable
            JOIN weapons joinTable ON profTable.item_id = joinTable.item_id
            JOIN items i ON profTable.item_id = i.id;

        # Ability Score Increases
        SELECT level_id
        FROM class_ability_score_increases
        WHERE class_id = classId;

        # Caster Type
        SELECT a.id AS spellcaster_type_id, a.name, a.description, a.sid, ct.multiclass_weight, ct.round_up, a.user_id = userId AS is_author, a.version
        FROM attributes a
            JOIN caster_types ct ON a.id = ct.attribute_id AND a.id = casterTypeId;

        # Caster Type Spell Slots
        SELECT c.id AS character_level_id, c.name AS character_level_name, c.sid AS character_level_sid, c.user_id = userId AS character_level_is_author,
               slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9
        FROM caster_type_spell_slots ctss
            JOIN attributes c ON ctss.character_level_id = c.id AND ctss.caster_type_id = casterTypeId;

        # Subclasses
        SELECT s.id
        FROM characteristics c
            JOIN characteristics s ON s.parent_characteristic_id = c.id AND (s.user_id = c.user_id OR s.user_id IN (0, userId))
        WHERE s.parent_characteristic_id = classId;
    END IF;

    DROP TEMPORARY TABLE IF EXISTS temp_secondary_class_attribute_profs;
    DROP TEMPORARY TABLE IF EXISTS temp_secondary_class_choice_profs;
    DROP TEMPORARY TABLE IF EXISTS temp_secondary_class_item_profs;
END;;

DELIMITER ;

# CALL Characteristics_Get_Class(2, 1);
