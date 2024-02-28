DROP PROCEDURE IF EXISTS Powers_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Powers_GetPublishedDetails(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorPowerId INT UNSIGNED;

    SET authorPowerId = (SELECT id FROM powers WHERE user_id = userId AND id = powerId);
    SELECT EXISTS(
        SELECT 1 FROM powers_public WHERE power_id = authorPowerId
        UNION
        SELECT 1 FROM powers_private WHERE power_id = authorPowerId
    ) AS published;

    SELECT u.username
    FROM powers_private pp
        JOIN users u ON u.id = pp.user_id AND pp.power_id = authorPowerId;
END;;

DELIMITER ;

# CALL Powers_GetPublishedDetails(253, 12);
