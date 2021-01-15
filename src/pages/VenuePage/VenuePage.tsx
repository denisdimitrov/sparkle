import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import { useFirestore } from "react-redux-firebase";

import { LOC_UPDATE_FREQ_MS } from "settings";

import { ValidStoreAsKeys } from "types/Firestore";
import { VenueTemplate } from "types/VenueTemplate";

import { getQueryParameters } from "utils/getQueryParameters";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import {
  currentEventSelector,
  currentVenueSelector,
  isCurrentEventRequestedSelector,
  isCurrentVenueRequestedSelector,
  isUserPurchaseHistoryRequestedSelector,
  shouldRetainAttendanceSelector,
  userPurchaseHistorySelector,
} from "utils/selectors";
import {
  canUserJoinTheEvent,
  getCurrentTimeInUnixEpochSeconds,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";
import {
  updateLocationData,
  useLocationUpdateEffect,
} from "utils/useLocationUpdateEffect";
import { venueEntranceUrl } from "utils/url";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useInterval } from "hooks/useInterval";
import { useMixpanel } from "hooks/useMixpanel";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useIsVenueUsersLoaded } from "hooks/users";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

import { updateUserProfile } from "pages/Account/helpers";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import TemplateWrapper from "./TemplateWrapper";

import { updateTheme } from "./helpers";

import "./VenuePage.scss";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { isCompleteProfile, updateProfileEnteredVenueIds } from "utils/profile";
import { isTruthy, notEmpty } from "utils/types";
import Login from "pages/Account/Login";
import { getAccessTokenKey } from "utils/localStorage";
import { AccessDeniedModal } from "components/atoms/AccessDeniedModal/AccessDeniedModal";
import { showZendeskWidget } from "utils/zendesk";

