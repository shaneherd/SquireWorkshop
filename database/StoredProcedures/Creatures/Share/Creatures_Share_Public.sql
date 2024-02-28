DROP PROCEDURE IF EXISTS Creatures_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Creatures_Share_Public(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCreatureId INT UNSIGNED;

    SET userCreatureId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);
    IF userCreatureId IS NOT NULL THEN
        INSERT IGNORE INTO creatures_public (creature_id) VALUES (userCreatureId);
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_Public(253, 12);
