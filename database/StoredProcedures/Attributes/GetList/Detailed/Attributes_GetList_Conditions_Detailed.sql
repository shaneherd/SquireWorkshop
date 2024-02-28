DROP PROCEDURE IF EXISTS Attributes_GetList_Conditions_Detailed;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Conditions_Detailed(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE attributeTypeId TINYINT UNSIGNED;
    SET attributeTypeId = 4;

    CREATE TEMPORARY TABLE IF NOT EXISTS applicable_conditions
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
      (
          id INT UNSIGNED NOT NULL
      );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM attributes WHERE user_id = userId
        UNION
        SELECT attribute_id FROM attributes_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT attribute_id FROM attributes_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT attribute_id FROM attributes_private WHERE user_id = userId;
    END IF;

    INSERT INTO applicable_conditions (id)
    (
        SELECT a.id
        FROM temp_list ua
            JOIN attributes a ON a.id = ua.id
                AND a.attribute_type_id = attributeTypeId
        WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
        ORDER BY name
        LIMIT offset, pageSize
    );

    SELECT a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version
    FROM applicable_conditions ac
        JOIN attributes a ON a.id = ac.id;

    SELECT ac.id AS parent_id, a.id, a.name, a.sid, a.user_id = userId AS is_author, a.version
    FROM applicable_conditions ac
        JOIN connecting_conditions cc ON cc.parent_condition_id = ac.id
        JOIN attributes a ON cc.child_condition_id = a.id;

    DROP TEMPORARY TABLE IF EXISTS applicable_conditions;
    DROP TEMPORARY TABLE IF EXISTS temp_list;
END;;

DELIMITER ;

# CALL Attributes_GetList_Conditions_Detailed(1, null, 0, 1000, 1);