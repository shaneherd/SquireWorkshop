DROP PROCEDURE IF EXISTS Attributes_GetList_Skills_Detailed;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Skills_Detailed(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED
)
BEGIN
    SELECT a.id, a.name, a.description, a.sid, s.ability_id, a2.name AS ability_name,
           a2.description AS ability_description, ab.abbr AS ability_abbr, a2.sid AS ability_sid,
           a2.user_id = userId AS ability_is_author, a2.version AS ability_version,
           a.user_id = userId AS is_author, a.version
    FROM (SELECT id AS attribute_id FROM attributes WHERE user_id = userId
          UNION
          SELECT attribute_id FROM attributes_shared WHERE user_id = userId) AS ua
        JOIN attributes a ON a.id = ua.attribute_id
        JOIN skills s on a.id = s.attribute_id
        JOIN abilities ab on s.ability_id = ab.attribute_id
        JOIN attributes a2 ON a2.id = ab.attribute_id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR a.name LIKE search)
    ORDER BY name
    LIMIT offset, pageSize;
END;;

DELIMITER ;

# CALL Attributes_GetList_Skills_Detailed(1, null, 0, 1000);
