DROP PROCEDURE IF EXISTS Powers_GetList_FeaturesByCharacteristicType;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_FeaturesByCharacteristicType(
    IN userId MEDIUMINT UNSIGNED,
    IN characteristicTypeId TINYINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_ids
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_ids
    SELECT f.power_id FROM powers up
        JOIN features f ON up.user_id = userId AND f.power_id = up.id
    WHERE (characteristicTypeId IS NULL AND f.characteristic_type_id IS NULL)
        OR (characteristicTypeId IS NOT NULL AND f.characteristic_type_id = characteristicTypeId);

    INSERT INTO temp_ids
    SELECT f.power_id FROM powers_shared up
        JOIN features f ON up.user_id = userId AND f.power_id = up.power_id
    WHERE (characteristicTypeId IS NULL AND f.characteristic_type_id IS NULL)
        OR (characteristicTypeId IS NOT NULL AND f.characteristic_type_id = characteristicTypeId);

    SELECT p.id AS feature_id, p.name AS feature_name, p.sid as feature_sid, p.user_id = userId AS feature_is_author, f.characteristic_type_id,
           c.id AS characteristic_id, c.name AS characteristic_name, c.sid AS characteristic_sid, c.user_id = userId AS characteristic_is_author, f.passive
    FROM temp_ids t
        JOIN powers p ON p.id = t.id
        JOIN features f ON f.power_id = p.id
        LEFT JOIN characteristics c ON f.characteristic_id = c.id
  ORDER BY p.name;

    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END;;

DELIMITER ;

# CALL Powers_GetList_FeaturesByCharacteristicType(1, 1);

