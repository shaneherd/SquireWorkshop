DROP PROCEDURE IF EXISTS Items_Delete_MagicalItem;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_MagicalItem(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE magicalItemId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS condition 1 @SQLState = RETURNED_SQLSTATE, @SQLMessage = MESSAGE_TEXT;
        ROLLBACK;
        INSERT INTO exception_logs (state, message) VALUES (@SQLState, @SQLMessage);
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO magicalItemId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF magicalItemId IS NOT NULL THEN
        CALL Items_Delete_Common(magicalItemId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE mitc FROM magical_item_table_cells mitc JOIN magical_item_tables mit ON mit.id = mitc.table_id JOIN magical_items mi ON mit.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE mit FROM magical_item_tables mit JOIN magical_items mi ON mit.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE mis FROM magical_item_spells mis JOIN magical_items mi ON mis.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE miai FROM magical_item_applicable_spells miai JOIN magical_items mi ON miai.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE miai FROM magical_item_applicable_items miai JOIN magical_items mi ON miai.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE mi.item_id = magicalItemId AND i.user_id = userId;
            DELETE miaa FROM magical_item_attunement_alignments miaa JOIN magical_items mi ON miaa.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE miar FROM magical_item_attunement_races miar JOIN magical_items mi ON miar.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE miac FROM magical_item_attunement_classes miac JOIN magical_items mi ON miac.magical_item_id = mi.item_id JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE mi FROM magical_items mi JOIN items i ON i.id = mi.item_id WHERE item_id = magicalItemId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = magicalItemId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = magicalItemId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_MagicalItem(265, 1, 0);
