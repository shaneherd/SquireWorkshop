DROP PROCEDURE IF EXISTS Attributes_GetList_Modifiers;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Modifiers(
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT id, name, description, sid, user_id = userId AS is_author, version, attribute_type_id, 2 AS modifier_category_id, 0 AS characteristic_dependant
    FROM attributes
    WHERE attribute_type_id = 1 AND user_id = userId

    UNION

    SELECT id, name, description, sid, a.user_id = userId AS is_author, version, attribute_type_id, 2 AS modifier_category_id, 0 AS characteristic_dependant
    FROM attributes_shared ua
        JOIN attributes a ON a.id = ua.attribute_id
    WHERE ua.user_id = userId AND attribute_type_id = 1

    UNION

    SELECT id, name, description, sid, user_id = userId AS is_author, version, attribute_type_id, 3 AS modifier_category_id, 0 AS characteristic_dependant
    FROM attributes
    WHERE attribute_type_id = 8 AND user_id = userId

    UNION

    SELECT id, name, description, sid, a.user_id = userId AS is_author, version, attribute_type_id, 3 AS modifier_category_id, 0 AS characteristic_dependant
    FROM attributes_shared ua
        JOIN attributes a ON a.id = ua.attribute_id
    WHERE ua.user_id = userId AND attribute_type_id = 8

    UNION

    SELECT misc_att.id, misc_att.name, misc_att.description, misc_att.sid, misc_att.user_id = userId AS is_author, a.version, misc_att.attribute_type_id, ma.modifier_category_id, ma.characteristic_dependant
    FROM attributes a
        JOIN attributes misc_att ON misc_att.id = a.id
        JOIN misc_attributes ma ON misc_att.id = ma.attribute_id
    WHERE a.user_id = userId

    UNION

    SELECT misc_att.id, misc_att.name, misc_att.description, misc_att.sid, misc_att.user_id = userId AS is_author, version, misc_att.attribute_type_id, ma.modifier_category_id, ma.characteristic_dependant
    FROM attributes_shared ua
        JOIN attributes misc_att ON misc_att.id = ua.attribute_id
        JOIN misc_attributes ma ON misc_att.id = ma.attribute_id
    WHERE ua.user_id = userId

    ORDER BY name;
END;;

DELIMITER ;

# CALL Attributes_GetList_Modifiers(1);

