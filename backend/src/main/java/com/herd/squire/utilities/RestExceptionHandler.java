package com.herd.squire.utilities;

import com.herd.squire.rest.SquireException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class RestExceptionHandler implements ExceptionMapper<SquireException> {
    @Override
    public Response toResponse(SquireException ex) {
        return ex.getResponse();
    }
}
