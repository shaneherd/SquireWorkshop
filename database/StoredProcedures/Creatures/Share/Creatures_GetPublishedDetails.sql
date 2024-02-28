DROP PROCEDURE IF EXISTS Creatures_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Creatures_GetPublishedDetails(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorCreatureId INT UNSIGNED;

    SET authorCreatureId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);
    SELECT EXISTS(
        SELECT 1 FROM creatures_public WHERE creature_id = authorCreatureId
        UNION
        SELECT 1 FROM creatures_private WHERE creature_id = authorCreatureId
    ) AS published;

    SELECT u.username
    FROM creatures_private ap
        JOIN users u ON u.id = ap.user_id AND ap.creature_id = authorCreatureId;
END;;

DELIMITER ;

# CALL Creatures_GetPublishedDetails(253, 12);
