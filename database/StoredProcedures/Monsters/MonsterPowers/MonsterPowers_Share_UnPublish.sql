DROP PROCEDURE IF EXISTS MonsterPowers_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Share_UnPublish(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;

    SET userPowerId = (SELECT id FROM monster_powers WHERE user_id = userId AND id = monsterPowerId);
    IF userPowerId IS NOT NULL THEN
        DELETE FROM monster_powers_public WHERE monster_power_id = userPowerId;
        DELETE FROM monster_powers_private WHERE monster_power_id = userPowerId;
    END IF;
END;;

DELIMITER ;

# CALL MonsterPowers_Share_UnPublish(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

