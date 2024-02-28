package com.herd.squire.rest;

import com.herd.squire.models.FilterSorts;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.services.attributes.*;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/attributes")
public class AttributesRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createAttribute(Attribute attribute, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.createAttribute(attribute, headers)).build();
    }

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishAttribute(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        AttributeService.publishAttribute(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Attribute attribute, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.addToMyStuff(id, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateAttribute(Attribute attribute, @Context HttpHeaders headers) throws Exception {
        AttributeService.updateAttribute(attribute, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/modifiers")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getModifiers(@Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.getModifiers(headers)).build();
    }

    @GET
    @Path("/type/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAttributes(@PathParam("type") String type, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        AttributeType attributeType = AttributeType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(AttributeService.getAttributes(attributeType, listSource, headers)).build();
    }

    @GET
    @Path("/type/{type}/detailed")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAttributesDetailed(@PathParam("type") String type, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        AttributeType attributeType = AttributeType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        switch (attributeType) {
            case ABILITY:
                return Response.ok(AbilityService.getAbilities(headers)).build();
            case CONDITION:
                return Response.ok(ConditionService.getConditions(headers, listSource)).build();
            case LEVEL:
                return Response.ok(CharacterLevelService.getLevels(headers)).build();
            case SKILL:
                return Response.ok(SkillService.getSkills(headers)).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAttribute(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.getAttribute(id, headers)).build();
    }

    @POST
    @Path("/type/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFilteredAttributes(@PathParam("type") String type, @QueryParam("source") String source, FilterSorts filterSorts, @Context HttpHeaders headers) throws Exception {
        AttributeType attributeType = AttributeType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(AttributeService.getFilteredAttributes(attributeType, listSource, filterSorts, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.inUse(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAttribute(@PathParam("id") String id,
                               @Context HttpHeaders headers) throws Exception {
        AttributeService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(AttributeService.duplicate(id, name, headers)).build();
    }
}
