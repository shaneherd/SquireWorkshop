DROP PROCEDURE IF EXISTS Campaigns_Delete;

DELIMITER ;;
CREATE PROCEDURE Campaigns_Delete(
    IN campaignId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE isOwner BIT;
    DECLARE encounterId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id
                            FROM temp_encounters ;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_encounters
    (
        id INT UNSIGNED NOT NULL
    );

    SET isOwner = (SELECT user_id = userId FROM campaigns WHERE user_id in (0, userId) AND id = campaignId);

    IF isOwner THEN
        INSERT INTO temp_encounters
        SELECT id FROM encounters
        WHERE campaign_id = campaignId;

        OPEN curs;
        WHILE more_rows DO
            FETCH curs INTO encounterId;
            IF more_rows THEN
                CALL Encounters_Delete(encounterId, userId);
            END IF;
        END WHILE;
        CLOSE curs;

        DELETE cc FROM campaign_characters cc JOIN campaigns c ON c.id = cc.campaign_id WHERE c.id = campaignId AND c.user_id = userId;
        DELETE s FROM campaign_setting_values s JOIN campaigns c ON c.id = s.campaign_id WHERE c.id = campaignId AND c.user_id = userId;
        DELETE FROM campaigns WHERE user_id = userId AND id = campaignId;
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_encounters;

    SELECT 1 AS result;
END;;

DELIMITER ;

