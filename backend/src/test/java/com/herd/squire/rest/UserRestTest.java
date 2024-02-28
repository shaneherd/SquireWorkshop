package com.herd.squire.rest;

import com.google.gson.Gson;
import com.herd.squire.models.user.UserSettings;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.UserService;
import com.herd.squire.utilities.SquireProperties;
import org.jboss.resteasy.core.Dispatcher;
import org.jboss.resteasy.mock.MockDispatcherFactory;
import org.jboss.resteasy.mock.MockHttpRequest;
import org.jboss.resteasy.mock.MockHttpResponse;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import javax.servlet.http.HttpServletResponse;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

@RunWith(PowerMockRunner.class)
@PrepareForTest({UserService.class, AuthenticationService.class})
public class UserRestTest {
    private final String EXCEPTION_MESSAGE = "exception message";
    private static Dispatcher dispatcher;
    private static MockHttpResponse response;

    @Before
    public void setUp() {
        dispatcher = MockDispatcherFactory.createDispatcher();
        UserRest userRest = new UserRest();
        dispatcher.getRegistry().addSingletonResource(userRest);
        response = new MockHttpResponse();
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(AuthenticationService.class);
    }

    @Test
    public void changePassword() {
        try {
            PowerMockito.doNothing().when(AuthenticationService.class, "authorizedToModify", Mockito.any(), Mockito.anyString());
            PowerMockito.doNothing().when(AuthenticationService.class, "changePassword", Mockito.anyString(), Mockito.anyString(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/changePassword");
            request.addFormHeader("username", "username");
            request.addFormHeader("originalPassword", "originalPassword");
            request.addFormHeader("newPassword", "newPassword");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void changePasswordException() {
        try {
            PowerMockito.doThrow(new Exception(EXCEPTION_MESSAGE)).when(AuthenticationService.class, "authorizedToModify", Mockito.any(), Mockito.anyString());
            PowerMockito.doNothing().when(AuthenticationService.class, "changePassword", Mockito.anyString(), Mockito.anyString(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/changePassword");
            request.addFormHeader("username", "username");
            request.addFormHeader("originalPassword", "originalPassword");
            request.addFormHeader("newPassword", "newPassword");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void changeEmail() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(1);
            PowerMockito.doNothing().when(AuthenticationService.class, "changeEmail", Mockito.anyInt(), Mockito.anyString(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/changeEmail");
            request.addFormHeader("password", "password");
            request.addFormHeader("email", "email");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void changeEmailException() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenThrow(new Exception(EXCEPTION_MESSAGE));
            PowerMockito.doNothing().when(AuthenticationService.class, "changeEmail", Mockito.anyInt(), Mockito.anyString(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/changeEmail");
            request.addFormHeader("password", "password");
            request.addFormHeader("email", "email");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void delete() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(1);
            PowerMockito.doNothing().when(UserService.class, "deleteUser", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/delete");
            request.addFormHeader("password", "password");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void deleteException() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenThrow(new Exception(EXCEPTION_MESSAGE));
            PowerMockito.doNothing().when(UserService.class, "deleteUser", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/delete");
            request.addFormHeader("password", "password");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void deleteNullPassword() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(1);
            PowerMockito.doNothing().when(UserService.class, "deleteUser", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/delete");
            request.addFormHeader("password", null);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals("Password is required", response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void restoreDefaults() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(1);
            PowerMockito.doNothing().when(UserService.class, "restoreDefaults", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/restoreDefaults");
            request.addFormHeader("password", "password");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void restoreDefaultsException() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenThrow(new Exception(EXCEPTION_MESSAGE));
            PowerMockito.doNothing().when(UserService.class, "restoreDefaults", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/restoreDefaults");
            request.addFormHeader("password", "password");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void restoreDefaultsNullPassword() {
        try {
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(1);
            PowerMockito.doNothing().when(UserService.class, "restoreDefaults", Mockito.anyInt(), Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/user/1/restoreDefaults");
            request.addFormHeader("password", null);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals("Password is required", response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void updateSettings() {
        try {
            int userId = 1;
            UserSettings userSettings = new UserSettings();
            userSettings.setLanguage("language");

            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenReturn(userId);
            PowerMockito.doNothing().when(UserService.class, "updateUserSettings", userId, userSettings);

            MockHttpRequest request = MockHttpRequest.post("/user/1/settings/update");
            request.contentType("application/json");
            String content = new Gson().toJson(userSettings);
            request.content(content.getBytes());
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void updateSettingsException() {
        try {
            int userId = 1;
            UserSettings userSettings = new UserSettings();
            Mockito.when(AuthenticationService.getUserId(Mockito.anyObject(), Mockito.anyString())).thenThrow(new Exception(EXCEPTION_MESSAGE));
            PowerMockito.doNothing().when(UserService.class, "updateUserSettings", userId, userSettings);

            MockHttpRequest request = MockHttpRequest.post("/user/1/settings/update");
            request.contentType("application/json");
            String content = new Gson().toJson(userSettings);
            request.content(content.getBytes());
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }
}
