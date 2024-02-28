DROP PROCEDURE IF EXISTS Expire_Subscriptions;

DELIMITER ;;
CREATE PROCEDURE Expire_Subscriptions()
BEGIN
    DECLARE now TIMESTAMP;
    SET now = NOW();

    CREATE TEMPORARY TABLE IF NOT EXISTS expired_users
    (
        user_id INT UNSIGNED NOT NULL,
        expiration TIMESTAMP NULL
    );

    INSERT INTO expired_users (user_id, expiration)
    SELECT user_id, expiration
    FROM user_subscriptions
    WHERE user_subscription_type_id != 4 AND expiration < now AND expired = 0;

    UPDATE users
    SET role = 'BASIC'
    WHERE id IN (SELECT user_id FROM expired_users);

    UPDATE user_subscriptions
    SET expiration = NULL, expired = 1, user_subscription_type_id = 1
    WHERE user_id IN (SELECT user_id FROM expired_users);

    INSERT INTO user_notifications (user_id, notification_id, acknowledged)
    SELECT user_id, 4, 0 FROM expired_users;

    INSERT INTO user_transactions (user_id, user_transaction_type_id, event_time)
    SELECT user_id, 5, expiration FROM expired_users;

    DROP TEMPORARY TABLE IF EXISTS expired_users;
END;;

DELIMITER ;

# CALL Expire_Subscriptions();
# select * from users
