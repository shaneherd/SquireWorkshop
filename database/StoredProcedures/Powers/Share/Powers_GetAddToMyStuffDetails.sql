DROP PROCEDURE IF EXISTS Powers_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Powers_GetAddToMyStuffDetails(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorPowerId INT UNSIGNED;
    DECLARE existingPowerId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;
    DECLARE authorPowerTypeId TINYINT UNSIGNED;
    DECLARE existingPowerTypeId TINYINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorPowerId = powerId;
    ELSE
        SET authorPowerId = (SELECT published_parent_id FROM powers WHERE user_id = userId AND id = powerId);
        IF authorPowerId IS NULL THEN
            SET authorPowerId = (SELECT power_id FROM powers_public WHERE power_id = powerId);
        END IF;
        IF authorPowerId IS NULL THEN
            SET authorPowerId = (SELECT power_id FROM powers_private WHERE user_id = userId AND power_id = powerId);
        END IF;
    END IF;

    SELECT user_id, power_type_id
    INTO authorUserId, authorPowerTypeId
    FROM powers WHERE id = authorPowerId;

    SELECT id, power_type_id
    INTO existingPowerId, existingPowerTypeId
    FROM powers WHERE published_parent_id = authorPowerId AND user_id = userId;

    SELECT authorPowerId AS author_power_id,
           authorUserId AS author_user_id,
           existingPowerId AS existing_power_id,
           authorPowerTypeId AS author_power_type_id,
           existingPowerTypeId AS existing_power_type_id;
END;;

DELIMITER ;

# CALL Powers_GetAddToMyStuffDetails(253, 12);
