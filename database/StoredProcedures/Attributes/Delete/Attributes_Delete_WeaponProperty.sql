DROP PROCEDURE IF EXISTS Attributes_Delete_WeaponProperty;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_WeaponProperty(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE weaponPropertyId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO weaponPropertyId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF weaponPropertyId IS NOT NULL THEN
        DELETE wwp FROM weapon_weapon_properties wwp JOIN items i ON i.id = wwp.weapon_id WHERE wwp.weapon_property_id = weaponPropertyId AND i.user_id = userId;
        CALL Attributes_Delete_Common(weaponPropertyId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE wp FROM weapon_properties wp JOIN attributes a ON a.id = wp.attribute_id WHERE attribute_id = weaponPropertyId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = weaponPropertyId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = weaponPropertyId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_WeaponProperty(265, 1, 0);
