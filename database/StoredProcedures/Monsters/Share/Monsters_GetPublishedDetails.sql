DROP PROCEDURE IF EXISTS Monsters_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Monsters_GetPublishedDetails(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorMonsterId INT UNSIGNED;

    SET authorMonsterId = (SELECT id FROM monsters WHERE user_id = userId AND id = monsterId);
    SELECT EXISTS(
        SELECT 1 FROM monsters_public WHERE monster_id = authorMonsterId
        UNION
        SELECT 1 FROM monsters_private WHERE monster_id = authorMonsterId
    ) AS published;

    SELECT u.username
    FROM monsters_private ap
        JOIN users u ON u.id = ap.user_id AND ap.monster_id = authorMonsterId;
END;;

DELIMITER ;

# CALL Creatures_GetPublishedDetails(253, 12);
