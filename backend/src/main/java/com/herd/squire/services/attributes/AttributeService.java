package com.herd.squire.services.attributes;

import com.herd.squire.models.FilterSorts;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.creatures.CreatureFilter;
import com.herd.squire.models.creatures.CreatureSort;
import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.powers.ModifierCategory;
import com.herd.squire.models.powers.ModifierType;
import com.herd.squire.models.sharing.*;
import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.Sorts;
import com.herd.squire.services.*;
import com.herd.squire.utilities.MySql;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.core.HttpHeaders;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import static com.herd.squire.services.SharingUtilityService.*;

public class AttributeService {
    private static final AbilityService abilityService = new AbilityService();
    private static final AreaOfEffectService areaOfEffectService = new AreaOfEffectService();
    private static final ArmorTypeService armorTypeService = new ArmorTypeService();
    private static final CasterTypeService casterTypeService = new CasterTypeService();
    private static final ConditionService conditionService = new ConditionService();
    private static final DamageTypeService damageTypeService = new DamageTypeService();
    private static final LanguageService languageService = new LanguageService();
    private static final CharacterLevelService levelService = new CharacterLevelService();
    private static final SkillService skillService = new SkillService();
    private static final ToolCategoryService toolCategoryService = new ToolCategoryService();
    private static final WeaponPropertyService weaponPropertyService = new WeaponPropertyService();
    private static final WeaponTypeService weaponTypeService = new WeaponTypeService();
    private static final SpellSchoolService spellSchoolService = new SpellSchoolService();
    private static final AlignmentService alignmentService = new AlignmentService();
    private static final DeityCategoryService deityCategoryService = new DeityCategoryService();
    private static final DeityService deityService = new DeityService();
    private static final MiscAttributeService miscAttributeService = new MiscAttributeService();

    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    private static AttributeDetailsService getService(AttributeType attributeType) throws Exception {
        AttributeDetailsService attributeDetailsService = null;
        switch (attributeType) {
            case NONE:
                break;
            case ABILITY:
                attributeDetailsService = abilityService;
                break;
            case AREA_OF_EFFECT:
                attributeDetailsService = areaOfEffectService;
                break;
            case ARMOR_TYPE:
                attributeDetailsService = armorTypeService;
                break;
            case CASTER_TYPE:
                attributeDetailsService = casterTypeService;
                break;
            case CONDITION:
                attributeDetailsService = conditionService;
                break;
            case DAMAGE_TYPE:
                attributeDetailsService = damageTypeService;
                break;
            case LANGUAGE:
                attributeDetailsService = languageService;
                break;
            case LEVEL:
                attributeDetailsService = levelService;
                break;
            case SKILL:
                attributeDetailsService = skillService;
                break;
            case TOOL_CATEGORY:
                attributeDetailsService = toolCategoryService;
                break;
            case WEAPON_PROPERTY:
                attributeDetailsService = weaponPropertyService;
                break;
            case WEAPON_TYPE:
                attributeDetailsService = weaponTypeService;
                break;
            case SPELL_SCHOOL:
                attributeDetailsService = spellSchoolService;
                break;
            case ALIGNMENT:
                attributeDetailsService = alignmentService;
                break;
            case DEITY_CATEGORY:
                attributeDetailsService = deityCategoryService;
                break;
            case DEITY:
                attributeDetailsService = deityService;
                break;
            case MISC:
                attributeDetailsService = miscAttributeService;
                break;
        }

        if (attributeDetailsService == null) {
            throw new Exception("Invalid Attribute Type");
        }
        return attributeDetailsService;
    }

    public static Attribute getAttribute(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getAttribute(decodedId, headers);
    }

    private static Attribute getAttribute(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getAttribute(id, userId);
    }

