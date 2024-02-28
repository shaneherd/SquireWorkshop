DROP PROCEDURE IF EXISTS Items_InUse;

DELIMITER ;;
CREATE PROCEDURE Items_InUse(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_attributes
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_monsters
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_items
    SELECT w.item_id, 1
    FROM weapons w
        JOIN items ui ON ui.user_id = userId AND ui.id = w.item_id
    WHERE ammo_id = itemId;

    INSERT INTO temp_items
    SELECT w.item_id, 1
    FROM weapons w
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = w.item_id
    WHERE ammo_id = itemId;

    INSERT INTO temp_items
    SELECT p.item_id, 0
    FROM packs p
        JOIN items ui ON ui.user_id = userId AND ui.id = p.item_id
        JOIN pack_items pi ON p.item_id = pi.pack_id
    WHERE pi.item_id = itemId OR pi.sub_item_id = itemId;

    INSERT INTO temp_items
    SELECT p.item_id, 0
    FROM packs p
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = p.item_id
        JOIN pack_items pi ON p.item_id = pi.pack_id
    WHERE pi.item_id = itemId OR pi.sub_item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT cip.characteristic_id, 0
    FROM characteristic_item_profs cip
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = cip.characteristic_id
    WHERE item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT cip.characteristic_id, 0
    FROM characteristic_item_profs cip
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = cip.characteristic_id
    WHERE item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT cse.characteristic_id, 0
    FROM characteristic_starting_equipments cse
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = cse.characteristic_id
    WHERE item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT cse.characteristic_id, 0
    FROM characteristic_starting_equipments cse
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = cse.characteristic_id
    WHERE item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT csip.class_id, 0
    FROM class_secondary_item_profs csip
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = csip.class_id
    WHERE item_id = itemId;

    INSERT INTO temp_characteristics
    SELECT csip.class_id, 0
    FROM class_secondary_item_profs csip
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = csip.class_id
    WHERE item_id = itemId;

    INSERT INTO temp_creatures
    SELECT cip.creature_id, 0
    FROM creature_item_profs cip
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cip.creature_id
    WHERE item_id = itemId;

    INSERT INTO temp_creatures
    SELECT cip.creature_id, 0
    FROM creature_item_profs cip
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cip.creature_id
    WHERE item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mip.monster_id, 0
    FROM monster_item_profs mip
        JOIN monsters uc ON uc.user_id = userId AND uc.id = mip.monster_id
    WHERE item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mip.monster_id, 0
    FROM monster_item_profs mip
        JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = mip.monster_id
    WHERE item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mi.monster_id, 0
    FROM monster_items mi
        JOIN monsters uc ON uc.user_id = userId AND uc.id = mi.monster_id
    WHERE item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mi.monster_id, 0
    FROM monster_items mi
        JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = mi.monster_id
    WHERE item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mi.monster_id, 0
    FROM monster_items mi
        JOIN monsters uc ON uc.user_id = userId AND uc.id = mi.monster_id
    WHERE sub_item_id = itemId;

    INSERT INTO temp_monsters
    SELECT mi.monster_id, 0
    FROM monster_items mi
        JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = mi.monster_id
    WHERE sub_item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_items cai
        JOIN creature_actions ca ON ca.id = cai.creature_action_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ca.creature_id
    WHERE cai.item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_items cai
        JOIN creature_actions ca ON ca.id = cai.creature_action_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ca.creature_id
    WHERE cai.item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_items cai
        JOIN creature_actions ca ON ca.id = cai.creature_action_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ca.creature_id
    WHERE cai.sub_item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_items cai
        JOIN creature_actions ca ON ca.id = cai.creature_action_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ca.creature_id
    WHERE cai.sub_item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ci.creature_id, 0
    FROM creature_items ci
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ci.creature_id
    WHERE ci.item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ci.creature_id, 0
    FROM creature_items ci
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ci.creature_id
    WHERE ci.item_id = itemId;

    INSERT INTO temp_creatures
    SELECT ci.creature_id, 0
    FROM creature_items ci
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ci.creature_id
    WHERE ci.magic_item_type_id = itemId;

    INSERT INTO temp_creatures
    SELECT ci.creature_id, 0
    FROM creature_items ci
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ci.creature_id
    WHERE ci.magic_item_type_id = itemId;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id
    WHERE ma.ammo_id = itemId;

    INSERT INTO temp_items
    SELECT pi.pack_id, 0
    FROM pack_items pi
        JOIN items ui ON ui.user_id = userId AND ui.id = pi.pack_id
    WHERE pi.item_id = itemId;

    INSERT INTO temp_items
    SELECT pi.pack_id, 0
    FROM pack_items pi
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = pi.pack_id
    WHERE pi.item_id = itemId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 2 AS type_id, c.characteristic_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_characteristics GROUP BY id) AS t
            JOIN characteristics c ON t.id = c.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id

        UNION

        SELECT 5 AS type_id, null AS sub_type_id, m.id, m.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_monsters GROUP BY id) AS t
                 JOIN monsters m ON t.id = m.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_monsters;
END;;

DELIMITER ;

# CALL Items_InUse(561, 0);
