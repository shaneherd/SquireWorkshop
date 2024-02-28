DROP PROCEDURE IF EXISTS Attributes_InUse_Condition;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_Condition(
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

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_characteristics
    SELECT cci.characteristic_id, 0
    FROM characteristic_condition_immunities cci
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = cci.characteristic_id
    WHERE condition_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cci.characteristic_id, 0
    FROM characteristic_condition_immunities cci
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = cci.characteristic_id
    WHERE condition_id = attributeId;

    INSERT INTO temp_attributes
    SELECT parent_condition_id, 0
    FROM connecting_conditions cc
        JOIN attributes a ON a.user_id = userId AND a.id = cc.child_condition_id AND cc.child_condition_id = attributeId;

    INSERT INTO temp_attributes
    SELECT parent_condition_id, 0
    FROM connecting_conditions cc
        JOIN attributes_shared a ON a.user_id = userId AND a.attribute_id = cc.child_condition_id AND cc.child_condition_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cci.creature_id, 0
    FROM creature_condition_immunities cci
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cci.creature_id
    WHERE condition_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cci.creature_id, 0
    FROM creature_condition_immunities cci
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cci.creature_id
    WHERE condition_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cc.creature_id, 0
    FROM creature_conditions cc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cc.creature_id
    WHERE condition_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cc.creature_id, 0
    FROM creature_conditions cc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cc.creature_id
    WHERE condition_id = attributeId;

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

        SELECT 5 AS type_id, a.attribute_type_id AS sub_type_id, a.id, a.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_attributes GROUP BY id) AS t
            JOIN attributes a ON t.id = a.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_attributes;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Attributes_InUse_Condition(54, 1);

