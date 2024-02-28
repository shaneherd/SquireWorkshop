DROP PROCEDURE IF EXISTS Creatures_GetList_Characters;

DELIMITER ;;
CREATE PROCEDURE Creatures_GetList_Characters(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM creatures WHERE creature_type_id = 1 AND user_id = userId
        UNION
        SELECT creature_id FROM creatures_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT creature_id FROM creatures_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT creature_id FROM creatures_private WHERE user_id = userId;
    END IF;

    SELECT c.id, name, sid, c.user_id = userId AS is_author
    FROM temp_list uc
        JOIN creatures c ON c.id = uc.id
    WHERE creature_type_id = 1
        AND (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY name
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

