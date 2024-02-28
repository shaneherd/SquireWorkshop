package com.herd.squire.app;

import com.herd.squire.rest.*;
import com.herd.squire.utilities.AuthenticationFilter;
import com.herd.squire.utilities.CrossOriginResourceSharingFilter;
import com.herd.squire.utilities.RestExceptionHandler;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/")
public class SquireApplication extends Application {
    public SquireApplication() {
        SquireLogger.setup();
    }

    @Override
    public Set<Object> getSingletons() {
        final Set<Object> singletons = new HashSet<>();
        singletons.add(new CrossOriginResourceSharingFilter());
        singletons.add(new AuthenticationFilter());
        singletons.add(new RestExceptionHandler());
        singletons.add(new AuthenticationRest());
        singletons.add(new UserRest());
        singletons.add(new PowersRest());
        singletons.add(new AttributesRest());
        singletons.add(new CharacteristicsRest());
        singletons.add(new ItemsRest());
        singletons.add(new CreatureRest());
        singletons.add(new CampaignsRest());
        singletons.add(new EncountersRest());
        singletons.add(new MonsterRest());
        singletons.add(new RollRest());
        return singletons;
    }
}
