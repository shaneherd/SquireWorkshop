DROP PROCEDURE IF EXISTS Campaign_Settings_Get;

DELIMITER ;;
CREATE PROCEDURE Campaign_Settings_Get(
    IN campaignId INT UNSIGNED
)
BEGIN
    SELECT
        campaign_setting_category_id,
        campaign_setting_id,
        value
    FROM campaign_setting_values csv
    JOIN campaign_settings cs on csv.campaign_setting_id = cs.id
    WHERE campaign_id = campaignId;

#     SELECT `campaign_page_type_id`, `order`, `visible` FROM campaign_pages WHERE campaign_id = campaignId ORDER BY `order`;
END;;

DELIMITER ;

