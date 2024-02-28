DROP PROCEDURE IF EXISTS Items_GetList_Packs;

DELIMITER ;;
CREATE PROCEDURE Items_GetList_Packs(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;
    SET itemTypeId = 8;

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

    CREATE TEMPORARY TABLE IF NOT EXISTS applicable_packs
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO applicable_packs
    SELECT i.id
    FROM temp_list ui
        JOIN items i ON i.id = ui.id
            AND i.item_type_id = itemTypeId
        JOIN packs p ON p.item_id = i.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
    ORDER BY i.name
    LIMIT offset, pageSize;

    SELECT i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id
    FROM applicable_packs ap
        JOIN items i ON i.id = ap.id
    ORDER BY i.name;

    SELECT pi.pack_id, i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id, pi.quantity,
           pi.sub_item_id, i2.name AS sub_item_name, i2.sid AS sub_item_sid, i2.user_id = userId AS sub_item_is_author, i2.cost AS sub_item_cost,
           i2.cost_unit AS sub_item_cost_unit, i2.item_type_id AS sub_item_type_id
    FROM pack_items pi
        JOIN applicable_packs ap ON ap.id = pi.pack_id
        JOIN items i ON pi.item_id = i.id
        LEFT JOIN items i2 ON pi.sub_item_id = i2.id;

    DROP TEMPORARY TABLE IF EXISTS applicable_packs;
    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Items_GetList_Packs(1, null, 0, 100, 1);