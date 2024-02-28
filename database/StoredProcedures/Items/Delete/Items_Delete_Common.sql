DROP PROCEDURE IF EXISTS Items_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Common(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE cip FROM characteristic_item_profs cip JOIN characteristics c ON c.id = cip.characteristic_id WHERE item_id = itemId AND c.user_id = userId;
    DELETE cse FROM characteristic_starting_equipments cse JOIN characteristics c ON c.id = cse.characteristic_id WHERE item_id = itemId AND c.user_id = userId;
    DELETE csip FROM class_secondary_item_profs csip JOIN characteristics c ON c.id = csip.class_id WHERE item_id = itemId AND c.user_id = userId;
    DELETE cip FROM creature_item_profs cip JOIN creatures c ON c.id = cip.creature_id WHERE item_id = itemId AND c.user_id = userId;
    DELETE mip FROM monster_item_profs mip JOIN monsters m ON m.id = mip.monster_id WHERE item_id = itemId AND m.user_id = userId;
    DELETE d FROM item_damages d JOIN items i ON i.id = d.item_id WHERE item_id = itemId AND i.user_id = userId;
    DELETE ci FROM creature_items ci JOIN creatures c ON c.id = ci.creature_id WHERE item_id = itemId AND c.user_id = userId;
    DELETE ci FROM creature_items ci JOIN creatures c ON c.id = ci.creature_id WHERE magic_item_type_id = itemId AND c.user_id = userId;
    DELETE pi FROM pack_items pi JOIN items i ON i.id = pi.pack_id WHERE pi.item_id = itemId AND i.user_id = userId;
    DELETE pi FROM pack_items pi JOIN items i ON i.id = pi.pack_id WHERE pi.sub_item_id = itemId AND i.user_id = userId;
    DELETE miai FROM magical_item_applicable_items miai JOIN items i ON i.id = miai.magical_item_id WHERE miai.item_id = itemId AND i.user_id = userId;
    DELETE mi FROM monster_items mi JOIN items i ON i.id = mi.item_id WHERE mi.item_id = itemId AND i.user_id = userId;
    DELETE mi FROM monster_items mi JOIN items i ON i.id = mi.sub_item_id WHERE mi.sub_item_id = itemId AND i.user_id = userId;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creature_actions
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_creature_actions
    SELECT ca.id
    FROM creature_action_items cai JOIN creature_actions ca ON ca.id = cai.creature_action_id JOIN creatures c ON c.id = ca.creature_id WHERE item_id = itemId AND c.user_id = userId;

    INSERT INTO temp_creature_actions
    SELECT ca.id
    FROM creature_action_items cai JOIN creature_actions ca ON ca.id = cai.creature_action_id JOIN creatures c ON c.id = ca.creature_id WHERE sub_item_id = itemId AND c.user_id = userId;

    DELETE cai FROM chained_action_items cai JOIN temp_creature_actions tca ON tca.id = cai.creature_action_id;
    DELETE cai FROM creature_action_items cai JOIN temp_creature_actions tca ON tca.id = cai.creature_action_id;
    DELETE ca FROM creature_actions ca JOIN temp_creature_actions tca ON tca.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_creature_actions;
END;;

DELIMITER ;
