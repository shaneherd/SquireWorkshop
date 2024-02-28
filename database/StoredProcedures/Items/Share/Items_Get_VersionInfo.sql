DROP PROCEDURE IF EXISTS Items_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Items_Get_VersionInfo(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userItemId INT UNSIGNED;
    DECLARE parentItemId INT UNSIGNED;
    DECLARE publishedItemId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userItemId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);

    IF userItemId IS NOT NULL THEN
        SET parentItemId = (SELECT published_parent_id FROM items WHERE id = userItemId);
        SET publishedItemId = (SELECT item_id FROM items_public WHERE item_id = parentItemId);
        IF publishedItemId IS NULL THEN
            SET publishedItemId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = parentItemId);
        END IF;

        SELECT i2.version, i1.published_parent_version
        INTO authorVersion, currentVersion
        FROM items i1
                 LEFT JOIN items i2 ON i1.published_parent_id = i2.id AND i1.id = userItemId AND i2.id = publishedItemId
        WHERE i2.version IS NOT NULL;
    ELSE
        SET userItemId = (SELECT id FROM items WHERE published_parent_id = itemId AND user_id = userId);
        IF userItemId IS NOT NULL THEN
            SELECT i2.version, i1.published_parent_version
            INTO authorVersion, currentVersion
            FROM items i1
                LEFT JOIN items i2 ON i1.published_parent_id = i2.id AND i1.id = userItemId
            WHERE i2.version IS NOT NULL;
        ELSE
            SET userItemId = (SELECT item_id FROM items_public WHERE item_id = itemId);
            IF userItemId IS NULL THEN
                SET userItemId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
            END IF;

            IF userItemId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM items WHERE id = userItemId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Items_Get_VersionInfo(273, 1);
