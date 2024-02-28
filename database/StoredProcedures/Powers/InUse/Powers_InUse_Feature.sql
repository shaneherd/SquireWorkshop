DROP PROCEDURE IF EXISTS Powers_InUse_Feature;

DELIMITER ;;
CREATE PROCEDURE Powers_InUse_Feature(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_powers cap
        JOIN creature_actions ca ON ca.id = cap.creature_action_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ca.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_powers cap
        JOIN creature_actions ca ON ca.id = cap.creature_action_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ca.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT cp.creature_id, 0
    FROM creature_powers cp
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cp.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT cp.creature_id, 0
    FROM creature_powers cp
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cp.creature_id
    WHERE power_id = powerId;

    # Get Values
    SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
    FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
        JOIN creatures c ON t.id = c.id
    ORDER BY sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Powers_InUse_Feature(419, 1);
