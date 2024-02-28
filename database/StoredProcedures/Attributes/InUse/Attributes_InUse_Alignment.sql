DROP PROCEDURE IF EXISTS Attributes_InUse_Alignment;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_Alignment(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_attributes
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_creatures
    SELECT c.id, 0
    FROM creatures c
        JOIN creatures uc ON uc.user_id = userId AND uc.id = c.id AND c.alignment_id = attributeId;

    INSERT INTO temp_creatures
    SELECT id, 0
    FROM creatures c
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = c.id AND c.alignment_id = attributeId;

    INSERT INTO temp_attributes
    SELECT d.attribute_id, 1
    FROM deities d
        JOIN attributes a ON a.user_id = userId AND a.id = d.attribute_id AND d.alignment_id = attributeId;

    INSERT INTO temp_attributes
    SELECT d.attribute_id, 1
    FROM deities d
        JOIN attributes_shared a ON a.user_id = userId AND a.attribute_id = d.attribute_id AND d.alignment_id = attributeId;

    INSERT INTO temp_items
    SELECT miaa.magical_item_id, 1
    FROM magical_item_attunement_alignments miaa
        JOIN items ui ON ui.user_id = userId AND ui.id = miaa.magical_item_id
    WHERE miaa.alignment_id = attributeId;

    INSERT INTO temp_items
    SELECT miaa.magical_item_id, 1
    FROM magical_item_attunement_alignments miaa
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = miaa.magical_item_id
    WHERE miaa.alignment_id = attributeId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 5 AS type_id, a.attribute_type_id AS sub_type_id, a.id, a.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_attributes GROUP BY id) AS t
            JOIN attributes a ON t.id = a.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_attributes;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
END;;

DELIMITER ;

# CALL Attributes_InUse_Alignment(138, 1);

