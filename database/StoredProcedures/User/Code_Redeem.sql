DROP PROCEDURE IF EXISTS Code_Redeem;

DELIMITER ;;
CREATE PROCEDURE Code_Redeem(
    IN userId MEDIUMINT UNSIGNED,
    IN tokenValue VARCHAR(255)
)
BEGIN
    DECLARE creditsToGive TINYINT;
    SET creditsToGive = (SELECT credits FROM squire_keys WHERE token = tokenValue AND used = 0);

    IF creditsToGive IS NOT NULL THEN
        CALL User_Subscribe(userId, creditsToGive);
        UPDATE squire_keys SET used = 1, redeemed_by = userId WHERE token = tokenValue;
        SELECT 1 AS result;
    ELSE
        SELECT 0 AS result;
    END IF;
END;;

DELIMITER ;

# CALL Code_Redeem(12, '3c5b834b-7c2e-41a2-b154-26a327559a4c');
