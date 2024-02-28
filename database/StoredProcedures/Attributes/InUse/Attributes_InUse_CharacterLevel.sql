DROP PROCEDURE IF EXISTS Attributes_InUse_CharacterLevel;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_CharacterLevel(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_attributes
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_attributes
    SELECT caster_type_id, 0
    FROM caster_type_spell_slots ss
        JOIN attributes a ON a.user_id = userId AND a.id = ss.caster_type_id
    WHERE character_level_id = attributeId;

    INSERT INTO temp_attributes
    SELECT caster_type_id, 0
    FROM caster_type_spell_slots ss
        JOIN attributes_shared a ON a.user_id = userId AND a.attribute_id = ss.caster_type_id
    WHERE character_level_id = attributeId;

    INSERT INTO temp_creatures
    SELECT uc.id, 1
    FROM character_chosen_classes ccc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ccc.character_id AND ccc.level_id = attributeId;

    INSERT INTO temp_creatures
    SELECT uc.creature_id, 1
    FROM character_chosen_classes ccc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ccc.character_id AND ccc.level_id = attributeId;

    INSERT INTO temp_creatures
    SELECT uc.id, 1
    FROM character_health_gain_results h
        JOIN character_chosen_classes ccc ON ccc.id = h.chosen_class_id AND h.level_id = attributeId
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ccc.character_id;

    INSERT INTO temp_creatures
    SELECT uc.creature_id, 1
    FROM character_health_gain_results h
        JOIN character_chosen_classes ccc ON ccc.id = h.chosen_class_id AND h.level_id = attributeId
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ccc.character_id;

    INSERT INTO temp_characteristics
    SELECT csc.characteristic_id, 0
    FROM characteristic_spell_configurations csc
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = csc.characteristic_id AND csc.level_gained = attributeId;

    INSERT INTO temp_characteristics
    SELECT csc.characteristic_id, 0
    FROM characteristic_spell_configurations csc
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = csc.characteristic_id AND csc.level_gained = attributeId;

    INSERT INTO temp_characteristics
    SELECT asi.class_id, 0
    FROM class_ability_score_increases asi
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = asi.class_id AND asi.level_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT asi.class_id, 0
    FROM class_ability_score_increases asi
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = asi.class_id AND asi.level_id = attributeId;

    INSERT INTO temp_creatures
    SELECT csc.creature_id, 0
    FROM creature_spell_configurations csc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = csc.creature_id AND csc.level_gained = attributeId;

    INSERT INTO temp_creatures
    SELECT csc.creature_id, 0
    FROM creature_spell_configurations csc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = csc.creature_id AND csc.level_gained = attributeId;

    INSERT INTO temp_powers
    SELECT f.power_id, 0
    FROM features f
        JOIN powers up ON up.user_id = userId AND up.id = f.power_id AND f.character_level_id = attributeId;

    INSERT INTO temp_powers
    SELECT f.power_id, 0
    FROM features f
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = f.power_id AND f.character_level_id = attributeId;

    INSERT INTO temp_powers
    SELECT pd.power_id, 0
    FROM power_damages pd
        JOIN powers up ON up.user_id = userId AND up.id = pd.power_id AND pd.character_level_id = attributeId;

    INSERT INTO temp_powers
    SELECT pd.power_id, 0
    FROM power_damages pd
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = pd.power_id AND pd.character_level_id = attributeId;

    INSERT INTO temp_powers
    SELECT l.power_id, 0
    FROM power_limited_uses l
        JOIN powers up ON up.user_id = userId AND up.id = l.power_id AND l.level_id = attributeId;

    INSERT INTO temp_powers
    SELECT l.power_id, 0
    FROM power_limited_uses l
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = l.power_id AND l.level_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
        JOIN powers up ON up.user_id = userId AND up.id = pm.power_id AND pm.character_level_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = pm.power_id AND pm.character_level_id = attributeId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 2 AS type_id, c.characteristic_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_characteristics GROUP BY id) AS t
            JOIN characteristics c ON t.id = c.id

        UNION

        SELECT 3 AS type_id, p.power_type_id AS sub_type_id, p.id, p.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_powers GROUP BY id) AS t
            JOIN powers p ON t.id = p.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id

        UNION

        SELECT 5 AS type_id, a.attribute_type_id AS sub_type_id, a.id, a.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_attributes GROUP BY id) AS t
            JOIN attributes a ON t.id = a.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_attributes;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_powers;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Attributes_InUse_CharacterLevel(7, 1);

