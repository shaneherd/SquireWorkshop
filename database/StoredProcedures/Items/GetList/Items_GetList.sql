DROP PROCEDURE IF EXISTS Items_GetList;

DELIMITER ;;
CREATE PROCEDURE Items_GetList(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE pro BIT;
    SET pro = (SELECT role FROM users u JOIN user_subscriptions s on u.id = s.user_id WHERE id = userId AND s.expired = 0) = 'PRO';
    IF pro = 0 THEN
        SET pro = (SELECT user_subscription_type_id FROM user_subscriptions WHERE user_id = userId AND expired = 0) = 2;
    END IF;

    CREATE TEMPORARY TABLE IF NOT EXISTS applicable_items
    (
        id INT UNSIGNED NOT NULL
    );

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

    INSERT INTO applicable_items
    SELECT i.id
    FROM temp_list ui
        JOIN items i ON i.id = ui.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search) AND (pro = 1 OR i.item_type_id != 9)
    ORDER BY i.name
    LIMIT offset, pageSize;

    SELECT i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id
    FROM applicable_items a
        JOIN items i ON i.id = a.id
    ORDER BY i.name;

    -- pack items
    SELECT pi.pack_id, i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id, pi.quantity,
        pi.sub_item_id, i2.name AS sub_item_name, i2.sid AS sub_item_sid, i2.user_id = userId AS sub_item_is_author, i2.cost AS sub_item_cost,
        i2.cost_unit AS sub_item_cost_unit, i2.item_type_id AS sub_item_type_id
    FROM pack_items pi
        JOIN applicable_items a ON a.id = pi.pack_id
        JOIN items i ON pi.item_id = i.id
        LEFT JOIN items i2 ON pi.sub_item_id = i2.id;

    -- applicable items
    SELECT ai.magical_item_id, ai.applicability_type_id, i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id, ai.filters
    FROM magical_item_applicable_items ai
        JOIN applicable_items a ON a.id = ai.magical_item_id
        JOIN magical_items mi ON mi.item_id = ai.magical_item_id AND (mi.magical_item_type_id = 1 OR mi.magical_item_type_id = 8 OR mi.magical_item_type_id = 10)
        LEFT JOIN items i ON i.id = ai.item_id;

    -- applicable spells
    SELECT ai.magical_item_id, mi.magical_item_type_id, ai.applicability_type_id, ai.filters,
           p.id AS spell_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author, s.level AS spell_level
    FROM magical_item_applicable_spells ai
        JOIN applicable_items a ON a.id = ai.magical_item_id
        JOIN magical_items mi ON mi.item_id = ai.magical_item_id AND (mi.additional_spells OR mi.magical_item_type_id = 5) -- 5 = scroll
        LEFT JOIN powers p ON p.id = ai.spell_id
        LEFT JOIN spells s ON s.power_id = p.id;

    DROP TEMPORARY TABLE IF EXISTS applicable_items;
    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Items_GetList(1, null, 0, 1000, 1);

