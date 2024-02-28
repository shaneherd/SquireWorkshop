DROP PROCEDURE IF EXISTS User_Created_Notification;

DELIMITER ;;
CREATE PROCEDURE User_Created_Notification(
	IN userId MEDIUMINT UNSIGNED
)
BEGIN
    INSERT INTO user_notifications (user_id, notification_id, acknowledged)  VALUES
    (userId, 2, 0);
END;;

DELIMITER ;

# CALL User_Defaults(1);

