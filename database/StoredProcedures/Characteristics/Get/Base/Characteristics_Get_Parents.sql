DROP PROCEDURE IF EXISTS Characteristics_Get_Parents;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Parents(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE childId INT UNSIGNED;
    SET childId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);

    WITH RECURSIVE parents (parent_characteristic_id) AS
    (
        SELECT parent_characteristic_id
        FROM characteristics
        WHERE id = childId

        UNION ALL

        SELECT c2.parent_characteristic_id
        FROM parents p
            JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
    )
    SELECT parent_characteristic_id FROM parents;
END;;

DELIMITER ;

# CALL Characteristics_Get_Parents(15, 1);
