DROP PROCEDURE IF EXISTS Powers_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Powers_Share_UnPublish(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;

    SET userPowerId = (SELECT id FROM powers WHERE user_id = userId AND id = powerId);
    IF userPowerId IS NOT NULL THEN
        DELETE FROM powers_public WHERE power_id = userPowerId;
        DELETE FROM powers_private WHERE power_id = userPowerId;
    END IF;
END;;

DELIMITER ;

# CALL Powers_Share_UnPublish(253, 12);
