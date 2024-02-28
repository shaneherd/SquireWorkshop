DROP PROCEDURE IF EXISTS Creatures_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Creatures_Share_UnPublish(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCreatureId INT UNSIGNED;

    SET userCreatureId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);
    IF userCreatureId IS NOT NULL THEN
        DELETE FROM creatures_public WHERE creature_id = userCreatureId;
        DELETE FROM creatures_private WHERE creature_id = userCreatureId;
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_UnPublish(253, 12);
