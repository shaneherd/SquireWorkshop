DROP PROCEDURE IF EXISTS Attributes_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Common(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE cam FROM characteristic_attribute_modifiers cam JOIN characteristics c ON c.id = cam.characteristic_id WHERE cam.attribute_id = attributeId AND c.user_id = userId;
    DELETE cap FROM characteristic_attribute_profs cap JOIN characteristics c ON c.id = cap.characteristic_id WHERE cap.attribute_id = attributeId AND c.user_id = userId;
    DELETE ccp FROM characteristic_choice_profs ccp JOIN characteristics c ON c.id = ccp.characteristic_id WHERE ccp.attribute_id = attributeId AND c.user_id = userId;
    DELETE csap FROM class_secondary_attribute_profs csap JOIN characteristics c ON c.id = csap.class_id WHERE csap.attribute_id = attributeId AND c.user_id = userId;
    DELETE cscp FROM class_secondary_choice_profs cscp JOIN characteristics c ON c.id = cscp.class_id WHERE cscp.attribute_id = attributeId AND c.user_id = userId;
    DELETE cap FROM creature_attribute_profs cap JOIN creatures c ON c.id = cap.creature_id WHERE cap.attribute_id = attributeId AND c.user_id = userId;
    DELETE map FROM monster_attribute_profs map JOIN monsters m ON m.id = map.monster_id WHERE map.attribute_id = attributeId AND m.user_id = userId;
    DELETE pm FROM power_modifiers pm JOIN powers p ON p.id = pm.power_id WHERE pm.attribute_id = attributeId AND p.user_id = userId;
END;;

DELIMITER ;
