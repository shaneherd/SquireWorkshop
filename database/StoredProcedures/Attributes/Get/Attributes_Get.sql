DROP PROCEDURE IF EXISTS Attributes_Get;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE attributeTypeId TINYINT UNSIGNED;
    SET attributeTypeId = (SELECT attribute_type_id FROM attributes WHERE id = attributeId);
    SELECT attributeTypeId AS attribute_type_id;

    IF attributeTypeId = 1 THEN
        CALL Attributes_Get_Ability(attributeId, userId);
    ELSEIF attributeTypeId = 2 THEN
        CALL Attributes_Get_ArmorType(attributeId, userId);
    ELSEIF attributeTypeId = 3 THEN
        CALL Attributes_Get_CasterType(attributeId, userId);
    ELSEIF attributeTypeId = 4 THEN
        CALL Attributes_Get_Condition(attributeId, userId);
    ELSEIF attributeTypeId = 5 THEN
        CALL Attributes_Get_DamageType(attributeId, userId);
    ELSEIF attributeTypeId = 6 THEN
        CALL Attributes_Get_Language(attributeId, userId);
    ELSEIF attributeTypeId = 7 THEN
        CALL Attributes_Get_CharacterLevel(attributeId, userId);
    ELSEIF attributeTypeId = 8 THEN
        CALL Attributes_Get_Skill(attributeId, userId);
    ELSEIF attributeTypeId = 9 THEN
        CALL Attributes_Get_ToolCategory(attributeId, userId);
    ELSEIF attributeTypeId = 10 THEN
        CALL Attributes_Get_WeaponProperty(attributeId, userId);
    ELSEIF attributeTypeId = 11 THEN
        CALL Attributes_Get_WeaponType(attributeId, userId);
    ELSEIF attributeTypeId = 12 THEN
        CALL Attributes_Get_AreaOfEffect(attributeId, userId);
    ELSEIF attributeTypeId = 13 THEN
        CALL Attributes_Get_SpellSchool(attributeId, userId);
    ELSEIF attributeTypeId = 14 THEN
        CALL Attributes_Get_Alignment(attributeId, userId);
    ELSEIF attributeTypeId = 15 THEN
        CALL Attributes_Get_DeityCategory(attributeId, userId);
    ELSEIF attributeTypeId = 16 THEN
        CALL Attributes_Get_Deity(attributeId, userId);
    ELSEIF attributeTypeId = 17 THEN
        CALL Attributes_Get_Misc(attributeId, userId);
#     ELSEIF attributeTypeId = 18 THEN
#         CALL Attributes_Get_Characteristic(attributeId, userId);
    END IF;
END;;

DELIMITER ;

# CALL Attributes_Get(146, 1);
