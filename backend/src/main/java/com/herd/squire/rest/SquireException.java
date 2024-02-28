package com.herd.squire.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class SquireException extends WebApplicationException {
    private SquireHttpStatus status;

    public SquireException(SquireHttpStatus status) {
        super(Response.status(status).build());
    }

    public SquireHttpStatus getStatus() {
        return status;
    }

    public void setStatus(SquireHttpStatus status) {
        this.status = status;
    }
}
