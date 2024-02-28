DROP PROCEDURE IF EXISTS Attributes_GetList;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN attributeTypeId TINYINT UNSIGNED,
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
        attribute_id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM attributes WHERE user_id = userId
        UNION
        SELECT attribute_id FROM attributes_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list
        SELECT attribute_id
        FROM attributes_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT attribute_id FROM attributes_private WHERE user_id = userId;
    END IF;

    SELECT a.id AS attribute_id, name, description, sid, a.user_id = userId AS is_author
    FROM temp_list t
        JOIN attributes a ON a.id = t.attribute_id
            AND a.attribute_type_id = attributeTypeId
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY
        (CASE WHEN orderBy = 'name' AND orderByAscending = 1 THEN name END),
        (CASE WHEN orderBy = 'name' AND orderByAscending = 0 THEN name END) DESC
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Attributes_GetList(1, null, 0, 1000, 1, 'name', 0, 1);

