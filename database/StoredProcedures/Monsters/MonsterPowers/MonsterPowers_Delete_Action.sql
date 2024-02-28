DROP PROCEDURE IF EXISTS MonsterPowers_Delete_Action;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Delete_Action(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterActionId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO monsterActionId, isOwner
    FROM monster_powers
    WHERE user_id IN (0, userId) AND id = monsterPowerId;

    IF monsterActionId IS NOT NULL THEN
        CALL MonsterPowers_Delete_Common(monsterActionId, userId);

        IF isOwner THEN
            DELETE FROM monster_powers_public WHERE monster_power_id = monsterPowerId;
            DELETE FROM monster_powers_private WHERE monster_power_id = monsterPowerId;
            UPDATE monster_powers SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = monsterPowerId;

            DELETE d FROM monster_action_damages d JOIN monster_actions a ON a.monster_power_id = d.monster_action_id JOIN monster_powers p ON p.id = a.monster_power_id WHERE monster_power_id = monsterActionId AND user_id = userId;
            DELETE a FROM monster_actions a JOIN monster_powers p ON p.id = a.monster_power_id WHERE monster_power_id = monsterActionId AND user_id = userId;
            DELETE FROM monster_powers WHERE user_id = userId AND id = monsterActionId;
        ELSE
            DELETE FROM monster_powers_shared WHERE user_id = userId AND monster_power_id = monsterActionId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL MonsterPowers_Get_Feature(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

