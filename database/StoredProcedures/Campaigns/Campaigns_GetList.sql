DROP PROCEDURE IF EXISTS Campaigns_GetList;

DELIMITER ;;
CREATE PROCEDURE Campaigns_GetList(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED
)
BEGIN
    SELECT id, name, description, user_id = userId AS is_author
    FROM campaigns
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
        AND user_id = userId
    ORDER BY name
    LIMIT offset, pageSize;
END;;

DELIMITER ;

# CALL Campaigns_GetList(1, null, 0, 1000);

