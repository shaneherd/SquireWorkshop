package com.herd.squire.rest;

import com.google.gson.Gson;
import com.herd.squire.models.AuthenticationResponse;
import com.herd.squire.models.user.User;
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
public class AuthenticationRestTest {
    private final String EXCEPTION_MESSAGE = "exception message";
    private Dispatcher dispatcher;
    private MockHttpResponse response;

    @Before
    public void setUp() {
        dispatcher = MockDispatcherFactory.createDispatcher();
        AuthenticationRest authenticationRest = new AuthenticationRest();
        dispatcher.getRegistry().addSingletonResource(authenticationRest);
        response = new MockHttpResponse();
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(AuthenticationService.class);
    }

    @Test
    public void register() {
        try {
            PowerMockito.when(AuthenticationService.class, "createUser", Mockito.anyString(), Mockito.anyString(), Mockito.anyString()).thenReturn(1);

            MockHttpRequest request = MockHttpRequest.post("/authentication/register");
            request.addFormHeader("username", "username");
            request.addFormHeader("password", "password");
            request.addFormHeader("email", "email");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void registerException() {
        try {
            PowerMockito.when(AuthenticationService.class, "createUser", Mockito.anyString(), Mockito.anyString(), Mockito.anyString()).thenThrow(new Exception(EXCEPTION_MESSAGE));

            MockHttpRequest request = MockHttpRequest.post("/authentication/register");
            request.addFormHeader("username", "username");
            request.addFormHeader("password", "password");
            request.addFormHeader("email", "email");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_BAD_REQUEST, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void login() {
        String username = "username";
        String password = "password";
        String jwt = "jwt";
        User user = new User();

        try {
            Mockito.when(AuthenticationService.authenticate(username, password)).thenReturn(user);
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString())).thenReturn(jwt);

            MockHttpRequest request = MockHttpRequest.post("/authentication/login");
            request.addFormHeader("username", username);
            request.addFormHeader("password", password);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
            String content = response.getContentAsString();
            Gson gson = new Gson();
            AuthenticationResponse authenticationResponse = gson.fromJson(content, AuthenticationResponse.class);
            assertEquals(jwt, authenticationResponse.getToken());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void loginException() {
        String username = "username";
        String password = "password";
        String jwt = "jwt";
        User user = new User();

        try {
            Mockito.when(AuthenticationService.authenticate(username, password)).thenThrow(new Exception(EXCEPTION_MESSAGE));
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString())).thenReturn(jwt);

            MockHttpRequest request = MockHttpRequest.post("/authentication/login");
            request.addFormHeader("username", username);
            request.addFormHeader("password", password);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void adminLogin() {
        String adminUsername = "adminUsername";
        String password = "password";
        String username = "username";
        String jwt = "jwt";

        User adminUser = new User();
        adminUser.setAdmin(true);

        User user = new User();
        user.setUserSettings(new UserSettings());
        user.getUserSettings().setAllowAdminAccess(true);

        try {
            Mockito.when(AuthenticationService.authenticate(adminUsername, password)).thenReturn(adminUser);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString(), Mockito.anyString())).thenReturn(jwt);
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/adminLogin");
            request.addFormHeader("adminUsername", adminUsername);
            request.addFormHeader("password", password);
            request.addFormHeader("username", username);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
            String content = response.getContentAsString();
            Gson gson = new Gson();
            AuthenticationResponse authenticationResponse = gson.fromJson(content, AuthenticationResponse.class);
            assertEquals(jwt, authenticationResponse.getToken());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void adminLoginException() {
        String adminUsername = "adminUsername";
        String password = "password";
        String username = "username";
        String jwt = "jwt";

        User adminUser = new User();
        adminUser.setAdmin(true);

        User user = new User();
        user.setUserSettings(new UserSettings());
        user.getUserSettings().setAllowAdminAccess(true);

        try {
            Mockito.when(AuthenticationService.authenticate(adminUsername, password)).thenThrow(new Exception(EXCEPTION_MESSAGE));
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString(), Mockito.anyString())).thenReturn(jwt);
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/adminLogin");
            request.addFormHeader("adminUsername", adminUsername);
            request.addFormHeader("password", password);
            request.addFormHeader("username", username);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void adminLoginNotAdmin() {
        String adminUsername = "adminUsername";
        String password = "password";
        String username = "username";
        String jwt = "jwt";

        User adminUser = new User();
        adminUser.setAdmin(false);

        User user = new User();
        user.setUserSettings(new UserSettings());
        user.getUserSettings().setAllowAdminAccess(true);

        try {
            Mockito.when(AuthenticationService.authenticate(adminUsername, password)).thenReturn(adminUser);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString(), Mockito.anyString())).thenReturn(jwt);
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/adminLogin");
            request.addFormHeader("adminUsername", adminUsername);
            request.addFormHeader("password", password);
            request.addFormHeader("username", username);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals("User is not an admin", response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void adminLoginNotAllowedAdminAccess() {
        String adminUsername = "adminUsername";
        String password = "password";
        String username = "username";
        String jwt = "jwt";

        User adminUser = new User();
        adminUser.setAdmin(true);

        User user = new User();
        user.setUserSettings(new UserSettings());
        user.getUserSettings().setAllowAdminAccess(false);

        try {
            Mockito.when(AuthenticationService.authenticate(adminUsername, password)).thenReturn(adminUser);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            Mockito.when(AuthenticationService.getJWT(Mockito.anyString(), Mockito.anyString())).thenReturn(jwt);
            PowerMockito.doNothing().when(UserService.class, "successfulLogin", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/adminLogin");
            request.addFormHeader("adminUsername", adminUsername);
            request.addFormHeader("password", password);
            request.addFormHeader("username", username);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals("User revoked access", response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void resetPassword() {
        String resetToken = "resetToken";
        String newPassword = "newPassword";

        try {
            Mockito.when(AuthenticationService.resetPassword(resetToken, newPassword)).thenReturn("username");

            MockHttpRequest request = MockHttpRequest.post("/authentication/resetPassword");
            request.addFormHeader("resetToken", resetToken);
            request.addFormHeader("newPassword", newPassword);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void resetPasswordException() {
        String resetToken = "resetToken";
        String newPassword = "newPassword";

        try {
            Mockito.when(AuthenticationService.resetPassword(resetToken, newPassword)).thenThrow(new Exception(EXCEPTION_MESSAGE));

            MockHttpRequest request = MockHttpRequest.post("/authentication/resetPassword");
            request.addFormHeader("resetToken", resetToken);
            request.addFormHeader("newPassword", newPassword);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotUsername() {
        String email = "email";

        try {
            PowerMockito.doNothing().when(AuthenticationService.class, "forgotUsername", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/forgotUsername");
            request.addFormHeader("email", email);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotUsernameException() {
        String email = "email";

        try {
            PowerMockito.doThrow(new Exception(EXCEPTION_MESSAGE)).when(AuthenticationService.class, "forgotUsername", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/forgotUsername");
            request.addFormHeader("email", email);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotPassword() {
        String email = "email";

        try {
            PowerMockito.doNothing().when(AuthenticationService.class, "forgotPassword", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/forgotPassword");
            request.addFormHeader("email", email);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotPasswordException() {
        String email = "email";

        try {
            PowerMockito.doThrow(new Exception(EXCEPTION_MESSAGE)).when(AuthenticationService.class, "forgotPassword", Mockito.anyString());

            MockHttpRequest request = MockHttpRequest.post("/authentication/forgotPassword");
            request.addFormHeader("email", email);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void verifyEmail() {
        String verifyToken = "verifyToken";

        try {
            Mockito.when(AuthenticationService.verifyUserEmail(verifyToken)).thenReturn("username");

            MockHttpRequest request = MockHttpRequest.post("/authentication/verifyEmail?verifyToken=" + verifyToken);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void verifyEmailException() {
        String verifyToken = "verifyToken";

        try {
            Mockito.when(AuthenticationService.verifyUserEmail(verifyToken)).thenThrow(new Exception(EXCEPTION_MESSAGE));

            MockHttpRequest request = MockHttpRequest.post("/authentication/verifyEmail?verifyToken=" + verifyToken);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void unlockAccount() {
        String unlockToken = "unlockToken";

        try {
            Mockito.when(AuthenticationService.unlockAccount(unlockToken)).thenReturn("username");

            MockHttpRequest request = MockHttpRequest.post("/authentication/unlockAccount");
            request.addFormHeader("unlockToken", unlockToken);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void unlockAccountException() {
        String unlockToken = "unlockToken";

        try {
            Mockito.when(AuthenticationService.unlockAccount(unlockToken)).thenThrow(new Exception(EXCEPTION_MESSAGE));

            MockHttpRequest request = MockHttpRequest.post("/authentication/unlockAccount");
            request.addFormHeader("unlockToken", unlockToken);
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
            assertEquals(EXCEPTION_MESSAGE, response.getContentAsString());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void refresh() {
        String jwt = "jwt";

        try {
            Mockito.when(AuthenticationService.refreshJWT(Mockito.anyObject())).thenReturn(jwt);
            MockHttpRequest request = MockHttpRequest.post("/authentication/refresh");
            dispatcher.invoke(request, response);

            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
            String content = response.getContentAsString();
            Gson gson = new Gson();
            AuthenticationResponse authenticationResponse = gson.fromJson(content, AuthenticationResponse.class);
            assertEquals(jwt, authenticationResponse.getToken());
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }
}
