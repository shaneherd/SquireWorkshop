DROP PROCEDURE IF EXISTS Attributes_InUse_DeityCategory;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_DeityCategory(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_attributes
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_attributes
    SELECT d.attribute_id, 0
    FROM deities d
        JOIN attributes a ON a.user_id = userId AND a.id = d.attribute_id AND d.deity_category_id = attributeId;

    INSERT INTO temp_attributes
    SELECT d.attribute_id, 0
    FROM deities d
        JOIN attributes_shared a ON a.user_id = userId AND a.attribute_id = d.attribute_id AND d.deity_category_id = attributeId;

    # Get Values
    SELECT 5 AS type_id, a.attribute_type_id AS sub_type_id, a.id, a.name, t.required
    FROM (SELECT id, MAX(required) AS required FROM temp_attributes GROUP BY id) AS t
        JOIN attributes a ON t.id = a.id
    ORDER BY sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_attributes;
END;;

DELIMITER ;

# CALL Attributes_InUse_DeityCategory(147, 1);

