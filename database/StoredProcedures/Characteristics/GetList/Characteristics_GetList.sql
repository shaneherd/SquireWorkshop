DROP PROCEDURE IF EXISTS Characteristics_GetList;

DELIMITER ;;
CREATE PROCEDURE Characteristics_GetList(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN includeChildren BIT,
    IN authorOnly BIT,
    IN characteristicTypeId TINYINT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM characteristics WHERE user_id = userId
        UNION
        SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT characteristic_id FROM characteristics_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT characteristic_id FROM characteristics_private WHERE user_id = userId;
    END IF;

    SELECT c.id AS characteristic_id, name, sid, c.user_id = userId AS is_author
    FROM temp_list ua
        JOIN characteristics c ON c.id = ua.id
            AND (authorOnly = 0 OR c.user_id = userId)
            AND c.characteristic_type_id = characteristicTypeId
            AND (includeChildren OR c.parent_characteristic_id IS NULL)
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY name
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Characteristics_GetList(1, '', 0, 1000, 1 ,0, 2, 1);

