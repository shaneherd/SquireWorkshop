DROP PROCEDURE IF EXISTS Campaign_Settings_Update;

DELIMITER ;;
CREATE PROCEDURE Campaign_Settings_Update(
    IN campaignId INT UNSIGNED,
    IN settingId TINYINT UNSIGNED,
    IN settingValue TINYINT UNSIGNED
)
BEGIN
    REPLACE INTO campaign_setting_values (campaign_id, campaign_setting_id, value) VALUES
    (campaignId, settingId, settingValue);
END;;

DELIMITER ;

