DROP PROCEDURE IF EXISTS MonsterPowers_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_GetAddToMyStuffDetails(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorPowerId INT UNSIGNED;
    DECLARE existingPowerId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;
    DECLARE authorPowerTypeId TINYINT UNSIGNED;
    DECLARE existingPowerTypeId TINYINT UNSIGNED;
    DECLARE monsterId INT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorPowerId = monsterPowerId;
    ELSE
        SET authorPowerId = (SELECT published_parent_id FROM monster_powers WHERE user_id = userId AND id = monsterPowerId);
        IF authorPowerId IS NULL THEN
            SET authorPowerId = (SELECT monster_power_id FROM monster_powers_public WHERE monster_power_id = monsterPowerId);
        END IF;
        IF authorPowerId IS NULL THEN
            SET authorPowerId = (SELECT monster_power_id FROM monster_powers_private WHERE user_id = userId AND monster_power_id = monsterPowerId);
        END IF;
    END IF;

    SELECT user_id, monster_power_type_id, monster_id
    INTO authorUserId, authorPowerTypeId, monsterId
    FROM monster_powers WHERE id = authorPowerId;

    SELECT id, monster_power_type_id
    INTO existingPowerId, existingPowerTypeId
    FROM monster_powers WHERE published_parent_id = authorPowerId AND user_id = userId;

    SELECT authorPowerId AS author_power_id,
           authorUserId AS author_user_id,
           existingPowerId AS existing_power_id,
           authorPowerTypeId AS author_power_type_id,
           existingPowerTypeId AS existing_power_type_id,
           monsterId AS monster_id;
END;;

DELIMITER ;

# CALL MonsterPowers_GetAddToMyStuffDetails(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

