DROP PROCEDURE IF EXISTS EncountersCreatures_Update_Character;

DELIMITER ;;
CREATE PROCEDURE EncountersCreatures_Update_Character(
    IN encounterId INT UNSIGNED,
    IN encounterCreatureId INT UNSIGNED,
    IN creatureInitiative TINYINT,
    IN roundAdded TINYINT UNSIGNED,
    IN creatureOrder TINYINT UNSIGNED,
    IN creatureSurprised BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS valid_request;
    END;

    SET valid = (SELECT user_id FROM encounters WHERE id = encounterId) = userId;

    IF valid THEN
        UPDATE encounter_creatures SET initiative = creatureInitiative,
                                       round_added = roundAdded,
                                       `order` = creatureOrder,
                                       surprised = creatureSurprised,
                                       removed = 0
        WHERE id = encounterCreatureId;
    END IF;

    SELECT 0 AS valid_request;
END;;

DELIMITER ;

