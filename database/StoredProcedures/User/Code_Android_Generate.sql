DROP PROCEDURE IF EXISTS Code_Android_Generate;

DELIMITER ;;
CREATE PROCEDURE Code_Android_Generate(
    IN deviceId VARCHAR(100),
    IN tokenValue VARCHAR(255)
)
BEGIN
    DECLARE tokenToUse VARCHAR(255);
    SET tokenToUse = (SELECT token FROM android_tokens WHERE device_id = deviceId);
    IF tokenToUse IS NULL THEN
        SET tokenToUse = tokenValue;
        INSERT INTO android_tokens (device_id, token) VALUES (deviceId, tokenValue);
        INSERT INTO squire_keys (token, credits) VALUES (tokenValue, 3);
    END IF;

    SELECT tokenToUse AS token;
END;;

DELIMITER ;

# CALL Android_AddToken('deviceId', '02e33ae5-e97b-4bd1-bbfc-227101f1c926');
# select * from users
