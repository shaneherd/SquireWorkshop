DROP PROCEDURE IF EXISTS Characteristics_Get_Children;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Children(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN isRecursive BIT
)
BEGIN
    DECLARE parentId INT UNSIGNED;
    SET parentId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);

    IF isRecursive THEN
        WITH RECURSIVE children (id, name, sid, user_id) AS
        (
            SELECT id, name, sid, user_id
            FROM characteristics
            WHERE parent_characteristic_id = parentId AND user_id IN (0, userId)

            UNION ALL

            SELECT c2.id, c2.name, c2.sid, c2.user_id
            FROM children c
                JOIN characteristics AS c2 ON c.id = c2.parent_characteristic_id AND c2.user_id IN (0, userId)
        )
        SELECT id, name, sid, user_id = userId AS is_author FROM children;
    ELSE
        SELECT id, name, sid, user_id = userId AS is_author
        FROM characteristics
        WHERE parent_characteristic_id = parentId AND user_id IN (0, userId);
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Get_Children(2, 1, 0);
