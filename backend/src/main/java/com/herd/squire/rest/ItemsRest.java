package com.herd.squire.rest;

import com.herd.squire.models.ListSource;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemType;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.services.items.ItemService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/items")
public class ItemsRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createItem(Item item, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.createItem(item, headers)).build();
    }

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishItem(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        ItemService.publishItem(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Item item, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.addToMyStuff(id, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateItem(Item item, @Context HttpHeaders headers) throws Exception {
        ItemService.updateItem(item, headers);
        return Response.ok().build();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response getItems(@QueryParam("offset") int offset, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(ItemService.getItems(offset, listSource, headers)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getItems(Filters filters, @QueryParam("offset") int offset, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(ItemService.getItems(filters, offset, listSource, headers)).build();
    }

    @GET
    @Path("/type/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getItems(@PathParam("type") String type, @QueryParam("offset") int offset, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ItemType itemType = ItemType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(ItemService.getItems(itemType, offset, listSource, headers)).build();
    }

    @GET
    @Path("/slots/detailed")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getEquipmentSlots(@Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.getEquipmentSlots(headers)).build();
    }

    @GET
    @Path("/type/{type}/subType/{subTypeId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getItems(@PathParam("type") String type, @PathParam("subTypeId") String subTypeId, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ItemType itemType = ItemType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(ItemService.getItems(itemType, subTypeId, listSource, headers)).build();
    }

    @GET
    @Path("/costUnits/detailed")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getCostUnits(@Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.getCostUnits(headers)).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItem(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.getItem(id, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.inUse(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteItem(@PathParam("id") String id,
                                   @Context HttpHeaders headers) throws Exception {
        ItemService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(ItemService.duplicate(id, name, headers)).build();
    }
}
