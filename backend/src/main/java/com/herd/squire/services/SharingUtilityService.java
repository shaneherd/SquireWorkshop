package com.herd.squire.services;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.Modifier;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.characteristics.starting_equipment.StartingEquipment;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.ItemListObject;
import com.herd.squire.models.items.ItemProficiency;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.items.magical_item.MagicalItemApplicability;
import com.herd.squire.models.monsters.InnateSpellConfiguration;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.powers.PowerAreaOfEffect;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.characteristics.CharacteristicService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.items.ItemService;
import com.herd.squire.services.monsters.MonsterPowerService;
import com.herd.squire.services.monsters.MonsterService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.List;

public class SharingUtilityService {
    public static final boolean CUSTOM_ABILITIES = false;
    public static final boolean CUSTOM_LEVELS = false;
    public static final boolean CUSTOM_SPELL_SCHOOLS = false;
    public static final boolean CUSTOM_WEAPON_TYPES = false;
    public static final boolean CUSTOM_MISC = false;

    /************************************************************************************************/

    public static ShareList getAttributeShareList(long attributeId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        AttributeService.addToShareList(attributeId, userId, shareList);
        return shareList;
    }

    public static ShareList getCharacteristicShareList(long characteristicId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        CharacteristicService.addToShareList(characteristicId, userId, shareList);
        return shareList;
    }

    public static ShareList getCreatureShareList(long creatureId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        CreatureService.addToShareList(creatureId, userId, shareList);
        return shareList;
    }

    public static ShareList getMonsterShareList(long creatureId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        MonsterService.addToShareList(creatureId, userId, shareList);
        return shareList;
    }

    public static ShareList getItemShareList(long itemId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        ItemService.addToShareList(itemId, userId, shareList);
        return shareList;
    }

    public static ShareList getPowerShareList(long powerId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        PowerService.addToShareList(powerId, userId, shareList);
        return shareList;
    }

    public static ShareList getMonsterPowerShareList(long monsterPowerId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        MonsterPowerService.addToShareList(monsterPowerId, userId, shareList);
        return shareList;
    }

