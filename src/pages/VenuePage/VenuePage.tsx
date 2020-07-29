import React, { useState } from "react";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import JazzbarRouter from "components/venues/Jazzbar/JazzbarRouter";
import PartyMap from "components/venues/PartyMap";
import FriendShipPage from "pages/FriendShipPage";
import { User } from "types/User";
import { ChatContextWrapper } from "components/context/ChatContext";
import { updateTheme } from "./helpers";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useParams, useHistory } from "react-router-dom";
import { Purchase } from "types/Purchase";
import { VenueEvent } from "types/VenueEvent";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { canUserJoinTheEvent, ONE_MINUTE_IN_SECONDS } from "utils/time";
import CountDown from "components/molecules/CountDown";
import { useUser } from "hooks/useUser";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";

const VenuePage = () => {
  const { venueId } = useParams();
  const history = useHistory();
  const [currentTimestamp] = useState(Date.now() / 1000);

  const { user, profile } = useUser();
  const {
    venue,
    users,
    userPurchaseHistory,
    userPurchaseHistoryRequestStatus,
    event,
    eventRequestStatus,
    venueRequestStatus,
  } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    users: state.firestore.ordered.partygoers,
    event: state.firestore.data.currentEvent,
    eventRequestStatus: state.firestore.status.requested.currentEvent,
    userPurchaseHistory: state.firestore.ordered.userPurchaseHistory,
    userPurchaseHistoryRequestStatus:
      state.firestore.status.requested.userPurchaseHistory,
  })) as {
    venue: Venue;
    users: User[];
    userPurchaseHistory: Purchase[];
    userPurchaseHistoryRequestStatus: boolean;
    event: VenueEvent;
    eventRequestStatus: boolean;
    venueRequestStatus: boolean;
  };

  venue && updateTheme(venue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

  const venueName = venue && venue.name;
  useUpdateLocationEffect(user, venueName);

  useConnectPartyGoers();
  useConnectCurrentVenue();
  useConnectCurrentEvent();
  useConnectUserPurchaseHistory();

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (eventRequestStatus && !event) {
    return <>This event does not exist</>;
  }

  if (!event || !venue || !users || !userPurchaseHistoryRequestStatus) {
    return <>Loading...</>;
  }

  if (
    (event.price > 0 &&
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

  if (!(profile?.partyName && profile?.pictureUrl)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  let template;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzbarRouter />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
      template = <PartyMap />;
      break;
  }

  return <ChatContextWrapper>{template}</ChatContextWrapper>;
};

export default VenuePage;
