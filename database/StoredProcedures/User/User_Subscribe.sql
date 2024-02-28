DROP PROCEDURE IF EXISTS User_Subscribe;

DELIMITER ;;
CREATE PROCEDURE User_Subscribe(
	IN userId MEDIUMINT UNSIGNED,
	IN months TINYINT
)
BEGIN
    DECLARE subscriptionExpiration TIMESTAMP;
    IF months < 0 THEN
        UPDATE users SET role = 'PRO' WHERE id = userId;
        UPDATE user_subscriptions SET user_subscription_type_id = 4 WHERE user_id = userId;
    ELSE
        SET subscriptionExpiration = (SELECT expiration FROM user_subscriptions WHERE user_id = userId);
        IF subscriptionExpiration IS NULL THEN
            SET subscriptionExpiration = NOW();
        END IF;

        UPDATE users SET role = 'PRO' WHERE id = userId;
        UPDATE user_subscriptions SET user_subscription_type_id = 3, expiration = TIMESTAMPADD(MONTH, months, subscriptionExpiration) WHERE user_id = userId;
        UPDATE user_notifications SET acknowledged = 1 WHERE user_id = userId AND notification_id = 4;
    END IF;

END;;

DELIMITER ;

# CALL User_Subscribe(1);

