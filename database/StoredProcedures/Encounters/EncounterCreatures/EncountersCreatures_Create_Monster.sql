DROP PROCEDURE IF EXISTS EncountersCreatures_Create_Monster;

DELIMITER ;;
CREATE PROCEDURE EncountersCreatures_Create_Monster(
    IN encounterId INT UNSIGNED,
    IN groupId INT UNSIGNED,
    IN monsterNumber TINYINT UNSIGNED,
    IN monsterHp SMALLINT UNSIGNED,
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
        VALUES (encounterId, 2, creatureInitiative, roundAdded, creatureOrder, creatureSurprised);

        SET encounterCreatureId = (SELECT LAST_INSERT_ID());

        INSERT INTO encounter_monsters (encounter_creature_id, encounter_monster_group_id, monster_number, hp)
        VALUES (encounterCreatureId, groupId, monsterNumber, monsterHp);
    ELSE
        SET encounterId = -1;
    END IF;

    COMMIT;

    SELECT encounterId AS id;
END;;

DELIMITER ;

