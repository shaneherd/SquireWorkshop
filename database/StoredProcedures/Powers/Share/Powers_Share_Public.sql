DROP PROCEDURE IF EXISTS Powers_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Powers_Share_Public(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;

    SET userPowerId = (SELECT id FROM powers WHERE user_id = userId AND id = powerId);
    IF userPowerId IS NOT NULL THEN
        INSERT IGNORE INTO powers_public (power_id) VALUES (userPowerId);
    END IF;
END;;

DELIMITER ;

# CALL Powers_Share_Public(253, 12);
