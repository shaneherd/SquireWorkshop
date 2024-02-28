DROP PROCEDURE IF EXISTS EncountersCreatures_Create_Character;

DELIMITER ;;
CREATE PROCEDURE EncountersCreatures_Create_Character(
    IN encounterId INT UNSIGNED,
    IN campaignCharacterId INT UNSIGNED,
    IN creatureInitiative TINYINT,
    IN roundAdded TINYINT UNSIGNED,
    IN creatureOrder TINYINT UNSIGNED,
    IN creatureSurprised BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE encounterCreatureId INT UNSIGNED;
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS id;
    END;

    START TRANSACTION;

    SET valid = (SELECT user_id FROM encounters WHERE id = encounterId) = userId;

    IF valid THEN
        INSERT INTO encounter_creatures (encounter_id, encounter_creature_type_id, initiative, round_added, `order`, surprised)
        VALUES (encounterId, 1, creatureInitiative, roundAdded, creatureOrder, creatureSurprised);

        SET encounterCreatureId = (SELECT LAST_INSERT_ID());

        INSERT INTO encounter_characters (encounter_creature_id, campaign_character_id, exp_earned)
        VALUES (encounterCreatureId, campaignCharacterId, 0);
    ELSE
        SET encounterId = -1;
    END IF;

    COMMIT;

    SELECT encounterId AS id;
END;;

DELIMITER ;