    public static void sharePublic(ShareList shareList, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            if (shareList.getAttributes().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO attributes_public (attribute_id) VALUES (?);");
                for (String attributeId : shareList.getAttributes()) {
                    MySql.setId(1, attributeId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getCharacteristics().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO characteristics_public (characteristic_id) VALUES (?);");
                for (String characteristicId : shareList.getCharacteristics()) {
                    MySql.setId(1, characteristicId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getCreatures().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO creatures_public (creature_id) VALUES (?);");
                for (String creatureId : shareList.getCreatures()) {
                    MySql.setId(1, creatureId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getItems().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO items_public (item_id) VALUES (?);");
                for (String itemId : shareList.getItems()) {
                    MySql.setId(1, itemId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getPowers().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO powers_public (power_id) VALUES (?);");
                for (String powerId : shareList.getPowers()) {
                    MySql.setId(1, powerId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getMonsters().size() > 0) {
                statement = connection.prepareStatement("INSERT IGNORE INTO monsters_public (monster_id) VALUES (?);");
                for (String monsterId : shareList.getMonsters()) {
                    //todo - monster powers
                    MySql.setId(1, monsterId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void sharePrivate(ShareList shareList, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            for (String username : users) {
                if (shareList.getAttributes().size() > 0) {
                    statement = connection.prepareCall("{call Attributes_Share_Private (?,?,?)}");
                    for (String attributeId : shareList.getAttributes()) {
                        MySql.setId(1, attributeId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                if (shareList.getCharacteristics().size() > 0) {
                    statement = connection.prepareCall("{call Characteristics_Share_Private (?,?,?)}");
                    for (String characteristicId : shareList.getCharacteristics()) {
                        MySql.setId(1, characteristicId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                if (shareList.getCreatures().size() > 0) {
                    statement = connection.prepareCall("{call Creatures_Share_Private (?,?,?)}");
                    for (String creatureId : shareList.getCreatures()) {
                        MySql.setId(1, creatureId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                if (shareList.getItems().size() > 0) {
                    statement = connection.prepareCall("{call Items_Share_Private (?,?,?)}");
                    for (String itemId : shareList.getItems()) {
                        MySql.setId(1, itemId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                if (shareList.getPowers().size() > 0) {
                    statement = connection.prepareCall("{call Powers_Share_Private (?,?,?)}");
                    for (String powerId : shareList.getPowers()) {
                        MySql.setId(1, powerId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                if (shareList.getMonsters().size() > 0) {
                    statement = connection.prepareCall("{call Monsters_Share_Private (?,?,?)}");
                    for (String monsterId : shareList.getMonsters()) {
                        //todo - monster powers
                        MySql.setId(1, monsterId, userId, statement);
                        statement.setInt(2, userId);
                        statement.setString(3, username);
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void unSharePrivate(ShareList shareList, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            if (shareList.getAttributes().size() > 0) {
                statement = connection.prepareCall("{call Attributes_Share_UnPublish (?,?)}");
                for (String attributeId : shareList.getAttributes()) {
                    MySql.setId(1, attributeId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getCharacteristics().size() > 0) {
                statement = connection.prepareCall("{call Characteristics_Share_UnPublish (?,?)}");
                for (String characteristicId : shareList.getCharacteristics()) {
                    MySql.setId(1, characteristicId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getCreatures().size() > 0) {
                statement = connection.prepareCall("{call Creatures_Share_UnPublish (?,?)}");
                for (String creatureId : shareList.getCreatures()) {
                    MySql.setId(1, creatureId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getItems().size() > 0) {
                statement = connection.prepareCall("{call Items_Share_UnPublish (?,?)}");
                for (String itemId : shareList.getItems()) {
                    MySql.setId(1, itemId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getPowers().size() > 0) {
                statement = connection.prepareCall("{call Powers_Share_UnPublish (?,?)}");
                for (String powerId : shareList.getPowers()) {
                    MySql.setId(1, powerId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            if (shareList.getMonsters().size() > 0) {
                statement = connection.prepareCall("{call Monsters_Share_UnPublish (?,?)}");
                for (String monsterId : shareList.getMonsters()) {
                    //todo - monster powers
                    MySql.setId(1, monsterId, userId, statement);
                    statement.setInt(2, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************************************************************************************************/

    public static void addDamageConfigurationsToShareList(List<DamageConfiguration> damages, int userId, ShareList shareList) throws Exception {
        if (damages != null) {
            for (DamageConfiguration config :damages) {
                addDamageConfigurationToShareList(config, userId, shareList);
            }
        }
    }

    public static void addDamageConfigurationToShareList(DamageConfiguration config, int userId, ShareList shareList) throws Exception {
        AttributeService.addToShareList(config.getDamageType(), userId, shareList);
        if (CUSTOM_LEVELS) {
            AttributeService.addToShareList(config.getLevel(), userId, shareList);
        }
        addDiceCollectionToShareList(config.getValues(), userId, shareList);
    }

    public static void addDiceCollectionToShareList(DiceCollection diceCollection, int userId, ShareList shareList) throws Exception {
        if (CUSTOM_ABILITIES && diceCollection != null) {
            AttributeService.addToShareList(diceCollection.getAbilityModifier(), userId, shareList);
        }
    }

    public static void addModifierConfigurationsToShareList(List<ModifierConfiguration> configs, int userId, ShareList shareList) throws Exception {
        if (configs != null) {
            for (ModifierConfiguration config : configs) {
                addModifierConfigurationToShareList(config, userId, shareList);
            }
        }
    }

    public static void addModifierConfigurationToShareList(ModifierConfiguration config, int userId, ShareList shareList) throws Exception {
        if (config != null) {
            AttributeService.addToShareList(config.getAttribute(), userId, shareList);
            if (CUSTOM_LEVELS) {
                AttributeService.addToShareList(config.getLevel(), userId, shareList);
            }
        }
    }

    public static void addItemQuantitiesToShareList(List<ItemQuantity> items, int userId, ShareList shareList) throws Exception {
        if (items != null) {
            for (ItemQuantity itemQuantity :items) {
                addItemQuantityToShareList(itemQuantity, userId, shareList);
            }
        }
    }

    public static void addItemQuantityToShareList(ItemQuantity itemQuantity, int userId, ShareList shareList) throws Exception {
        if (itemQuantity != null) {
            addItemListObjectToShareList(itemQuantity.getItem(), userId, shareList);
        }
    }

    public static void addItemListObjectToShareList(ItemListObject itemListObject, int userId, ShareList shareList) throws Exception {
        if (itemListObject != null) {
            ItemService.addToShareList(itemListObject, userId, shareList);

            addItemListObjectToShareList(itemListObject.getSubItem(), userId, shareList);

            for (ItemQuantity subItem : itemListObject.getSubItems()) {
                addItemQuantityToShareList(subItem, userId, shareList);
            }

            addApplicableMagicalItemsToShareList(itemListObject.getApplicableMagicalItems(), userId, shareList);
            addApplicableMagicalItemsToShareList(itemListObject.getApplicableSpells(), userId, shareList);
        }
    }

    public static void addApplicableMagicalItemsToShareList(List<MagicalItemApplicability> applicableMagicalItems, int userId, ShareList shareList) throws Exception {
        if (applicableMagicalItems != null) {
            for (MagicalItemApplicability applicableSpell : applicableMagicalItems) {
                addApplicableMagicalItemToShareList(applicableSpell, userId, shareList);
            }
        }
    }

    public static void addApplicableMagicalItemToShareList(MagicalItemApplicability magicalItemApplicability, int userId, ShareList shareList) throws Exception {
        if (magicalItemApplicability != null) {
            addItemListObjectToShareList(magicalItemApplicability.getItem(), userId, shareList);
            PowerService.addToShareList(magicalItemApplicability.getSpell(), userId, shareList);
            addFiltersToShareList(magicalItemApplicability.getFilters().getFilterValues(), userId, shareList);
        }
    }

    public static void addPowerAreaOfEffectToShareList(PowerAreaOfEffect powerAreaOfEffect, int userId, ShareList shareList) throws Exception {
        if (powerAreaOfEffect != null) {
            AttributeService.addToShareList(powerAreaOfEffect.getAreaOfEffect(), userId, shareList);
        }
    }

    public static void addLimitedUsesToShareList(List<LimitedUse> limitedUses, int userId, ShareList shareList) throws Exception {
        if (limitedUses != null) {
            for (LimitedUse limitedUse : limitedUses) {
                addLimitedUseToShareList(limitedUse, userId, shareList);
            }
        }
    }

    public static void addLimitedUseToShareList(LimitedUse limitedUse, int userId, ShareList shareList) throws Exception {
        if (limitedUse != null) {
            if (CUSTOM_LEVELS) {
                AttributeService.addToShareList(limitedUse.getCharacterLevel(), userId, shareList);
            }
            if (CUSTOM_ABILITIES) {
                AttributeService.addToShareList(limitedUse.getAbilityModifier(), userId, shareList);
            }
        }
    }

    public static void addModifiersToShareList(List<Modifier> modifiers, int userId, ShareList shareList) throws Exception {
        if (modifiers != null) {
            for (Modifier modifier : modifiers) {
                addModifierToShareList(modifier, userId, shareList);
            }
        }
    }

    public static void addModifierToShareList(Modifier modifier, int userId, ShareList shareList) throws Exception {
        if (modifier != null) {
            AttributeService.addToShareList(modifier.getAttribute(), userId, shareList);
        }
    }

    public static void addItemProficienciesToShareList(List<ItemProficiency> proficiencies, int userId, ShareList shareList) throws Exception {
        if (proficiencies != null) {
            for (ItemProficiency proficiency : proficiencies) {
                ItemService.addToShareList(proficiency.getItem(), userId, shareList);
            }
        }
    }

    public static void addProficienciesToShareList(List<Proficiency> proficiencies, int userId, boolean attribute, boolean item, ShareList shareList) throws Exception {
        if (proficiencies != null) {
            for (Proficiency proficiency : proficiencies) {
                addProficiencyToShareList(proficiency, userId, attribute, item, shareList);
            }
        }
    }

    public static void addProficiencyToShareList(Proficiency proficiency, int userId, boolean attribute, boolean item, ShareList shareList) throws Exception {
        if (proficiency != null) {
            if (attribute) {
                AttributeService.addToShareList(proficiency.getAttribute(), userId, shareList);
            } else if (item) {
                ItemService.addToShareList(proficiency.getAttribute(), userId, shareList);
            }
        }
    }

    public static void addSpellConfigurationsToShareList(List<SpellConfiguration> configs, int userId, ShareList shareList) throws Exception {
        if (configs != null) {
            for (SpellConfiguration config : configs) {
                addSpellConfigurationToShareList(config, userId, shareList);
            }
        }
    }

    public static void addSpellConfigurationToShareList(SpellConfiguration config, int userId, ShareList shareList) throws Exception {
        if (config != null) {
            PowerService.addToShareList(config.getSpell(), userId, shareList);
//            CharacteristicService.addToShareList(config.getCharacterClass(), userId, shareList);
            if (CUSTOM_LEVELS) {
                AttributeService.addToShareList(config.getLevelGained(), userId, shareList);
            }
        }
    }

    public static void addInnateSpellConfigurationsToShareList(List<InnateSpellConfiguration> configs, int userId, ShareList shareList) throws Exception {
        if (configs != null) {
            for (InnateSpellConfiguration config : configs) {
                addInnateSpellConfigurationToShareList(config, userId, shareList);
            }
        }
    }

    public static void addInnateSpellConfigurationToShareList(InnateSpellConfiguration config, int userId, ShareList shareList) throws Exception {
        if (config != null) {
            PowerService.addToShareList(config.getSpell(), userId, shareList);
        }
    }

    public static void addStartingEquipmentToShareList(List<StartingEquipment> list, int userId, ShareList shareList) throws Exception {
        if (list != null) {
            for (StartingEquipment startingEquipment : list) {
                addStartingEquipmentToShareList(startingEquipment, userId, shareList);
            }
        }
    }

    public static void addStartingEquipmentToShareList(StartingEquipment startingEquipment, int userId, ShareList shareList) throws Exception {
        if (startingEquipment != null) {
            ItemService.addToShareList(startingEquipment.getItem(), userId, shareList);
            addFiltersToShareList(startingEquipment.getFilters().getFilterValues(), userId, shareList);
        }
    }

    public static void addDamageModifiersToShareList(List<DamageModifier> damageModifiers, int userId, ShareList shareList) throws Exception {
        if (damageModifiers != null) {
            for (DamageModifier damageModifier : damageModifiers) {
                addDamageModifierToShareList(damageModifier, userId, shareList);
            }
        }
    }

    public static void addDamageModifierToShareList(DamageModifier damageModifier, int userId, ShareList shareList) throws Exception {
        if (damageModifier != null) {
            AttributeService.addToShareList(damageModifier.getDamageType(), userId, shareList);
        }
    }

    public static void addFiltersToShareList(List<FilterValue> filterValues, int userId, ShareList shareList) throws Exception {
        if (filterValues == null || filterValues.isEmpty()) {
            return;
        }
        List<FilterKey> attributeKeys = FilterService.getAttributeKeys();
        for (FilterKey key : attributeKeys) {
            String value = FilterService.getFilterValue(filterValues, key);
            if (value != null && !value.equals("") && !value.equals(FilterValue.DEFAULT_OPTION)) {
                AttributeService.addToShareList(value, userId, shareList);
            }
        }
        List<FilterKey> characteristicKeys = FilterService.getCharacteristicKeys();
        for (FilterKey key : characteristicKeys) {
            String value = FilterService.getFilterValue(filterValues, key);
            if (value != null && !value.equals("") && !value.equals(FilterValue.DEFAULT_OPTION)) {
                CharacteristicService.addToShareList(value, userId, shareList);
            }
        }
    }

    /************************************************************************************************/

    public static void addDamageConfigurationsToMyStuff(List<DamageConfiguration> damages, int userId) throws Exception {
        if (damages != null) {
            for (DamageConfiguration config :damages) {
                addDamageConfigurationToMyStuff(config, userId);
            }
        }
    }

    public static void addDamageConfigurationToMyStuff(DamageConfiguration config, int userId) throws Exception {
        AttributeService.addToMyStuff(config.getDamageType(), userId);
        if (CUSTOM_LEVELS) {
            AttributeService.addToMyStuff(config.getLevel(), userId);
        }
        addDiceCollectionToMyStuff(config.getValues(), userId);
    }

    public static void addDiceCollectionToMyStuff(DiceCollection diceCollection, int userId) throws Exception {
        if (CUSTOM_ABILITIES && diceCollection != null) {
            AttributeService.addToMyStuff(diceCollection.getAbilityModifier(), userId);
        }
    }

    public static void addModifierConfigurationsToMyStuff(List<ModifierConfiguration> configs, int userId) throws Exception {
        if (configs != null) {
            for (ModifierConfiguration config : configs) {
                addModifierConfigurationToMyStuff(config, userId);
            }
        }
    }

    public static void addModifierConfigurationToMyStuff(ModifierConfiguration config, int userId) throws Exception {
        if (config != null) {
            AttributeService.addToMyStuff(config.getAttribute(), userId);
            if (CUSTOM_LEVELS) {
                AttributeService.addToMyStuff(config.getLevel(), userId);
            }
        }
    }

    public static void addItemQuantitiesToMyStuff(List<ItemQuantity> items, int userId) throws Exception {
        if (items != null) {
            for (ItemQuantity itemQuantity :items) {
                addItemQuantityToMyStuff(itemQuantity, userId);
            }
        }
    }

    public static void addItemQuantityToMyStuff(ItemQuantity itemQuantity, int userId) throws Exception {
        if (itemQuantity != null) {
            addItemListObjectToMyStuff(itemQuantity.getItem(), userId);
        }
    }

    public static void addItemListObjectToMyStuff(ItemListObject itemListObject, int userId) throws Exception {
        if (itemListObject != null) {
            ItemService.addToMyStuff(itemListObject, userId);

            addItemListObjectToMyStuff(itemListObject.getSubItem(), userId);

            for (ItemQuantity subItem : itemListObject.getSubItems()) {
                addItemQuantityToMyStuff(subItem, userId);
            }

            addApplicableMagicalItemsToMyStuff(itemListObject.getApplicableMagicalItems(), userId);
            addApplicableMagicalItemsToMyStuff(itemListObject.getApplicableSpells(), userId);
        }
    }

    public static void addApplicableMagicalItemsToMyStuff(List<MagicalItemApplicability> applicableMagicalItems, int userId) throws Exception {
        if (applicableMagicalItems != null) {
            for (MagicalItemApplicability applicableSpell : applicableMagicalItems) {
                addApplicableMagicalItemToMyStuff(applicableSpell, userId);
            }
        }
    }

    public static void addApplicableMagicalItemToMyStuff(MagicalItemApplicability magicalItemApplicability, int userId) throws Exception {
        if (magicalItemApplicability != null) {
            addItemListObjectToMyStuff(magicalItemApplicability.getItem(), userId);
            PowerService.addToMyStuff(magicalItemApplicability.getSpell(), userId);
            addToMyStuff(magicalItemApplicability.getFilters().getFilterValues(), userId);
        }
    }

    public static void addPowerAreaOfEffectToMyStuff(PowerAreaOfEffect powerAreaOfEffect, int userId) throws Exception {
        if (powerAreaOfEffect != null) {
            AttributeService.addToMyStuff(powerAreaOfEffect.getAreaOfEffect(), userId);
        }
    }

    public static void addLimitedUsesToMyStuff(List<LimitedUse> limitedUses, int userId) throws Exception {
        if (limitedUses != null) {
            for (LimitedUse limitedUse : limitedUses) {
                addLimitedUseToMyStuff(limitedUse, userId);
            }
        }
    }

    public static void addLimitedUseToMyStuff(LimitedUse limitedUse, int userId) throws Exception {
        if (limitedUse != null) {
            if (CUSTOM_LEVELS) {
                AttributeService.addToMyStuff(limitedUse.getCharacterLevel(), userId);
            }
            if (CUSTOM_ABILITIES) {
                String abilityModifier = AttributeService.addToMyStuff(limitedUse.getAbilityModifier(), userId);
                limitedUse.setAbilityModifier(abilityModifier);
            }
        }
    }

    public static void addModifiersToMyStuff(List<Modifier> modifiers, int userId) throws Exception {
        if (modifiers != null) {
            for (Modifier modifier : modifiers) {
                addModifierToMyStuff(modifier, userId);
            }
        }
    }

    public static void addModifierToMyStuff(Modifier modifier, int userId) throws Exception {
        if (modifier != null) {
            AttributeService.addToMyStuff(modifier.getAttribute(), userId);
        }
    }

    public static void addItemProficienciesToMyStuff(List<ItemProficiency> proficiencies, int userId) throws Exception {
        if (proficiencies != null) {
            for (ItemProficiency proficiency : proficiencies) {
                ItemService.addToMyStuff(proficiency.getItem(), userId);
            }
        }
    }

    public static void addProficienciesToMyStuff(List<Proficiency> proficiencies, int userId, boolean attribute, boolean item) throws Exception {
        if (proficiencies != null) {
            for (Proficiency proficiency : proficiencies) {
                addProficiencyToMyStuff(proficiency, userId, attribute, item);
            }
        }
    }

    public static void addProficiencyToMyStuff(Proficiency proficiency, int userId, boolean attribute, boolean item) throws Exception {
        if (proficiency != null) {
            if (attribute) {
                AttributeService.addToMyStuff(proficiency.getAttribute(), userId);
            } else if (item) {
                ItemService.addToMyStuff(proficiency.getAttribute(), userId);
            }
        }
    }

    public static void addSpellConfigurationsToMyStuff(List<SpellConfiguration> configs, int userId) throws Exception {
        if (configs != null) {
            for (SpellConfiguration config : configs) {
                addSpellConfigurationToMyStuff(config, userId);
            }
        }
    }

    public static void addSpellConfigurationToMyStuff(SpellConfiguration config, int userId) throws Exception {
        if (config != null) {
            PowerService.addToMyStuff(config.getSpell(), userId);
//            CharacteristicService.addToMyStuff(config.getCharacterClass(), userId);
            if (CUSTOM_LEVELS) {
                AttributeService.addToMyStuff(config.getLevelGained(), userId);
            }
        }
    }

    public static void addInnateSpellConfigurationsToMyStuff(List<InnateSpellConfiguration> configs, int userId) throws Exception {
        if (configs != null) {
            for (InnateSpellConfiguration config : configs) {
                addInnateSpellConfigurationToMyStuff(config, userId);
            }
        }
    }

    public static void addInnateSpellConfigurationToMyStuff(InnateSpellConfiguration config, int userId) throws Exception {
        if (config != null) {
            PowerService.addToMyStuff(config.getSpell(), userId);
        }
    }

    public static void addStartingEquipmentToMyStuff(List<StartingEquipment> list, int userId) throws Exception {
        if (list != null) {
            for (StartingEquipment startingEquipment : list) {
                addStartingEquipmentToMyStuff(startingEquipment, userId);
            }
        }
    }

    public static void addStartingEquipmentToMyStuff(StartingEquipment startingEquipment, int userId) throws Exception {
        if (startingEquipment != null) {
            ItemService.addToMyStuff(startingEquipment.getItem(), userId);
            addToMyStuff(startingEquipment.getFilters().getFilterValues(), userId);
        }
    }

    public static void addDamageModifiersToMyStuff(List<DamageModifier> damageModifiers, int userId) throws Exception {
        if (damageModifiers != null) {
            for (DamageModifier damageModifier : damageModifiers) {
                addDamageModifierToMyStuff(damageModifier, userId);
            }
        }
    }

    public static void addDamageModifierToMyStuff(DamageModifier damageModifier, int userId) throws Exception {
        if (damageModifier != null) {
            AttributeService.addToMyStuff(damageModifier.getDamageType(), userId);
        }
    }

    public static void addToMyStuff(List<FilterValue> filterValues, int userId) throws Exception {
        if (filterValues == null || filterValues.isEmpty()) {
            return;
        }
        List<FilterKey> attributeKeys = FilterService.getAttributeKeys();
        for (FilterKey key : attributeKeys) {
            String value = FilterService.getFilterValue(filterValues, key);
            if (value != null && !value.equals("") && !value.equals(FilterValue.DEFAULT_OPTION)) {
                String newId = AttributeService.addToMyStuff(value, userId);
                FilterService.setFilterValue(filterValues, key, newId);
            }
        }

        List<FilterKey> characteristicKeys = FilterService.getCharacteristicKeys();
        for (FilterKey key : characteristicKeys) {
            String value = FilterService.getFilterValue(filterValues, key);
            if (value != null && !value.equals("") && !value.equals(FilterValue.DEFAULT_OPTION)) {
                String newId = CharacteristicService.addToMyStuff(value, userId);
                FilterService.setFilterValue(filterValues, key, newId);
            }
        }
    }
}
