DROP PROCEDURE IF EXISTS BattleCreatures_CreateMonster;

DELIMITER ;;
CREATE PROCEDURE BattleCreatures_CreateMonster(
    IN encounterCreatureId INT UNSIGNED,
    IN monsterId INT UNSIGNED,
    IN creatureName VARCHAR(150),
    IN maxHp SMALLINT UNSIGNED,
    IN legendaryPointsRemaining TINYINT UNSIGNED,
    IN spellcastingAbilityId INT UNSIGNED,
    IN innateSpellcastingAbilityId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE speedTypeId TINYINT UNSIGNED;
    DECLARE creatureId INT UNSIGNED;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS creature_id;
        END;

    SET speedTypeId = (SELECT speed_id FROM monster_speeds WHERE monster_id = monsterId ORDER BY value DESC LIMIT 1);
    IF speedTypeId IS NULL THEN
        SET speedTypeId = 1;
    END IF;

    INSERT INTO creatures (name, creature_type_id, spellcasting_ability_id, innate_spellcasting_ability_id, user_id)
    VALUES (creatureName, 2, spellcastingAbilityId, innateSpellcastingAbilityId, userId);

    SET creatureId = (SELECT LAST_INSERT_ID());

    INSERT INTO battle_monsters (creature_id, monster_id, max_hp, legendary_points)
    VALUES (creatureId, monsterId, maxHp, legendaryPointsRemaining);

    UPDATE encounter_creatures SET creature_id = creatureId,
                                   speed_to_display = speedTypeId
    WHERE id = encounterCreatureId;

    SELECT creatureId as creature_id;
END;;

DELIMITER ;

