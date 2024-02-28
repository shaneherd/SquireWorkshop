DROP PROCEDURE IF EXISTS CreaturePowers_GetList;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_GetList(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN powerTypeId TINYINT UNSIGNED
)
BEGIN
    DECLARE verifiedCreatureId INT UNSIGNED;

    SET verifiedCreatureId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF verifiedCreatureId IS NULL THEN
        SET verifiedCreatureId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
    END IF;
    IF verifiedCreatureId IS NULL THEN
        SET verifiedCreatureId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SELECT p.id
    FROM creature_powers cp
        JOIN powers p ON p.id = cp.power_id AND cp.power_type_id = powerTypeId AND cp.creature_id = verifiedCreatureId
    ORDER BY p.name;
END;;

DELIMITER ;