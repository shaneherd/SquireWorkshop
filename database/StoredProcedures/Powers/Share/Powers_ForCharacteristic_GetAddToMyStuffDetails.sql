DROP PROCEDURE IF EXISTS Powers_ForCharacteristic_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Powers_ForCharacteristic_GetAddToMyStuffDetails(
    IN authorCharacteristicId INT UNSIGNED,
    IN authorUserId MEDIUMINT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_powers
    SELECT p.id
    FROM powers p
        JOIN features f on p.id = f.power_id AND f.characteristic_id = authorCharacteristicId AND p.user_id IN (0, authorUserId);

    SELECT tp.id AS author_power_id, 2 AS author_power_type_id, p.id AS existing_power_id, p.power_type_id AS existing_power_type_id
    FROM temp_powers tp
        LEFT JOIN powers p ON p.published_parent_id = tp.id AND p.user_id = userId;

    SELECT id
    FROM powers p
        JOIN features f ON f.power_id = p.id AND f.characteristic_id = characteristicId
    WHERE p.published_parent_id IS NULL OR p.published_parent_id NOT IN (SELECT id FROM temp_powers);

    DROP TEMPORARY TABLE IF EXISTS temp_powers;
END;;

DELIMITER ;

# CALL Powers_ForCharacteristic_GetAddToMyStuffDetails(97, 12, 99, 1);
