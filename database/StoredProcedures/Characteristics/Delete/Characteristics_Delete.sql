DROP PROCEDURE IF EXISTS Characteristics_Delete;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE currentCharacteristicId INT UNSIGNED;
    DECLARE characteristicTypeId TINYINT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id FROM temp_characteristics;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SET characteristicTypeId = (SELECT characteristic_type_id FROM characteristics WHERE id = characteristicId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_characteristics (id) VALUES (characteristicId);

    INSERT INTO temp_characteristics (id)
    WITH RECURSIVE children (id) AS
    (
        SELECT id
        FROM characteristics
        WHERE parent_characteristic_id = characteristicId

        UNION ALL

        SELECT c2.id
        FROM children c
            JOIN characteristics AS c2 ON c.id = c2.parent_characteristic_id
    )
    SELECT id FROM children;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO currentCharacteristicId;

        IF more_rows THEN
            IF characteristicTypeId = 1 THEN
                CALL Characteristics_Delete_Class(currentCharacteristicId, userId);
            ELSEIF characteristicTypeId = 2 THEN
                CALL Characteristics_Delete_Race(currentCharacteristicId, userId);
            ELSEIF characteristicTypeId = 3 THEN
                CALL Characteristics_Delete_Background(currentCharacteristicId, userId);
            END IF;
        END IF;
    END WHILE;

    CLOSE curs;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Characteristics_Delete(72, 1);
