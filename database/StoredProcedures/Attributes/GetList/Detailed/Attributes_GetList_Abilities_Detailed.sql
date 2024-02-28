DROP PROCEDURE IF EXISTS Attributes_GetList_Abilities_Detailed;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Abilities_Detailed(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED
)
BEGIN
    SELECT a.id AS attribute_id, a.name, a.description, a.sid, a.user_id = userId AS is_author, ab.abbr, a.user_id = userId AS is_author, a.version
    FROM (SELECT id AS attribute_id FROM attributes WHERE user_id = userId
        UNION
        SELECT attribute_id FROM attributes_shared WHERE user_id = userId) AS ua
        JOIN attributes a ON a.id = ua.attribute_id
        JOIN abilities ab on a.id = ab.attribute_id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY attribute_id
    LIMIT offset, pageSize;
END;;

DELIMITER ;

# CALL Attributes_GetList_Abilities_Detailed(1, null, 0, 1000);