    private static Attribute getAttribute(long id, int userId) throws Exception {
        Attribute attribute = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    AttributeType attributeType = AttributeType.valueOf(resultSet.getInt("attribute_type_id"));

                    if (statement.getMoreResults()) {
                        AttributeDetailsService attributeDetailsService = getService(attributeType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            attribute = attributeDetailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return attribute;
    }

    public static String createAttribute(Attribute attribute, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = createAttribute(attribute, userId);
        return MySql.encodeId(newId, userId);
    }

    public static long createAttribute(Attribute attribute, int userId) throws Exception {
        AttributeDetailsService attributeDetailsService = getService(attribute.getAttributeType());
        return attributeDetailsService.create(attribute, userId);
    }

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long attributeId = MySql.decodeId(id, userId);
        return getPublishedDetails(attributeId, userId);
    }

    private static PublishDetails getPublishedDetails(long attributeId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetPublishedDetails (?,?)}");
            statement.setLong(1, attributeId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    boolean published = resultSet.getBoolean("published");
                    publishDetails.setPublished(published);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<String> users = publishDetails.getUsers();
                    while (resultSet.next()) {
                        String username = resultSet.getString("username");
                        users.add(username);
                    }
                    if (!users.isEmpty()) {
                        publishDetails.setPublishType(PublishType.PRIVATE);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return publishDetails;
    }

    public static void publishAttribute(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long attributeId = MySql.decodeId(id, userId);
        publishAttribute(attributeId, publishRequest, userId);
    }

    private static void publishAttribute(long attributeId, PublishRequest publishRequest, int userId) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            if (publishRequest.getPublishType() == PublishType.PUBLIC) {
                publishPublic(attributeId, userId);
            } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
                publishPrivate(attributeId, publishRequest.getUsers(), userId);
            } else {
                unPublish(attributeId, connection, userId);
            }

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void publishPublic(long attributeId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getAttributeShareList(attributeId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void unPublish(long attributeId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Attributes_Share_UnPublish (?,?)}");
            statement.setLong(1, attributeId);
            statement.setInt(2, userId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void publishPrivate(long attributeId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getAttributeShareList(attributeId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    public static VersionInfo getVersionInfo(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long attributeId = MySql.decodeId(id, userId);
        return getVersionInfo(attributeId, userId);
    }

    private static VersionInfo getVersionInfo(long attributeId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_VersionInfo (?,?)}");
            statement.setLong(1, attributeId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    versionInfo = new VersionInfo(
                            resultSet.getInt("version"),
                            resultSet.getInt("author_version")
                    );
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return versionInfo;
    }

    /********************************************************************************************/

    public static void addToShareList(List<ListObject> attributes, int userId, ShareList shareList) throws Exception {
        if (attributes != null) {
            for (ListObject item : attributes) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject attribute, int userId, ShareList shareList) throws Exception {
        if (attribute != null && attribute.getSid() == 0) {
            long id = MySql.decodeId(attribute.getId(), userId);
            if (id != 0) {
                addToShareList(id, userId, shareList);
            }
        }
    }

    public static void addToShareList(String id, int userId, ShareList shareList) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                addToShareList(decodeId, userId, shareList);
            }
        }
    }

    public static void addToShareList(long id, int userId, ShareList shareList) throws Exception {
        Attribute attribute = getAttribute(id, userId);
        addToShareList(attribute, userId, shareList);
    }

    public static void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (attribute != null && attribute.getSid() == 0) {
            AttributeType attributeType = attribute.getAttributeType();
            if ((attributeType == AttributeType.ABILITY && !CUSTOM_ABILITIES)
                    || (attributeType == AttributeType.LEVEL && !CUSTOM_LEVELS)
                    || (attributeType == AttributeType.SPELL_SCHOOL && !CUSTOM_SPELL_SCHOOLS)
                    || (attributeType == AttributeType.WEAPON_TYPE && !CUSTOM_WEAPON_TYPES)
                    || (attributeType == AttributeType.MISC && !CUSTOM_MISC)
            ) {
                return;
            }

            AttributeDetailsService attributeDetailsService = getService(attribute.getAttributeType());
            attributeDetailsService.addToShareList(attribute, userId, shareList);
        }
    }

    /********************************************************************************************/

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long attributeId = MySql.decodeId(id, userId);
        if (attributeId == 0) {
            return "0";
        }
        long newId = addToMyStuff(attributeId, userId, true);
        return MySql.encodeId(newId, userId);
    }

    public static void addToMyStuff(List<ListObject> items, int userId) throws Exception {
        if (items != null) {
            for (ListObject item : items) {
                addToMyStuff(item, userId);
            }
        }
    }

    public static String addToMyStuff(ListObject attribute, int userId) throws Exception {
        if (attribute != null) {
            long id = MySql.decodeId(attribute.getId(), userId);
            if (id != 0) {
                long attributeId = addToMyStuff(id, userId, false);
                attribute.setId(MySql.encodeId(attributeId, userId));
                return MySql.encodeId(attributeId, userId);
            }
        }
        return "0";
    }

    public static String addToMyStuff(Attribute attribute, int userId) throws Exception {
        if (attribute != null) {
            long id = MySql.decodeId(attribute.getId(), userId);
            if (id != 0) {
                AttributeType attributeType = attribute.getAttributeType();
                if ((attributeType == AttributeType.ABILITY && !CUSTOM_ABILITIES)
                        || (attributeType == AttributeType.LEVEL && !CUSTOM_LEVELS)
                        || (attributeType == AttributeType.SPELL_SCHOOL && !CUSTOM_SPELL_SCHOOLS)
                        || (attributeType == AttributeType.WEAPON_TYPE && !CUSTOM_WEAPON_TYPES)
                        || (attributeType == AttributeType.MISC && !CUSTOM_MISC)
                ) {
                    addSystemAttribute(id, userId);
                    return MySql.encodeId(id, userId);
                }

                long attributeId = addToMyStuff(id, userId, false);
                attribute.setId(MySql.encodeId(attributeId, userId));
                return MySql.encodeId(attributeId, userId);
            }
        }
        return "0";
    }

    public static String addToMyStuff(String id, int userId) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                long attributeId = addToMyStuff(decodeId, userId, false);
                return MySql.encodeId(attributeId, userId);
            }
        }
        return "0";
    }

    private static long addToMyStuff(long attributeId, int userId, boolean checkRights) throws Exception {
        long authorAttributeId = 0;
        int authorUserId = 0;
        long existingAttributeId = 0;
        AttributeType attributeType = null;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, attributeId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorAttributeId = resultSet.getLong("author_attribute_id");
                    if (authorAttributeId == 0) {
                        throw new Exception("unable to find attribute to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingAttributeId = resultSet.getLong("existing_attribute_id");

                    int authorAttributeTypeId = resultSet.getInt("author_attribute_type_id");
                    attributeType = AttributeType.valueOf(authorAttributeTypeId);
                    int existingAttributeTypeId = resultSet.getInt("existing_attribute_type_id");
                    if (existingAttributeId > 0 && authorAttributeTypeId != existingAttributeTypeId) {
                        throw new Exception("unable to update existing attribute");
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        if ((attributeType == AttributeType.ABILITY && !CUSTOM_ABILITIES)
                || (attributeType == AttributeType.LEVEL && !CUSTOM_LEVELS)
                || (attributeType == AttributeType.SPELL_SCHOOL && !CUSTOM_SPELL_SCHOOLS)
                || (attributeType == AttributeType.WEAPON_TYPE && !CUSTOM_WEAPON_TYPES)
                || (attributeType == AttributeType.MISC && !CUSTOM_MISC)
        ) {
            addSystemAttribute(authorAttributeId, userId);
            return authorAttributeId;
        }

        Attribute authorAttribute = getAttribute(authorAttributeId, authorUserId);
        if (authorAttribute == null) {
            throw new Exception("unable to find attribute to add");
        }
        ListObject existingAttribute = null;
        if (existingAttributeId != 0) {
            existingAttribute = new ListObject(
                    MySql.encodeId(existingAttributeId, userId),
                    "",
                    0,
                    false
            );
        }

        AttributeDetailsService attributeDetailsService = getService(authorAttribute.getAttributeType());
        long newId = attributeDetailsService.addToMyStuff(authorAttribute, authorUserId, existingAttribute, userId);
        if (newId < 1) {
            throw new Exception("unable to add attribute");
        }
        if (authorAttribute.getSid() == 0) {
            updateParentId(newId, authorAttributeId, authorAttribute.getVersion());
        }
        return newId;
    }

    public static void addSystemAttribute(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO attributes_shared (attribute_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE attributes SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
            statement.setLong(1, parentId);
            statement.setInt(2, parentVersion);

            // This is intentionally the same value as the previous column. Make sure the version matches the parent version whenever updating.
            statement.setInt(3, parentVersion);
            statement.setLong(4, id);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<ModifierType> getModifiers(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ModifierType> modifiers = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetList_Modifiers (?)}");
            statement.setInt(1, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    modifiers.add(getModifierType(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return modifiers;
    }

    private static ModifierType getModifierType(ResultSet resultSet, int userId) throws Exception {
        return new ModifierType(
                new Attribute(
                        MySql.encodeId(resultSet.getLong("id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        AttributeType.valueOf(resultSet.getInt("attribute_type_id")),
                        resultSet.getInt("sid"),
                        resultSet.getBoolean("is_author"),
                        resultSet.getInt("version")
                ),
                ModifierCategory.valueOf(resultSet.getInt("modifier_category_id")),
                resultSet.getBoolean("characteristic_dependant")
        );
    }

    public static FilterSorts getFilterSorts(AttributeType attributeType, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts) {
        FilterType filterType = null;
        SortType sortType = null;
        switch (attributeType) {
            case CONDITION:
                filterType = FilterType.CONDITION;
                sortType = SortType.CONDITION;
                break;
            case SKILL:
                filterType = FilterType.SKILL;
                sortType = SortType.SKILL;
                break;
        }
        Filters filters = new Filters(FilterService.getFilters(creatureFilters, filterType), true);
        Sorts sorts = new Sorts(SortService.getSorts(creatureSorts, sortType));
        return new FilterSorts(filters, sorts);
    }

    public static List<ListObject> getAttributes(AttributeType attributeType, ListSource listSource, HttpHeaders headers) throws Exception {
        return getFilteredAttributes(attributeType, listSource, null, headers);
    }

    public static List<ListObject> getFilteredAttributes(AttributeType attributeType, ListSource listSource, FilterSorts filterSorts, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getFilteredAttributes(attributeType, listSource, filterSorts, userId);
    }

    public static List<ListObject> getFilteredAttributes(AttributeType attributeType, ListSource listSource, FilterSorts filterSorts, int userId) throws Exception {
        List<ListObject> items = new ArrayList<>();
        if (filterSorts == null) {
            filterSorts = new FilterSorts();
        }

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            AttributeDetailsService attributeDetailsService = getService(attributeType);
            statement = attributeDetailsService.getListObjectStatement(connection, filterSorts.getFilters().getFilterValues(), filterSorts.getSorts().getSortValues(), 0, userId, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    items.add(
                            new ListObject(
                                    MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                                    resultSet.getString("name"),
                                    resultSet.getString("description"),
                                    resultSet.getInt("sid"),
                                    resultSet.getBoolean("is_author")
                            )
                    );
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static void updateAttribute(Attribute attribute, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(attribute.getId(), userId);
        AttributeDetailsService attributeDetailsService = getService(attribute.getAttributeType());
        boolean success = attributeDetailsService.update(attribute, id, userId);
        if (!success) {
            throw new Exception("Unable to update attribute");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static List<InUse> inUse(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return inUse(decodedId, userId);
    }

    public static List<InUse> inUse(long id, int userId) throws Exception {
        List<InUse> results = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_InUse (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    results.add(InUseFactory.getInUse(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return results;
    }

    public static void delete(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        delete(decodedId, headers);
    }

    public static void delete(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        delete(id, userId);
    }

    public static void delete(long id, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Delete (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    result = resultSet.getInt("result");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (result != 1) {
            throw new Exception("unable to delete");
        }
    }

    public static String duplicate(String id, String name, HttpHeaders headers) throws Exception {
        Attribute attribute = getAttribute(id, headers);
        if (attribute == null) {
            throw new Exception("attribute not found");
        }
        attribute.setId("0");
        attribute.setName(name);
        return createAttribute(attribute, headers);
    }
}
