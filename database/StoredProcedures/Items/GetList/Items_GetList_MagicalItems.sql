DROP PROCEDURE IF EXISTS Items_GetList_MagicalItems;

DELIMITER ;;
CREATE PROCEDURE Items_GetList_MagicalItems(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN isExpendable BIT,
    IN isEquippable BIT,
    IN isContainer BIT,
    IN magicalItemType TINYINT UNSIGNED,
    IN rarityId TINYINT UNSIGNED,
    IN requiresAttunement BIT,
    IN isCursed BIT,
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;
    DECLARE pro BIT;

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

    SET itemTypeId = 9;
    SET pro = (SELECT role FROM users WHERE id = userId) = 'PRO';
    IF pro = 0 THEN
        SET pro = (SELECT user_subscription_type_id FROM user_subscriptions WHERE user_id = userId AND expired = 0) = 2;
    END IF;

    CREATE TEMPORARY TABLE IF NOT EXISTS applicable_items
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO applicable_items
    SELECT i.id
    FROM temp_list ui
    JOIN items i ON i.id = ui.id
        AND i.item_type_id = itemTypeId
    JOIN magical_items mi ON mi.item_id = i.id
    WHERE pro = 1
      AND (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
      AND (isExpendable IS NULL OR i.expendable = isExpendable)
      AND (isEquippable IS NULL OR i.equippable = isEquippable)
      AND (isContainer IS NULL OR i.container = isContainer)
      AND (magicalItemType IS NULL OR mi.magical_item_type_id = magicalItemType)
      AND (rarityId IS NULL OR mi.rarity_id = rarityId)
      AND (requiresAttunement IS NULL OR mi.requires_attunement = requiresAttunement)
      AND (isCursed IS NULL OR (isCursed = 0 AND mi.curse_effect = '') OR (isCursed = 1 AND mi.curse_effect != ''))
    ORDER BY i.name
    LIMIT offset, pageSize;

    SELECT i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id
    FROM applicable_items a
        JOIN items i ON i.id = a.id;

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

# CALL Items_GetList_MagicalItems(1, null, null, null, null, 0, 100, 1);