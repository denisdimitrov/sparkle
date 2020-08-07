import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { VenueEvent } from "types/VenueEvent";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import { Purchase } from "types/Purchase";
import "./PaymentModal.scss";
import PaymentForm from "./PaymentForm";
import PaymentConfirmation from "./PaymentConfirmation";
import { Venue } from "types/Venue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";

interface PropsType {
  show: boolean;
  onHide: () => void;
  selectedEvent: WithId<VenueEvent>;
  setEventPaidSuccessfully: (value: string | undefined) => void;
  eventPaidSuccessfully: string | undefined;
}

const PaymentModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  selectedEvent,
  setEventPaidSuccessfully,
  eventPaidSuccessfully,
}) => {
  useConnectUserPurchaseHistory();
  const { user } = useUser();
  const { purchaseHistory, purchaseHistoryRequestStatus, venue } = useSelector(
    (state) => ({
      purchaseHistory: state.firestore.ordered.userPurchaseHistory,
      purchaseHistoryRequestStatus:
        state.firestore.status.requested.userPurchaseHistory,
      venue: state.firestore.data.currentVenue,
    })
  ) as {
    purchaseHistory: Purchase[];
    purchaseHistoryRequestStatus: boolean;
    venue: Venue;
  };

  const [isPaymentProceeding, setIsPaymentProceeding] = useState(false);
  const [isCardBeingSaved, setIsCardBeingSaved] = useState(false);

  const hasUserBoughtTicket =
    hasUserBoughtTicketForEvent(purchaseHistory, selectedEvent.id) ||
    (user && isUserAMember(user.email, venue.config.memberEmails));

  const closePaymentModal = () => {
    if (!isPaymentProceeding && !isCardBeingSaved) {
      onHide();
    }
  };

  let modalContent;
  if (!purchaseHistoryRequestStatus) {
    modalContent = <>Loading...</>;
  } else if (eventPaidSuccessfully === selectedEvent.id) {
    modalContent = (
      <PaymentConfirmation startUtcSeconds={selectedEvent.start_utc_seconds} />
    );
  } else if (!hasUserBoughtTicket) {
    modalContent = (
      <PaymentForm
        setIsPaymentSuccess={() => setEventPaidSuccessfully(selectedEvent.id)}
        setIsPaymentProceeding={setIsPaymentProceeding}
        setIsCardBeingSaved={setIsCardBeingSaved}
        isPaymentProceeding={isPaymentProceeding}
        isCardBeingSaved={isCardBeingSaved}
        event={selectedEvent}
      />
    );
  } else {
    modalContent = <>Oops, an error occured</>;
  }

  return (
    <Modal show={show} onHide={closePaymentModal}>
      <div className="payment-modal-container">
        <div className="header">
          <div className="title event-title">{selectedEvent.name}</div>
        </div>
        {modalContent}
      </div>
    </Modal>
  );
};

export default PaymentModal;
