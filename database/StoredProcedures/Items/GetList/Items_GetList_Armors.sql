DROP PROCEDURE IF EXISTS Items_GetList_Armors;

DELIMITER ;;
CREATE PROCEDURE Items_GetList_Armors(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN armorTypeId INT UNSIGNED,
    IN isContainer BIT,
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;
    SET itemTypeId = 2;

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
        JOIN armors a ON a.item_id = i.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
        AND (armorTypeId IS NULL OR a.armor_type_id = armorTypeId)
        AND (isContainer IS NULL OR i.container = isContainer)
    ORDER BY i.name
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Items_GetList_Armors(1, null, null, null, 0, 100, 1);