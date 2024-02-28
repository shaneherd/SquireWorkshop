DROP PROCEDURE IF EXISTS Creatures_Delete_BattleMonster;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_BattleMonster(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE battleMonsterId INT UNSIGNED;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS condition 1 @SQLState = RETURNED_SQLSTATE, @SQLMessage = MESSAGE_TEXT;
            ROLLBACK;
            INSERT INTO exception_logs (state, message) VALUES (@SQLState, @SQLMessage);
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    SET battleMonsterId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);

    IF battleMonsterId IS NOT NULL THEN
        CALL Creatures_Delete_Common(battleMonsterId, userId);

        UPDATE encounter_creatures ec JOIN creatures c ON c.id = ec.creature_id SET ec.creature_id = NULL WHERE ec.creature_id = battleMonsterId AND c.user_id = userId;
        DELETE s FROM battle_monster_setting_values s JOIN creatures c ON c.id = s.battle_monster_id WHERE battle_monster_id = battleMonsterId AND c.user_id = userId;
        DELETE p FROM battle_monster_powers p JOIN creatures c ON c.id = p.battle_monster_id WHERE battle_monster_id = battleMonsterId AND c.user_id = userId;
        DELETE bm FROM battle_monsters bm JOIN creatures c ON c.id = bm.creature_id WHERE creature_id = battleMonsterId AND c.user_id = userId;
        DELETE FROM creatures WHERE user_id = userId AND id = battleMonsterId;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

