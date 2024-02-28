DROP PROCEDURE IF EXISTS MonsterPowers_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_GetPublishedDetails(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorPowerId INT UNSIGNED;

    SET authorPowerId = (SELECT id FROM monster_powers WHERE user_id = userId AND id = monsterPowerId);
    SELECT EXISTS(
        SELECT 1 FROM monster_powers_public WHERE monster_power_id = authorPowerId
        UNION
        SELECT 1 FROM monster_powers_private WHERE monster_power_id = authorPowerId
    ) AS published;

    SELECT u.username
    FROM monster_powers_private pp
        JOIN users u ON u.id = pp.user_id AND pp.monster_power_id = authorPowerId;
END;;

DELIMITER ;

# CALL MonsterPowers_GetPublishedDetails(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

