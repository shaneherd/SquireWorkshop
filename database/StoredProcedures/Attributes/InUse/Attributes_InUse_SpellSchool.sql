DROP PROCEDURE IF EXISTS Attributes_InUse_SpellSchool;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_SpellSchool(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_powers
    SELECT s.power_id, 1
    FROM spells s
        JOIN powers up ON up.user_id = userId AND up.id = s.power_id AND s.spell_school_id = attributeId;

    INSERT INTO temp_powers
    SELECT s.power_id, 1
    FROM spells s
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = s.power_id AND s.spell_school_id = attributeId;

    # Get Values
    SELECT 3 AS type_id, p.power_type_id AS sub_type_id, p.id, p.name, t.required
    FROM (SELECT id, MAX(required) AS required FROM temp_powers GROUP BY id) AS t
        JOIN powers p ON t.id = p.id
    ORDER BY sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_powers;
END;;

DELIMITER ;

# CALL Attributes_InUse_SpellSchool(32, 1);