const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const firestore = useFirestore();
  const mixpanel = useMixpanel();

  const history = useHistory();
  const [currentTimestamp] = useState(Date.now() / 1000);
  const [unmounted, setUnmounted] = useState(false);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile } = useUser();

  const isVenueUsersLoaded = useIsVenueUsersLoaded();

  const venue = useSelector(currentVenueSelector);
  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);

  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  const userPurchaseHistory = useSelector(userPurchaseHistorySelector);
  const userPurchaseHistoryRequestStatus = useSelector(
    isUserPurchaseHistoryRequestedSelector
  );

  const retainAttendance = useSelector(shouldRetainAttendanceSelector);

  const venueName = venue?.name ?? "";
  const venueTemplate = venue?.template;

  const prevLocations = retainAttendance ? profile?.lastSeenIn ?? {} : {};

  const updateUserLocation = useCallback(() => {
    if (!user || !venueName || (venueName && prevLocations[venueName])) return;

    const updatedLastSeenIn = {
      ...prevLocations,
      [venueName]: getCurrentTimeInUnixEpochSeconds(),
    };

    updateUserProfile(user.uid, {
      lastSeenIn: updatedLastSeenIn,
      lastSeenAt: new Date().getTime(),
      room: venueName,
    });
  }, [prevLocations, user, venueName]);

  useInterval(() => {
    updateUserLocation();
  }, LOC_UPDATE_FREQ_MS);

  const event = currentEvent?.[0];

  venue && updateTheme(venue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

  const isUserVenueOwner = user && venue?.owners?.includes(user.uid);
  const isMember =
    user && venue && isUserAMember(user.email, venue.config?.memberEmails);

  // Camp and PartyMap needs to be able to modify this
  // Currently does not work with roome
  const location = venueName;
  useLocationUpdateEffect(user, venueName);

  const newLocation = {
    [location]: new Date().getTime(),
  };
  const isNewLocation = profile?.lastSeenIn
    ? !profile?.lastSeenIn[location]
    : false;

  const newLocations = {
    ...prevLocations,
    ...newLocation,
  };

  useEffect(() => {
    if (
      user &&
      location &&
      isNewLocation &&
      ((!unmounted && !retainAttendance) || retainAttendance) &&
      (!profile?.lastSeenIn || !profile?.lastSeenIn[location])
    ) {
      updateLocationData(
        user,
        location ? newLocations : prevLocations,
        profile?.lastSeenIn
      );
      setUnmounted(false);
    }
    if (
      user &&
      profile &&
      (profile.lastSeenIn === null || profile?.lastSeenIn === undefined)
    ) {
      updateLocationData(
        user,
        location ? newLocations : prevLocations,
        profile?.lastSeenIn
      );
    }
  }, [
    isNewLocation,
    location,
    newLocation,
    newLocations,
    prevLocations,
    profile,
    retainAttendance,
    unmounted,
    user,
  ]);

  useEffect(() => {
    const leaveRoomBeforeUnload = () => {
      if (user) {
        const locations = { ...prevLocations };
        delete locations[venueName];
        setUnmounted(true);
        updateLocationData(user, locations, undefined);
      }
    };
    window.addEventListener("beforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("beforeunload", leaveRoomBeforeUnload, false);
    };
  }, [prevLocations, user, venueName]);

  useEffect(() => {
    if (
      profile?.enteredVenueIds &&
      venue?.id &&
      profile?.enteredVenueIds.includes(venue?.id)
    )
      return;
    if (!venue || !user) return;
    updateProfileEnteredVenueIds(
      profile?.enteredVenueIds,
      user?.uid,
      venue?.id
    );
  }, [profile, user, venue]);

  const venueIdFromParams = getQueryParameters(window.location.search)
    ?.venueId as string;

  useConnectCurrentVenue();
  useConnectCurrentEvent();
  useConnectUserPurchaseHistory();
  useEffect(() => {
    firestore.get({
      collection: "venues",
      doc: venueId ? venueId : venueIdFromParams,
      storeAs: "currentVenue",
    });
  }, [firestore, venueId, venueIdFromParams]);

  // @debt refactor this + related code so as not to rely on using a shadowed 'storeAs' key
  //   this should be something like `storeAs: "currentUserPrivateChats"` or similar
  useFirestoreConnect(
    user?.uid
      ? {
          collection: "privatechats",
          doc: user.uid,
          subcollections: [{ collection: "chats" }],
          storeAs: "privatechats" as ValidStoreAsKeys, // @debt super hacky, but we're consciously subverting our helper protections
        }
      : undefined
  );

  useEffect(() => {
    if (user && profile && venueId && venueTemplate) {
      mixpanel.track("VenuePage loaded", {
        venueId,
        template: venueTemplate,
      });
    }
  }, [user, profile, venueId, venueTemplate, mixpanel]);

  // Need a token to access the venue
  useEffect(() => {
    if (!venue) return;

    const denyAccess = () => {
      localStorage.removeItem(getAccessTokenKey(venueId));
      setIsAccessDenied(true);
    };

    // @debt convert this so token is needed to get venue config
    if (notEmpty(venue.access)) {
      console.log("venue.access", venue.access);
      const token = localStorage.getItem(getAccessTokenKey(venueId));
      console.log("found token:", token);
      if (!token) {
        console.log("checking access");
        firebase
          .functions()
          .httpsCallable("access-checkAccess")({
            venueId,
            token,
          })
          .then((result) => {
            console.log(
              "access check result:",
              result,
              "isTruthy result.data:",
              isTruthy(result.data)
            );
            if (!isTruthy(result.data)) {
              firebase
                .auth()
                .signOut()
                .finally(() => {
                  denyAccess();
                });
            }
          });
      } else {
        firebase
          .auth()
          .signOut()
          .finally(() => {
            denyAccess();
          });
      }
    }
  }, [venue, venueId]);
  useEffect(() => {
    if (venue?.showZendesk) {
      showZendeskWidget();
    }
  }, [venue]);

  if (!user) {
    return <Login formType="initial" />;
  }

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (isAccessDenied) {
    return <AccessDeniedModal venueId={venueId} venueName={venue.name} />;
  }

  const hasEntrance = isTruthy(venue?.entrance);
  const hasEntered = profile?.enteredVenueIds?.includes(venueId);
  if (hasEntrance && !hasEntered) {
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (
    hasPaidEvents(venue.template) &&
    venue.hasPaidEvents &&
    !isUserVenueOwner
  ) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (
      !event ||
      !venue ||
      !userPurchaseHistoryRequestStatus ||
      !isVenueUsersLoaded
    ) {
      return <LoadingPage />;
    }

    if (
      (!isMember &&
        event.price > 0 &&
        userPurchaseHistoryRequestStatus &&
        !hasUserBoughtTicket) ||
      isEventFinished
    ) {
      return <>Forbidden</>;
    }

    if (!canUserJoinTheEvent(event)) {
      return (
        <CountDown
          startUtcSeconds={event.start_utc_seconds}
          textBeforeCountdown="Bar opens in"
        />
      );
    }
  }

  if (!user) {
    return <LoadingPage />;
  }

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  return <TemplateWrapper venue={venue} />;
};

export default VenuePage;
