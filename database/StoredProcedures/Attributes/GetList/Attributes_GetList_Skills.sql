DROP PROCEDURE IF EXISTS Attributes_GetList_Skills;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Skills(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN orderBy VARCHAR(100),
    IN orderByAscending BIT,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    IF orderBy IS NULL THEN
        SET orderBy = 'name';
    END IF;

    IF orderByAscending IS NULL THEN
        SET orderByAscending = 1;
    END IF;

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

    SELECT a.id AS attribute_id, a.name, a.description, a.sid, a.user_id = userId AS is_author
    FROM temp_list ua
        JOIN attributes a ON a.id = ua.id
        JOIN skills s ON s.attribute_id = a.id
        LEFT JOIN attributes ability ON ability.id = s.ability_id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR a.name LIKE search)
    ORDER BY
        (CASE WHEN orderBy = 'name' AND orderByAscending = 1 THEN a.name END),
        (CASE WHEN orderBy = 'name' AND orderByAscending = 0 THEN a.name END) DESC,
        (CASE WHEN orderBy = 'ability_name' AND orderByAscending = 1 THEN ability.name END),
        (CASE WHEN orderBy = 'ability_name' AND orderByAscending = 0 THEN ability.name END) DESC
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Attributes_GetList_Skills(1, null, 0, 1000, 'ability_name', 1, 1);

