DROP PROCEDURE IF EXISTS Items_GetList_Weapons;

DELIMITER ;;
CREATE PROCEDURE Items_GetList_Weapons(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN weaponTypeId INT UNSIGNED,
    IN weaponRangeType TINYINT UNSIGNED,
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;
    SET itemTypeId = 1;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM items WHERE user_id = userId
        UNION
        SELECT item_id FROM items_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT item_id FROM items_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT item_id FROM items_private WHERE user_id = userId;
    END IF;

    SELECT i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id
    FROM temp_list ui
        JOIN items i ON i.id = ui.id
            AND i.item_type_id = itemTypeId
        JOIN weapons w ON w.item_id = i.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
        AND (weaponTypeId IS NULL OR w.weapon_type_id = weaponTypeId)
        AND (weaponRangeType IS NULL OR w.weapon_range_type = weaponRangeType)
    ORDER BY i.name
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Items_GetList_Weapons(1, null, null, null, 0, 100, 1);