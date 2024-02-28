DROP PROCEDURE IF EXISTS Attributes_InUse_ToolCategory;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_ToolCategory(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
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

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_monsters
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_items
    SELECT t.item_id, 1
    FROM tools t
        JOIN items ui ON ui.user_id = userId AND ui.id = t.item_id AND t.tool_category_id = attributeId;

    INSERT INTO temp_items
    SELECT t.item_id, 1
    FROM tools t
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = t.item_id AND t.tool_category_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_attribute_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_attribute_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_choice_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_choice_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_attribute_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_attribute_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_choice_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_choice_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_creatures
    SELECT p.creature_id, 0
    FROM creature_attribute_profs p
        JOIN creatures uc ON uc.user_id = userId AND uc.id = p.creature_id AND p.attribute_id = attributeId
            AND (advantage = 1 OR disadvantage = 1 OR proficient = 1 OR double_prof = 1 OR half_prof = 1 OR misc_modifier != 0);

    INSERT INTO temp_creatures
    SELECT p.creature_id, 0
    FROM creature_attribute_profs p
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = p.creature_id AND p.attribute_id = attributeId
            AND (advantage = 1 OR disadvantage = 1 OR proficient = 1 OR double_prof = 1 OR half_prof = 1 OR misc_modifier != 0);

    INSERT INTO temp_monsters
    SELECT p.monster_id, 0
    FROM monster_attribute_profs p
             JOIN monsters uc ON uc.user_id = userId AND uc.id = p.monster_id AND p.attribute_id = attributeId;

    INSERT INTO temp_monsters
    SELECT p.monster_id, 0
    FROM monster_attribute_profs p
             JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = p.monster_id AND p.attribute_id = attributeId;

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

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id

        UNION

        SELECT 5 AS type_id, null AS sub_type_id, m.id, m.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_monsters GROUP BY id) AS t
                 JOIN monsters m ON t.id = m.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_monsters;
END;;

DELIMITER ;

# CALL Attributes_InUse_ToolCategory(120, 1);

