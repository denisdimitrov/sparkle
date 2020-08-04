import firebase from "firebase/app";
import { UserInfo } from "firebase";
import _ from "lodash";
import { VenueEvent } from "types/VenueEvent";

export interface EventInput {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  price: number;
}

interface Question {
  name: string;
  text: string;
}

export interface AdvancedVenueInput {
  profileQuestions: Array<Question>;
}

export interface VenueInput extends AdvancedVenueInput {
  name: string;
  bannerImageFile: FileList;
  logoImageFile: FileList;
  tagline: string;
  longDescription: string;
  mapIconImageFile?: FileList;
}

type FirestoreVenueInput = Omit<
  VenueInput,
  "bannerImageFile" | "logoImageFile"
> & {
  bannerImageUrl: string;
  logoImageUrl: string;
};

export const createUrlSafeName = (name: string) => name.replace(/\W/g, "");

export const createVenue = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const logoFile = input.logoImageFile[0];
  const bannerFile = input.bannerImageFile[0];

  const urlVenueName = createUrlSafeName(input.name);

  // upload logo file
  const uploadLogoRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${logoFile.name}`
  );
  await uploadLogoRef.put(logoFile);

  // upload banner file
  const uploadBannerRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${bannerFile.name}`
  );
  await uploadBannerRef.put(bannerFile);

  const logoDownloadUrl: string = await uploadLogoRef.getDownloadURL();
  const bannerDownloadUrl: string = await uploadBannerRef.getDownloadURL();

  const firestoreVenueInput: FirestoreVenueInput = {
    ..._.omit(input, ["bannerImageFile", "logoImageFile"]),
    bannerImageUrl: bannerDownloadUrl,
    logoImageUrl: logoDownloadUrl,
  };

  return await firebase.functions().httpsCallable("venue-createVenue")(
    firestoreVenueInput
  );
};

export const createEvent = async (
  venueId: string,
  event: Omit<VenueEvent, "id">
) => {
  await firebase.firestore().collection(`venues/${venueId}/events`).add(event);
};
