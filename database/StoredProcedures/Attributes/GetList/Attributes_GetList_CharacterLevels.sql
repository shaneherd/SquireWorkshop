DROP PROCEDURE IF EXISTS Attributes_GetList_CharacterLevels;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_CharacterLevels(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE attributeTypeId TINYINT UNSIGNED;
    SET attributeTypeId = 7;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM attributes WHERE user_id = userId
        UNION
        SELECT attribute_id FROM attributes_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT attribute_id FROM attributes_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT attribute_id FROM attributes_private WHERE user_id = userId;
    END IF;

    SELECT a.id AS attribute_id, name, description, sid, a.user_id = userId AS is_author
    FROM temp_list ua
        JOIN attributes a ON a.id = ua.id
            AND a.attribute_type_id = attributeTypeId
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY attribute_id
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Attributes_GetList_CharacterLevels(1, null, 0, 1000, 1);
