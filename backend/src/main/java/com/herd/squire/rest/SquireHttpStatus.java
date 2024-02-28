package com.herd.squire.rest;

import javax.ws.rs.core.Response;

public enum SquireHttpStatus implements Response.StatusType {
    ERROR_DELETING(418, "Unable to delete"),
    INTERNAL_SERVER_ERROR(500, "An unknown error has occurred. Please contact support.");

    private final int code;
    private final String reason;
    private final Response.Status.Family family;

    private SquireHttpStatus(int statusCode, String reasonPhrase) {
        this.code = statusCode;
        this.reason = reasonPhrase;
        this.family = Response.Status.Family.familyOf(statusCode);
    }

    public String toString() {
        return this.reason;
    }

    @Override
    public int getStatusCode() {
        return this.code;
    }

    @Override
    public Response.Status.Family getFamily() {
        return this.family;
    }

    @Override
    public String getReasonPhrase() {
        return this.toString();
    }
}
