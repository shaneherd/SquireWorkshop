DROP PROCEDURE IF EXISTS User_Delete;

DELIMITER ;;
CREATE PROCEDURE User_Delete(
	IN userId INT UNSIGNED
) 
BEGIN
    DECLARE name VARCHAR(45);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
   END;

    START TRANSACTION;

    SET name = (SELECT username FROM users WHERE id = userId);

    CALL User_Delete_Items(userId);
    UPDATE squire_keys SET redeemed_by = NULL WHERE redeemed_by = userId;
    DELETE FROM user_verify_email WHERE username = name;
    DELETE FROM user_reset_password WHERE username = name;
    DELETE FROM user_unlock_account WHERE username = name;
    DELETE FROM user_settings WHERE user_id = userId;
    DELETE FROM user_subscriptions WHERE user_id = userId;
    DELETE FROM user_transactions WHERE user_id = userId;
    DELETE FROM user_notifications WHERE user_id = userId;
    DELETE FROM user_support_requests WHERE user_id = userId;
    DELETE FROM users WHERE id = userId;

    COMMIT;
END;;

DELIMITER ;

# CALL User_Delete(1);
