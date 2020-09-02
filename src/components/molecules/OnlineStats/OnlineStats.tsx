import React, { useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { venuePlayaPreviewUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";
import "./OnlineStats.scss";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faSearch } from "@fortawesome/free-solid-svg-icons";
import UserProfileModal from "components/organisms/UserProfileModal";
import VenueInfoEvents from "../VenueInfoEvents/VenueInfoEvents";
import { OnlineStatsData } from "types/OnlineStatsData";
import { getRandomInt } from "../../../utils/getRandomInt";
import { peopleAttending } from "utils/venue";
import { Venue } from "types/Venue";

const dummy: any = {
  result: {
    onlineUsers: [
      {
        pictureUrl:
          "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FODSv7R0qphVpRr8IQsTaFiAvWl72%2F87784935_10158648835648115_6032891701696135168_n.jpg?alt=media&token=c4586db8-f15f-438a-ab92-b2378be64cd5",
        video: {},
        tenPrinciples: true,
        partyName: "Chris2",
        termsAndConditions: true,
        lastSeenAt: 1598961761.549,
        lastSeenIn: "Playa",
        room: "Playa",
        codes_used: [
          "k58it0pjao",
          "k58it0pjao",
          "k58it0pjao",
          "k58it0pjao",
          "k58it0pjao",
        ],
        commonDecency: true,
        id: "ODSv7R0qphVpRr8IQsTaFiAvWl72",
      },
      {
        partyName: "Denis Dimitrov",
        lastSeenIn: "Playa",
        pictureUrl:
          "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FWofNKgTDOidLM8SrlYG1euQZ3mG3%2FScreenshot_116.png?alt=media&token=7d023208-df52-4d3d-8a0e-2d9cdebc0a91",
        lastSeenAt: 1598962192.797,
        room: "Playa",
        date_of_birth: "1994-03-02",
        codes_used: ["qpvomj2s84"],
        id: "WofNKgTDOidLM8SrlYG1euQZ3mG3",
      },
      {
        lastSeenAt: 1598963505.729,
        partyName: "Playa Jesus",
        room: "Playa",
        codes_used: ["t9k3dcbnyj"],
        pictureUrl:
          "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Fs0L869wzI2bzzH95Hm7Ck7XbJrw1%2FIMG_5003.jpeg?alt=media&token=536baa2d-ddf6-4541-86cf-798e8f511d39",
        lastSeenIn: "Playa",
        date_of_birth: "1985-06-28",
        id: "s0L869wzI2bzzH95Hm7Ck7XbJrw1",
      },
      {
        codes_used: ["qpvomj2s84", "qpvomj2s84", "qpvomj2s84", "qpvomj2s84"],
        partyName: "Denis Dimitrov",
        room: "Playa",
        lastSeenIn: "Playa",
        lastSeenAt: 1598963708.301,
        date_of_birth: "1994-12-12",
        pictureUrl:
          "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FoVTpByXjniNWTbG7rClRzv6iMB53%2FScreenshot_116.png?alt=media&token=0aae1c0e-930c-4312-aed0-8a29deb7170d",
        id: "oVTpByXjniNWTbG7rClRzv6iMB53",
      },
      {
        pictureUrl:
          "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FjI7GJSBgYcTSztgzjDmGXgPSxtY2%2F401965c78ca6434e975a83864ce05822.jpg?alt=media&token=f695180d-8ffc-4903-98a2-0b0ca6c447ba",
        lastSeenIn: "Playa",
        partyName: "Dimo Bachev",
        date_of_birth: "1977-02-10",
        lastSeenAt: 1598963747.36,
        codes_used: ["rarpb1wns7"],
        room: "Playa",
        id: "jI7GJSBgYcTSztgzjDmGXgPSxtY2",
      },
    ],
    openVenues: [
      {
        venue: {
          code_of_conduct_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          config: {
            landingPageConfig: {
              subtitle: "Lofi Hip Hop Beatsdww",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1artpiece%2Fchat-icon.png?alt=media&token=b79e8df7-c9c4-4a8d-a774-2d037e95dab4",
              description:
                "Thank you for listening, I hope you will have a good time here :)\n\n🎼 Listen to the playlist on Spotify, Apple music and more\n→ https://bit.ly/chilledcow-playlists\n\n💬 Join the Discord server \n→ https://bit.ly/chilledcow-discord\n\n👕 Check out the ChilledCow merch\n→ https://bit.ly/chilledcow-merch\n\n🌎 Follow ChilledCow everywhere\n→ https://bit.ly/chilledcow-instagram\n→ https://bit.ly/chilledcow-facebook\n→ https://bit.ly/chilledcow-twitter\n\n🎧 Subscribe to my 2nd channel DreamyCow\n→ https://bit.ly/dreamy-cow\n\n💤 Listen to the sleepy radio\n→ http://bit.ly/sleepy-radio\n\n📌Update \n- 07/08/2020 New music added\n\n🎨 Illustration & Animation by Juan Pablo Machado\n→ https://bit.ly/Machadofb\n→ http://jpmachado.art\n\n📝 Submissions\n→ https://bit.ly/chilledcow-submissions",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1artpiece%2F0.25909582058046343-lofihiphop.jpg?alt=media&token=f4981e9a-5fc9-4256-a358-c4f0d54c9a62",
            },
          },
          presentation: [],
          owners: ["nvUfa8b4PFUr6rhJ7EbAXP7E5rf2"],
          profileQuestions: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1artpiece%2F0.574413572580398-lofihiphop.jpg?alt=media&token=0fcab899-90da-4fbf-97b6-6cddcf7ba13f",
          name: "1ARTPIECE",
          template: "artpiece",
          embedIframeUrl: "theguardian.com/uk",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1artpiece%2Fpickspace-thumbnail_artcar.png?alt=media&token=297e2984-289b-4c76-9e79-a03b38f7a2d9",
          },
          quotations: [],
          placement: {
            state: "SELF_PLACED",
            y: 2617.0542635658917,
            x: 1147.2868217054263,
          },
          profile_questions: [],
          id: "1artpiece",
        },
        currentEvents: [],
      },
      {
        venue: {
          placement: {
            state: "SELF_PLACED",
            y: 322.98136645962734,
            x: 272.7272727272727,
          },
          theme: {
            primaryColor: "#bc271a",
          },
          profile_questions: [],
          rooms: [
            {
              width_percent: 36.31782945736434,
              url: "skysports.com/",
              title: "rooom11",
              y_percent: 26.184323858742463,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Frooom10148097192313972%2Flofihiphop.jpg?alt=media&token=23ae616b-0770-4730-9858-9e94dce6a0cd",
              height_percent: 22.915590008613265,
              about: "room room room",
              subtitle: "ROOM 1",
              x_percent: 16.589147286821706,
            },
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Froom205186608886362252%2FDOG2.jpg?alt=media&token=115466e7-57d7-4222-8e60-189989eb1ea5",
              x_percent: 42.170542635658904,
              height_percent: 47.725212809106935,
              title: "room2",
              url:
                "https://news.google.com/topstories?edchanged=1&hl=en-GB&gl=GB&ceid=GB:en",
              subtitle: "ROOM 2",
              y_percent: 53.07023725628377,
              about: "room room",
              width_percent: 17.877478485214787,
            },
            {
              height_percent: 11.620118955262477,
              title: "rgrgrgr",
              about: "ttrgrgrgrgrg",
              y_percent: 49.76274371623209,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Frgrgrgr0502785945998159%2FScreenshot%202020-08-17%20at%2014.22.40.png?alt=media&token=f585046f-41d3-4138-8cf1-20bb6c8ed20a",
              subtitle: "btbtbtbtb",
              x_percent: 27.286821705426355,
              url: "https://www.youtube.com/",
              width_percent: 8.568657874321179,
            },
          ],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2F0.585237266561196-DOG1.jpg?alt=media&token=89b61b93-4cc4-41c7-a6de-fed9cb340a76",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Fvenue-header-kansas.jpg?alt=media&token=4a2d5fb9-dc80-4bb3-a420-885a8bbd31a2",
          },
          profileQuestions: [],
          config: {
            landingPageConfig: {
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Fvenue-camp.jpg?alt=media&token=de125b14-d4c4-4b00-af14-9fce828c3f48",
              checkList: [],
              subtitle: "tagline test",
              description:
                "efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe  efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe  efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe efefefe ",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F1themecamp%2Fsplash-feature-img-1.png?alt=media&token=a7285ce7-9075-4f3f-ad9f-3ec5962f1966",
            },
          },
          template: "themecamp",
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FDOME2.png?alt=media&token=b80bf4be-751c-4826-af15-6ac4f3957ce2",
          name: "1THEMECAMP",
          code_of_conduct_questions: [],
          presentation: [],
          owners: ["nvUfa8b4PFUr6rhJ7EbAXP7E5rf2"],
          quotations: [],
          id: "1themecamp",
        },
        currentEvents: [],
      },
      {
        venue: {
          placement: {
            x: 1243.6018957345973,
            y: 3177.2511848341233,
            state: " ",
          },
          embedIframeUrl: "dfasdf.com",
          code_of_conduct_questions: [],
          presentation: [],
          profile_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          template: "artpiece",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fartpiece2%2Fmaxbull.jpg?alt=media&token=ee6e52a4-6da9-4b23-81c5-b74ea71b9c18",
          },
          quotations: [],
          config: {
            landingPageConfig: {
              subtitle: "fasdf",
              checkList: [],
              description: "dfasdf",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fartpiece2%2Fcat.jpg?alt=media&token=b0becd59-cdf2-4794-9ef3-4a709914e95c",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fartpiece2%2Fcat.jpg?alt=media&token=b0becd59-cdf2-4794-9ef3-4a709914e95c",
            },
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SpaceToilet_1.png?alt=media&token=7e5422e0-14a5-46ee-a0fb-919d6f2687fd",
          profileQuestions: [],
          owners: ["t4ycJQQbb5fsi92P2EYigYuWqWt1"],
          name: "artpiece2",
          id: "artpiece2",
        },
        currentEvents: [],
      },
      {
        venue: {
          presentation: [],
          name: "3ARTPIECE",
          code_of_conduct_questions: [],
          placement: {
            state: "ADMIN_PLACED",
            x: 1660.7700312174818,
            y: 1377.7315296566078,
          },
          embedIframeUrl: "https://vimeo.com/444369368",
          owners: ["nvUfa8b4PFUr6rhJ7EbAXP7E5rf2"],
          quotations: [],
          theme: {
            primaryColor: "#bc271a",
          },
          profileQuestions: [],
          template: "artpiece",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F3artpiece%2F0.9630850864643403-Screenshot%202020-08-17%20at%2014.22.40.png?alt=media&token=b92f6d20-28ec-4f4d-b7c4-04de5898c5cb",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_SmallTent_Single_2.png?alt=media&token=98908387-21fd-4521-96a3-33bf64a59937",
          config: {
            landingPageConfig: {
              description: "fecerfe",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F3artpiece%2F0.6268031765315847-Screenshot%202020-08-17%20at%2015.31.27.png?alt=media&token=7c3eeb65-89dd-4b45-96ac-f1cff205d993",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2F3artpiece%2F0.6268031765315847-Screenshot%202020-08-17%20at%2015.31.27.png?alt=media&token=7c3eeb65-89dd-4b45-96ac-f1cff205d993",
              subtitle: "eede",
              checkList: [],
            },
          },
          profile_questions: [],
          id: "3artpiece",
        },
        currentEvents: [],
      },
      {
        venue: {
          profileQuestions: [],
          rooms: [],
          name: "Camp",
          profile_questions: [],
          quotations: [],
          template: "themecamp",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fcamp%2Fcat.jpg?alt=media&token=a7798a6c-c61c-4e94-82a2-c32255a370f3",
          },
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fcamp%2Fcat.jpg?alt=media&token=8f1cd648-4bf5-45c1-8733-1bbb7c60b244",
              description: "Descritption",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fcamp%2Fcat.jpg?alt=media&token=8f1cd648-4bf5-45c1-8733-1bbb7c60b244",
              subtitle: "Tagline",
            },
          },
          presentation: [],
          code_of_conduct_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          owners: ["97GryUzgTXPL9AykD2evyrSHJoC3"],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_1.png?alt=media&token=1bdb0a90-1739-4bbe-8f37-db22735e4a5d",
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fcamp%2Fcat.jpg?alt=media&token=3552a2b8-0ee4-444b-a0c7-a39569e8585f",
          id: "camp",
        },
        currentEvents: [],
      },
      {
        venue: {
          name: "Camp Co-reality",
          host: {
            icon: "/collective-icon.png",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SmallTent_Single_1.png?alt=media&token=e1b1fc2c-dccc-4626-b567-ae59d1c15be8",
          map_url:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSPA_050820_Camp_Co_Reality_Blank_120820_1345.png?alt=media&token=4d55eb5b-e0ee-4477-871b-8c09ceb013c3",
          placement: {
            x: 1800,
            y: 1800,
            state: "placed",
          },
          rooms: [
            {
              width_percent: 20,
              subtitle: "Environmentally friendly unhosted space",
              x_percent: 65,
              about:
                "A space for you to meet people and encounter endless possibility",
              title: "The Eco-loos",
              url: "https://zoom.us/j/4157588161",
              height_percent: 20,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_ECOLOOS.png?alt=media&token=65bbc735-bb2b-4cec-b31c-20d091b62e0a",
              y_percent: 32,
            },
            {
              about: "",
              y_percent: 37,
              height_percent: 20,
              url: "https://zoom.us/j/4157588161",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_KRAB.png?alt=media&token=28ee60a7-d5b8-4ef1-8d8f-88a399a699f6",
              width_percent: 20,
              title: "Krab",
              subtitle: "",
              x_percent: 15,
            },
            {
              about: "",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_UFO2.png?alt=media&token=7efee2aa-cc2c-46ce-bf5e-b70e25fad32f",
              width_percent: 20,
              subtitle: "",
              url: "https://zoom.us/j/4157588161",
              height_percent: 20,
              title: "",
              x_percent: 3,
              y_percent: 2,
            },
            {
              about: "",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FCamp_CoReality_logo.png?alt=media&token=042f213c-eaf5-43e5-b388-04f5b4b00391",
              y_percent: 2,
              subtitle: "",
              height_percent: 38,
              title: "",
              x_percent: 33,
              width_percent: 38,
              url: "https://zoom.us/j/4157588161",
            },
            {
              height_percent: 37,
              about: "",
              width_percent: 37,
              url: "https://zoom.us/j/4157588161",
              x_percent: 34,
              title: "",
              subtitle: "",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR.png?alt=media&token=8e8379c9-9625-4c6b-932d-fd7cf2435872",
              y_percent: 35,
            },
            {
              x_percent: 5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_cuddle.png?alt=media&token=951a7786-2259-43e8-8edf-03a80c4382e6",
              width_percent: 25,
              height_percent: 25,
              y_percent: 60,
              subtitle: "",
              title: "",
              about: "",
              url: "https://zoom.us/j/4157588161",
            },
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_KITCHEN.png?alt=media&token=e6d2d8ad-6708-49d3-8f33-1833aaa1fa01",
              x_percent: 75,
              about: "",
              url: "https://zoom.us/j/4157588161",
              title: "",
              subtitle: "",
              height_percent: 20,
              y_percent: 43,
              width_percent: 20,
            },
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSparkle_CAMP-CR_MISINFO.png?alt=media&token=316ecd31-0361-4c19-94ae-804d46c43207",
              subtitle: "",
              x_percent: 58,
              about: "",
              height_percent: 19,
              title: "",
              y_percent: 65,
              width_percent: 19,
              url: "https://zoom.us/j/4157588161",
            },
          ],
          owners: ["tpl7htc3ceOgWI5J4xdLTNOfehh1"],
          description: {
            name: "Welcome to Camp Co-reality.",
          },
          profile_questions: [],
          template: "themecamp",
          config: {
            theme: {
              primaryColor: "orange",
            },
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FYFLe3gR6LnPwn6sCWqgys1aXbDG2%2Fimages%2FSPA_050820_Camp_Co_Reality_Blank_120820_1345.png?alt=media&token=4d55eb5b-e0ee-4477-871b-8c09ceb013c3",
              subtitle:
                "Our camp is an example of what's possible in the SparkleVerse.",
            },
          },
          code_of_conduct_questions: [],
          id: "camp-co-reality",
        },
        currentEvents: [],
      },
      {
        venue: {
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SmallTent_Single_2.png?alt=media&token=e8ea4326-9eda-4e3e-b863-45da0756101d",
          quotations: [],
          theme: {
            primaryColor: "#bc271a",
          },
          code_of_conduct_questions: [],
          name: "artpiecemax",
          profile_questions: [],
          template: "artpiece",
          config: {
            landingPageConfig: {
              checkList: [],
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fartpiecemax%2Fcat.jpg?alt=media&token=2b79f856-fdea-4775-bd27-39b6de1607f1",
              description: "dfadsfas",
              subtitle: "adfsdf",
            },
          },
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fartpiecemax%2Fmaxbull.jpg?alt=media&token=65f060ee-f7fa-4068-8a68-f4a59be2e9e9",
          },
          presentation: [],
          owners: ["t4ycJQQbb5fsi92P2EYigYuWqWt1"],
          id: "artpiecemax",
        },
        currentEvents: [],
      },
      {
        venue: {
          name: "apmax",
          quotations: [],
          embedIframeUrl: "hello.com",
          theme: {
            primaryColor: "#bc271a",
          },
          owners: ["t4ycJQQbb5fsi92P2EYigYuWqWt1"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fapmax%2Fmaxbull.jpg?alt=media&token=a8d5f3a5-4131-4684-a130-85fb28204fe6",
          },
          profile_questions: [],
          profileQuestions: [],
          code_of_conduct_questions: [],
          template: "artpiece",
          presentation: [],
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fapmax%2Fcat.jpg?alt=media&token=bbf6527e-d54c-41b8-b3b4-22663d1c6d81",
              description: "dsfasdf",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fapmax%2Fcat.jpg?alt=media&token=bbf6527e-d54c-41b8-b3b4-22663d1c6d81",
              subtitle: "dfasdf",
            },
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SmallTent_Single_2.png?alt=media&token=e8ea4326-9eda-4e3e-b863-45da0756101d",
          id: "apmax",
        },
        currentEvents: [],
      },
      {
        venue: {
          placement: {
            state: "SELF_PLACED",
            x: 1980,
            y: 1980,
          },
          owners: ["nvUfa8b4PFUr6rhJ7EbAXP7E5rf2"],
          template: "themecamp",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2Fcamptest%2F0.6639634405702479-Screenshot%202020-08-19%20at%2016.18.43.png?alt=media&token=d08ddb0e-6d82-42e4-9ec5-dd9bb54fbfe9",
          },
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_2.png?alt=media&token=ab61f5e0-8be1-4f85-b6b8-f2abb50858b7",
          rooms: [],
          profile_questions: [],
          quotations: [],
          theme: {
            primaryColor: "#bc271a",
          },
          config: {
            landingPageConfig: {
              subtitle: "qqqqq",
              checkList: [],
              description: "wwwwww",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FnvUfa8b4PFUr6rhJ7EbAXP7E5rf2%2Fvenues%2Fcamptest%2F0.406479649154327-Screenshot%202020-08-19%20at%2016.18.50.png?alt=media&token=d5251397-b721-4781-a345-b6c2b928e6ee",
            },
          },
          presentation: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_Toilet_1.png?alt=media&token=6b0281b2-a202-4d8c-a0f3-2b3307a00f0b",
          name: "camptest",
          code_of_conduct_questions: [],
          id: "camptest",
        },
        currentEvents: [],
      },
      {
        venue: {
          quotations: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          config: {
            landingPageConfig: {
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fedsgloriousthemecamp%2FZ-%20SPA_050820_Camp_Background_1.png?alt=media&token=3491460f-b6b4-4905-8b49-4fd386f06908",
              subtitle: "So fun",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fedsgloriousthemecamp%2FZ-%20SPA_050820_Camp_Background_1.png?alt=media&token=3491460f-b6b4-4905-8b49-4fd386f06908",
              description: "So so so fun sghgshs",
            },
          },
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fedsgloriousthemecamp%2Fderrick-treadwell-m01bajOe8E0-unsplash.jpg?alt=media&token=de06ab15-138e-4119-ae5c-20d8ffa29737",
          },
          profile_questions: [],
          placement: {
            y: 2937.3625388558344,
            x: 563.7362448309177,
          },
          template: "themecamp",
          profileQuestions: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_SmallTent_Single_2.png?alt=media&token=98908387-21fd-4521-96a3-33bf64a59937",
          theme: {
            primaryColor: "#bc271a",
          },
          code_of_conduct_questions: [],
          presentation: [],
          rooms: [],
          name: "Ed's Glorious Theme Camp",
          id: "edsgloriousthemecamp",
        },
        currentEvents: [],
      },
      {
        venue: {
          embedIframeUrl: "https://www.youtube.com/watch?v=qVwvbD74wFQ",
          owners: ["vJRFcjfzZgXkUg3YD5LaDzGIciX2"],
          template: "artpiece",
          config: {
            landingPageConfig: {
              description: "asas",
              subtitle: "Artster",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fartyfarty%2FScreenshot%202020-08-11%20at%2008.48.08.png?alt=media&token=bc28f1f5-abd3-4da9-b23a-815a93630b33",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fartyfarty%2FScreenshot%202020-08-11%20at%2008.48.08.png?alt=media&token=bc28f1f5-abd3-4da9-b23a-815a93630b33",
            },
          },
          presentation: [],
          name: "Arty farty",
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fartyfarty%2Fmintondemand.jpeg?alt=media&token=b9d69e9d-0706-4dc6-bafc-a6b42a8e2081",
          theme: {
            primaryColor: "#bc271a",
          },
          code_of_conduct_questions: [],
          quotations: [],
          profileQuestions: [],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fartyfarty%2FScreenshot%202020-07-27%20at%2009.15.33.png?alt=media&token=726ce9c7-625d-4f53-9ed2-ee1900c36679",
          },
          placement: {
            y: 1699.4350282485875,
            x: 3435.0282485875705,
          },
          profile_questions: [],
          id: "artyfarty",
        },
        currentEvents: [],
      },
      {
        venue: {
          profile_questions: [],
          quotations: [],
          presentation: [],
          theme: {
            primaryColor: "#bc271a",
          },
          embedIframeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          code_of_conduct_questions: [],
          profileQuestions: [],
          placement: {
            state: "SELF_PLACED",
            y: 365.8914728682171,
            x: 2710.077519379845,
          },
          owners: ["vJRFcjfzZgXkUg3YD5LaDzGIciX2"],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FDOME2.png?alt=media&token=b80bf4be-751c-4826-af15-6ac4f3957ce2",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fgfg%2F0.032967899415915936-Screenshot%202020-08-17%20at%2014.49.03.png?alt=media&token=3d1930e4-2cd0-41d8-8f6a-9576109a2cab",
          },
          name: "gfg",
          template: "artpiece",
          config: {
            landingPageConfig: {
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fgfg%2F0.40079499616108794-Screenshot%202020-08-17%20at%2014.48.52.png?alt=media&token=8a4efb86-78b0-4fde-bfea-b315946f4003",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fgfg%2F0.40079499616108794-Screenshot%202020-08-17%20at%2014.48.52.png?alt=media&token=8a4efb86-78b0-4fde-bfea-b315946f4003",
              checkList: [],
              subtitle: "fgf",
              description: "fgfg",
            },
          },
          id: "gfg",
        },
        currentEvents: [],
      },
      {
        venue: {
          map_viewbox: "0 0 4000 2000",
          owners: ["97GryUzgTXPL9AykD2evyrSHJoC3"],
          description: {
            text: "My Amaaazing Party",
          },
          placement: {
            y: 2000,
            x: 2000,
          },
          name: "MPartyMap",
          code_of_conduct: [""],
          map_url: "/maps/EndOfTheUniverse.jpg",
          host: {
            icon: "/room-images/CRC_EndOfTheUniverse_Logo.jpg",
            name: "M",
          },
          template: "partymap",
          profile_questions: [""],
          id: "MPartyMap",
        },
        currentEvents: [
          {
            start_utc_seconds: 1597183200,
            sub_venues: [
              {
                id: "MSub2",
                schedule: [
                  {
                    start_minute: 0,
                    descriptions: [
                      "List of",
                      "Descriptions...",
                      "Do we",
                      "Keep?",
                    ],
                    description: "A Great Description for a Great event",
                    name: "A great first event",
                    duration_minutes: 86400,
                  },
                ],
              },
            ],
            duration_minutes: 86400,
            description: "Party Today!",
            name: "Today!",
            subvenues: {
              id: "MSub2",
              schedule: [
                {
                  descriptions: [
                    "List of",
                    "Descriptions...",
                    "Do we",
                    "Keep?",
                  ],
                  duration_minutes: 86400,
                  start_utc_seconds: 1597096800,
                  name: "A great first event",
                  description: "A Great Description for a Great Event",
                },
              ],
            },
          },
        ],
      },
      {
        venue: {
          config: {
            landingPageConfig: {
              subtitle: "shishsi",
              description: "soshohsohhs",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspoagagag%2FScreenshot%202020-08-13%20at%2009.06.56.png?alt=media&token=a738d60b-7019-4bd8-ae46-9b4d33fa2cf6",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspoagagag%2FScreenshot%202020-08-17%20at%2009.43.46.png?alt=media&token=fa3adf83-2e27-4f64-9f90-8b87dc705002",
              checkList: [],
            },
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_Toilet_1.png?alt=media&token=db458b15-5126-4d53-952e-90c1c2966ee6",
          placement: {
            x: 503.9500911606351,
            y: 2404.989543954714,
          },
          template: "artpiece",
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          code_of_conduct_questions: [],
          embedIframeUrl: "https://youtu.be/rC4Zu0hT9h8",
          quotations: [],
          profile_questions: [],
          presentation: [],
          profileQuestions: [],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspoagagag%2FScreenshot%202020-08-13%20at%2009.06.56.png?alt=media&token=85581c28-2128-47e8-a71f-384c021eecc1",
          },
          theme: {
            primaryColor: "#bc271a",
          },
          name: "spoagagag",
          id: "spoagagag",
        },
        currentEvents: [],
      },
      {
        venue: {
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2FSPA_050820_Camp_Co_Reality_190820_1955.png?alt=media&token=df0e4cf6-7a4b-4dbb-8010-5485c57c5391",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2FSPA_050820_Camp_Co_Reality_190820_1955.png?alt=media&token=df0e4cf6-7a4b-4dbb-8010-5485c57c5391",
              subtitle: "It's going to be sweet!",
              checkList: [],
              description:
                "SGHSHHSHS I am editing. But I fear this acti of editing will delete my rooms. ",
            },
          },
          rooms: [
            {
              x_percent: 63.06169078446306,
              about: "sghsghghs",
              width_percent: 23.27528429235496,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2Fsghsghgsh0647568935893206%2FScreenshot%202020-08-11%20at%2018.22.29.png?alt=media&token=f020dfbe-2248-4a81-831f-e0226d8542f9",
              subtitle: "sghsgh",
              url: "zoom.us/sghjgshgs",
              title: "sghsghgsh",
              y_percent: 31.683168316831683,
              height_percent: 39.09064089432816,
            },
            {
              y_percent: 31.877394636015325,
              url: "zoom.us/ghgshgsh",
              x_percent: 9.79310344827586,
              subtitle: "sghsgh",
              title: "goose",
              width_percent: 36.17241379310344,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2Fgoose0007707776023316848%2FScreenshot%202020-08-09%20at%2001.06.34.png?alt=media&token=11f48c35-28fc-46d4-beb2-01bab4a268cd",
              about: "shjhsjhjs",
              height_percent: 39.57471264367816,
            },
            {
              y_percent: 65.71647509578544,
              height_percent: 27.314176245210728,
              width_percent: 20.17241379310345,
              subtitle: "Yum",
              x_percent: 40.96551724137931,
              about: "Fortune favours the brave",
              title: "Goose",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2Fgoose02008395435822632%2FScreenshot%202020-08-21%20at%2002.02.07.png?alt=media&token=fc195d9b-bcf0-420c-8e1a-0b593733b39f",
              url: "theguardian.com",
            },
          ],
          name: "SPAM",
          profileQuestions: [],
          profile_questions: [],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspam%2Fbananas.jpg?alt=media&token=19eeeaf7-1752-4267-9251-526605ba8c23",
          },
          template: "themecamp",
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_2.png?alt=media&token=ab61f5e0-8be1-4f85-b6b8-f2abb50858b7",
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          theme: {
            primaryColor: "#bc271a",
          },
          placement: {
            y: 1804.0511959531648,
            x: 294.949494949495,
          },
          quotations: [],
          presentation: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_EggHut_1.png?alt=media&token=06908499-4612-4221-bee8-b9e7fa3efe1f",
          code_of_conduct_questions: [],
          id: "spam",
        },
        currentEvents: [],
      },
      {
        venue: {
          placement: {
            state: "SELF_PLACED",
            y: 242.42424242424244,
            x: 2145.4545454545455,
          },
          code_of_conduct_questions: [],
          presentation: [],
          template: "artpiece",
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_LargeTent_Single_1.png?alt=media&token=71426014-fd37-4b4f-b44e-991b5b5abe03",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FoHGE4DC5hjc0LeJRDDTIHpZSpcf1%2Fvenues%2Fq%2F0.6240308433478676-ME.jpeg?alt=media&token=64058681-437d-4998-94a9-8f40ab1b65b8",
          },
          theme: {
            primaryColor: "#bc271a",
          },
          owners: ["oHGE4DC5hjc0LeJRDDTIHpZSpcf1"],
          profile_questions: [],
          config: {
            landingPageConfig: {
              subtitle: "qqqq",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FoHGE4DC5hjc0LeJRDDTIHpZSpcf1%2Fvenues%2Fq%2F0.06828011882279017-bayta.jpg?alt=media&token=09d60ec3-8ed4-4bfd-86eb-4c1250a57fea",
              description: "q",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FoHGE4DC5hjc0LeJRDDTIHpZSpcf1%2Fvenues%2Fq%2F0.06828011882279017-bayta.jpg?alt=media&token=09d60ec3-8ed4-4bfd-86eb-4c1250a57fea",
              checkList: [],
            },
          },
          embedIframeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          name: "q",
          quotations: [],
          profileQuestions: [],
          id: "q",
        },
        currentEvents: [],
      },
      {
        venue: {
          quotations: [],
          code_of_conduct_questions: [],
          profile_questions: [],
          profileQuestions: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_EggHut_1.png?alt=media&token=06908499-4612-4221-bee8-b9e7fa3efe1f",
          placement: {
            y: 1830.8440354970237,
            x: 286.8686868686869,
          },
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fgoosecamp1%2FSPA_050820_Camp_Co_Reality_190820_1955.png?alt=media&token=02649d95-bdad-42d4-8c51-f4ea980f9aed",
          },
          config: {
            landingPageConfig: {
              subtitle: "Goose",
              description: "Geese",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fgoosecamp1%2FArtboard%2030%20copy%206-100.jpg?alt=media&token=ea6c1868-d6f2-409f-b93f-f17d410951d2",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fgoosecamp1%2FArtboard%2030%20copy%206-100.jpg?alt=media&token=ea6c1868-d6f2-409f-b93f-f17d410951d2",
            },
          },
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_2.png?alt=media&token=ab61f5e0-8be1-4f85-b6b8-f2abb50858b7",
          theme: {
            primaryColor: "#bc271a",
          },
          template: "themecamp",
          name: "GooseCamp1",
          presentation: [],
          rooms: [],
          id: "goosecamp1",
        },
        currentEvents: [],
      },
      {
        venue: {
          template: "themecamp",
          presentation: [],
          profile_questions: [],
          quotations: [],
          rooms: [
            {
              y_percent: 47.5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2Fr07017279809585191%2FScreenshot%202020-08-17%20at%2014.49.03.png?alt=media&token=3f95a271-2988-4bed-9282-7cdee313e5a6",
              width_percent: 5,
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              subtitle: "r",
              x_percent: 47.5,
              about: "r",
              height_percent: 5,
              title: "r",
            },
            {
              y_percent: 14.657210401891252,
              about: "r",
              subtitle: "r",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              width_percent: 5,
              title: "t",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2Ft049118861169062744%2FAdmiral.jpg?alt=media&token=8fa4902a-d3be-4631-89a1-9c8d7e9f79d6",
              x_percent: 8.333333333333334,
              height_percent: 5,
            },
            {
              x_percent: 24.88888888888889,
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              y_percent: 65.83924349881796,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2Fggg03259641666132578%2FScreenshot%202020-08-10%20at%2011.18.21.png?alt=media&token=44fbfc89-0ce6-4e95-98d4-36b34980e2e3",
              subtitle: "g",
              height_percent: 5,
              about: "g",
              title: "ggg",
              width_percent: 5,
            },
            {
              width_percent: 5,
              y_percent: 47.5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2F1045889152151947%2Fplayalevel.jpeg?alt=media&token=47d87da3-59fd-480d-93da-65582163e3ef",
              height_percent: 5,
              url: "https://www.youtube.com/watch?v=qVwvbD74wFQ",
              x_percent: 47.5,
              about: "1",
              title: "1",
              subtitle: "1",
            },
          ],
          name: "campy",
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2F0.5213448188475163-Screenshot%202020-08-11%20at%2008.48.08.png?alt=media&token=f2bb4270-de89-4e68-a90b-3ffd82e459a2",
              checkList: [],
              description: "campy",
              subtitle: "campy",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2F0.5213448188475163-Screenshot%202020-08-11%20at%2008.48.08.png?alt=media&token=f2bb4270-de89-4e68-a90b-3ffd82e459a2",
            },
          },
          profileQuestions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          owners: ["vJRFcjfzZgXkUg3YD5LaDzGIciX2"],
          code_of_conduct_questions: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_SpaceToilet_1.png?alt=media&token=7d8eedc2-15c0-4025-9d01-1d429a60018f",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FvJRFcjfzZgXkUg3YD5LaDzGIciX2%2Fvenues%2Fcampy%2F0.752840329034421-Screenshot%202020-08-17%20at%2014.48.52.png?alt=media&token=97df6260-aff4-4e28-b698-676d05e5444f",
          },
          placement: {
            x: 2715.5555555555557,
            y: 934.3434343434343,
          },
          id: "campy",
        },
        currentEvents: [],
      },
      {
        venue: {
          placement: {
            x: 244.01913875598086,
            state: "SELF_PLACED",
            y: 2962.962962962963,
          },
          quotations: [],
          config: {
            landingPageConfig: {
              subtitle: "test themecamp1 tagline",
              description: "test themecamp1 longdesc",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestthemecamp1name%2F87784935_10158648835648115_6032891701696135168_n%20(1).jpg?alt=media&token=45866251-61f4-43ff-8170-9c48fe4ae5dc",
              checkList: [],
            },
          },
          presentation: [],
          rooms: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          template: "themecamp",
          profile_questions: [],
          code_of_conduct_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          owners: ["tpl7htc3ceOgWI5J4xdLTNOfehh1"],
          name: "test themecamp1 name",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestthemecamp1name%2F87784935_10158648835648115_6032891701696135168_n.jpg?alt=media&token=0b054f45-d0e0-4781-9e68-ed99687a9735",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_EggHut_1.png?alt=media&token=06908499-4612-4221-bee8-b9e7fa3efe1f",
          id: "testthemecamp1name",
        },
        currentEvents: [],
      },
      {
        venue: {
          owners: ["tpl7htc3ceOgWI5J4xdLTNOfehh1"],
          profile_questions: [],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestingathemecamp%2F87784935_10158648835648115_6032891701696135168_n%20(1).jpg?alt=media&token=f53c93fa-a621-46db-a959-a81fa2907979",
          },
          theme: {
            primaryColor: "#bc271a",
          },
          code_of_conduct_questions: [],
          presentation: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SpaceToilet_1.png?alt=media&token=7e5422e0-14a5-46ee-a0fb-919d6f2687fd",
          name: "testing a theme camp",
          quotations: [],
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestingathemecamp%2FCRC_Universe_Party_Map_050820_2212.png?alt=media&token=aca0ec70-e909-4c8c-93f9-9120b831277e",
              subtitle: "testing",
              description: "testing",
              checkList: [],
            },
          },
          rooms: [],
          template: "themecamp",
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          placement: {
            state: " ",
            y: 1908.2568807339449,
            x: 609.1743119266055,
          },
          id: "testingathemecamp",
        },
        currentEvents: [],
      },
      {
        venue: {
          host: {
            icon:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbLfdZLgyyTXU849znlGdYNYyIwy3u6R3-zw&usqp=CAU",
          },
          iframeUrl: "https://www.youtube.com/embed/7Ttx0gHKfY8",
          template: "artpiece",
          name: "Art Piece Template Demo",
          code_of_conduct_questions: [
            {
              text: "hello",
              name: "hello",
            },
          ],
          config: {
            landingPageConfig: {
              checkList: ["Hello World!"],
              videoIframeUrl: "https://www.youtube.com/embed/eynnYLXW3Fo",
              presentation: [
                "The new template from SparkleVerse.",
                "It includes an embedded video and a video chat.",
              ],
              subtitle: "Demo for a new template",
              coverImageUrl:
                "https://www.atlasseo.fr/images/agence-seo/blog/holi-festival-india_750x280.jpg",
            },
          },
          id: "artpiecedemo",
        },
        currentEvents: [],
      },
      {
        venue: {
          code_of_conduct_questions: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcoolviz%2F0.9421959600297787-home-venue-2.png?alt=media&token=c2f2a13c-9398-4bf4-94e7-cd2c10cc6dee",
          name: "CoolViz",
          embedIframeUrl: "https://flowstate.revoltlabs.co/",
          owners: ["0Imzmd2iGjfdRwHq9nUNJDgwLBO2"],
          template: "artpiece",
          profileQuestions: [],
          placement: {
            x: 2407.079646017699,
            state: "SELF_PLACED",
            y: 1975.8648431214804,
          },
          profile_questions: [],
          presentation: [],
          theme: {
            primaryColor: "#bc271a",
          },
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcoolviz%2F0.31811724467399305-home-venue-2.png?alt=media&token=642c850a-81b4-49e2-a6b4-d6f8e81bf5fb",
          },
          config: {
            landingPageConfig: {
              subtitle: "Cool Visualisation",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcoolviz%2F0.2787606920082426-artboard.jpg?alt=media&token=0c8a06ab-5268-46cd-86b2-5ef5af6c704e",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcoolviz%2F0.2787606920082426-artboard.jpg?alt=media&token=0c8a06ab-5268-46cd-86b2-5ef5af6c704e",
              description: "check this out",
            },
          },
          quotations: [],
          id: "coolviz",
        },
        currentEvents: [],
      },
      {
        venue: {
          presentation: [],
          owners: ["0Imzmd2iGjfdRwHq9nUNJDgwLBO2"],
          code_of_conduct_questions: [],
          profileQuestions: [],
          quotations: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcool%2F0.8490287528060783-sample-logo.png?alt=media&token=a8f7366e-aacd-47eb-a9c4-82c15f2e20e1",
          config: {
            landingPageConfig: {
              subtitle: "cool",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcool%2F0.5925628156144127-sample-camp-logo.png?alt=media&token=bc993609-59ed-4d24-bc62-4fbaf8ac969b",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcool%2F0.5925628156144127-sample-camp-logo.png?alt=media&token=bc993609-59ed-4d24-bc62-4fbaf8ac969b",
              description: "cool",
              checkList: [],
            },
          },
          name: "cool",
          template: "themecamp",
          rooms: [],
          profile_questions: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Fcool%2F0.4299787352764983-sample-performance-logo.png?alt=media&token=5c2ea329-33c7-4d87-b265-cff5e47b015d",
          },
          placement: {
            y: 1068.3829444891392,
            state: "SELF_PLACED",
            x: 3340.305711987128,
          },
          theme: {
            primaryColor: "#bc271a",
          },
          id: "cool",
        },
        currentEvents: [],
      },
      {
        venue: {
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp2%2Fcat.jpg?alt=media&token=b1eedc10-212a-4bb5-97b9-a646810c7521",
          },
          owners: ["97GryUzgTXPL9AykD2evyrSHJoC3"],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp2%2Fcat.jpg?alt=media&token=8b0d3627-096f-421d-9f97-8c3ae72eaec0",
          theme: {
            primaryColor: "#bc271a",
          },
          profile_questions: [],
          presentation: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_1.png?alt=media&token=1bdb0a90-1739-4bbe-8f37-db22735e4a5d",
          rooms: [],
          config: {
            landingPageConfig: {
              checkList: [],
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp2%2Fcat.jpg?alt=media&token=aff3fb93-5010-42c1-8328-c78eb99d4ba9",
              subtitle: "Tagline",
              description: "Description",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp2%2Fcat.jpg?alt=media&token=aff3fb93-5010-42c1-8328-c78eb99d4ba9",
            },
          },
          template: "themecamp",
          code_of_conduct_questions: [],
          profileQuestions: [],
          quotations: [],
          name: "MCamp2",
          id: "mcamp2",
        },
        currentEvents: [],
      },
      {
        venue: {
          embedIframeUrl: "hasldkl",
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_Toilet_1.png?alt=media&token=db458b15-5126-4d53-952e-90c1c2966ee6",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestartpiece1name%2F87784935_10158648835648115_6032891701696135168_n%20(1).jpg?alt=media&token=ccf147de-dd02-4acc-a48c-d88d693e7bf9",
          },
          placement: {
            y: 1929,
            x: 1693,
            state: "ADMIN_PLACED",
          },
          code_of_conduct_questions: [],
          template: "artpiece",
          profile_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          config: {
            landingPageConfig: {
              checkList: [],
              subtitle: "test artpiece1 tagline",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestartpiece1name%2F87784935_10158648835648115_6032891701696135168_n%20(1).jpg?alt=media&token=0028491b-876b-48b8-993c-65a529e5afdc",
              description: "test artpiece1 longdesc",
            },
          },
          presentation: [],
          owners: ["tpl7htc3ceOgWI5J4xdLTNOfehh1"],
          quotations: [],
          name: "test artpiece1 name",
          id: "testartpiece1name",
        },
        currentEvents: [],
      },
      {
        venue: {
          presentation: [],
          theme: {
            primaryColor: "#bc271a",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_Toilet_1.png?alt=media&token=db458b15-5126-4d53-952e-90c1c2966ee6",
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspoon%2FArtboard%2030%20copy%206-100.jpg?alt=media&token=50268d9a-ee6a-42a2-9a29-1d49bb45b1f2",
          },
          name: "Spoon",
          template: "themecamp",
          config: {
            landingPageConfig: {
              checkList: [],
              subtitle: "Spam",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fspoon%2Fbananas.jpg?alt=media&token=af6e4a1f-cd68-4c77-bf74-281446c580a5",
              description: "Spam spam",
            },
          },
          code_of_conduct_questions: [],
          placement: {
            x: 1128.8629737609328,
            state: "SELF_PLACED",
            y: 2281.401617250674,
          },
          profile_questions: [],
          quotations: [],
          rooms: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          id: "spoon",
        },
        currentEvents: [],
      },
      {
        venue: {
          theme: {
            primaryColor: "#bc271a",
          },
          profileQuestions: [],
          quotations: [],
          presentation: [],
          template: "themecamp",
          config: {
            landingPageConfig: {
              checkList: [],
              subtitle: "maxroomscamp tag",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FwhT5W7kkhjghBBj0R5BsS5uiT5W2%2Fvenues%2Fmaxroomscamp%2F0.8252670960506574-cat.jpg?alt=media&token=777b98aa-0212-4e9e-be6f-0ad68987a9c7",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FwhT5W7kkhjghBBj0R5BsS5uiT5W2%2Fvenues%2Fmaxroomscamp%2F0.9969117324756775-ab.png?alt=media&token=1a536978-a4d1-470f-bddc-f18f6d1dc532",
              description: "maxroomscamp ld - Edited by admin",
            },
          },
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FwhT5W7kkhjghBBj0R5BsS5uiT5W2%2Fvenues%2Fmaxroomscamp%2F0.8249580112541821-Screenshot%202020-07-31%20at%2016.14.12.png?alt=media&token=1c032367-6437-4a77-8fcc-c0b84bc5008a",
          profile_questions: [],
          name: "maxroomscamp",
          placement: {
            state: "SELF_PLACED",
            y: 820.3198494825964,
            x: 1712.1354656632172,
          },
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FwhT5W7kkhjghBBj0R5BsS5uiT5W2%2Fvenues%2Fmaxroomscamp%2F0.10713400918303728-cat.jpg?alt=media&token=e6e66af5-1170-4ff8-a1a6-e61cea09f4d6",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_LargeTent_Single_1.png?alt=media&token=71426014-fd37-4b4f-b44e-991b5b5abe03",
          owners: [
            "whT5W7kkhjghBBj0R5BsS5uiT5W2",
            "ODSv7R0qphVpRr8IQsTaFiAvWl72",
          ],
          code_of_conduct_questions: [],
          rooms: [
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FwhT5W7kkhjghBBj0R5BsS5uiT5W2%2Fvenues%2Fmaxroomscamp%2Ffirstroom029719518446992077%2Fcat.jpg?alt=media&token=aa8d7802-5709-471d-bcfa-f19c83de282f",
              title: "firstroom",
              height_percent: 26.728395061728396,
              width_percent: 16.77777777777778,
              y_percent: 38.51851851851852,
              subtitle: "...",
              url: "...",
              x_percent: 56.333333333333336,
              about: "...",
            },
          ],
          id: "maxroomscamp",
        },
        currentEvents: [],
      },
      {
        venue: {
          template: "artpiece",
          code_of_conduct_questions: [],
          placement: {
            x: 836.697247706422,
            y: 2040.366972477064,
            state: " ",
          },
          presentation: [],
          quotations: [],
          theme: {
            primaryColor: "#bc271a",
          },
          profile_questions: [],
          config: {
            landingPageConfig: {
              checkList: [],
              description: "test",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestartpiece%2FCRC_Universe_Party_Map_050820_2212.png?alt=media&token=df31f8ca-8561-476f-b9e2-df40930bf446",
              subtitle: "stuff",
            },
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_Toilet_1.png?alt=media&token=db458b15-5126-4d53-952e-90c1c2966ee6",
          embedIframeUrl: "test",
          owners: ["tpl7htc3ceOgWI5J4xdLTNOfehh1"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ftpl7htc3ceOgWI5J4xdLTNOfehh1%2Fvenues%2Ftestartpiece%2F87784935_10158648835648115_6032891701696135168_n%20(1).jpg?alt=media&token=744bbac0-2a84-4be2-bfcd-fc61baeca2e1",
          },
          name: "test artpiece",
          id: "testartpiece",
        },
        currentEvents: [],
      },
      {
        venue: {
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_1.png?alt=media&token=1bdb0a90-1739-4bbe-8f37-db22735e4a5d",
          profile_questions: [],
          presentation: [],
          quotations: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons%2FSparkle_SmallTent_Single_1.png?alt=media&token=e1b1fc2c-dccc-4626-b567-ae59d1c15be8",
          placement: {
            x: 733.3333333333333,
            y: 2900.6211180124224,
          },
          config: {
            landingPageConfig: {
              checkList: [],
              description: "D",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fcat.jpg?alt=media&token=5c27c6c7-6cf2-447a-8638-6e31392e333a",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fcat.jpg?alt=media&token=5c27c6c7-6cf2-447a-8638-6e31392e333a",
              subtitle: "T",
            },
          },
          name: "MCamp5",
          profileQuestions: [],
          template: "themecamp",
          code_of_conduct_questions: [],
          theme: {
            primaryColor: "#bc271a",
          },
          rooms: [
            {
              x_percent: 47.5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fr10684321597138988%2Fcat.jpg?alt=media&token=0d27681b-9deb-4ff2-b60d-9933497d0eec",
              about: "A1",
              title: "R1",
              height_percent: 5,
              y_percent: 47.5,
              url: "U1",
              width_percent: 5,
              subtitle: "S1",
            },
            {
              subtitle: "S2",
              about: "A2",
              url: "U2",
              x_percent: 84.09090909090907,
              y_percent: 6.717662261870028,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fr200468319374375592%2Fcat.jpg?alt=media&token=eb761713-e642-4b27-9211-52bbe2382021",
              title: "R2",
              height_percent: 5,
              width_percent: 5,
            },
            {
              subtitle: "S",
              title: "R3",
              about: "D",
              width_percent: 5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fr3007112144851385627%2Fcat.jpg?alt=media&token=d9c45a71-20e2-45b4-a225-937ce42e24b5",
              x_percent: 7.121212121212121,
              height_percent: 5,
              y_percent: 65.18518518518519,
              url: "Z",
            },
            {
              subtitle: "S",
              about: "D",
              title: "R3 yeah!",
              x_percent: 8.787878787878787,
              y_percent: 12.659932659932657,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fr3007112144851385627%2Fcat.jpg?alt=media&token=d9c45a71-20e2-45b4-a225-937ce42e24b5",
              width_percent: 5,
              height_percent: 5,
              url: "Z",
            },
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fr402634372215666454%2Fcat.jpg?alt=media&token=a404e02f-fcc7-414f-8d31-6064bfb7a426",
              about: "A",
              title: "R4.5",
              x_percent: 47.57575757575758,
              height_percent: 5,
              subtitle: "S",
              y_percent: 79.53020134228187,
              width_percent: 5,
              url: "U",
            },
          ],
          owners: ["97GryUzgTXPL9AykD2evyrSHJoC3"],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F97GryUzgTXPL9AykD2evyrSHJoC3%2Fvenues%2Fmcamp5%2Fcat.jpg?alt=media&token=014bc8e3-51ea-4ad2-a92a-9221807d4b09",
          },
          id: "mcamp5",
        },
        currentEvents: [],
      },
      {
        venue: {
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_EggHut_1.png?alt=media&token=06908499-4612-4221-bee8-b9e7fa3efe1f",
          profileQuestions: [],
          quotations: [],
          placement: {
            x: 1990.07299270073,
            y: 1243.7975255351719,
          },
          template: "themecamp",
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthemecamptest1%2F0.2019102375188353-Screenshot%202020-08-11%20at%2018.34.39.png?alt=media&token=fffbfc3d-2c9f-4c48-a633-674270446474",
          },
          code_of_conduct_questions: [],
          rooms: [
            {
              width_percent: 27.777115155246047,
              subtitle: "Cuddle puddle",
              title: "Tent space",
              url: "zoom.us/sgoshohso",
              x_percent: 47.5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthemecamptest1%2Ftentspace09302086260286022%2FScreenshot%202020-08-17%20at%2015.31.07.png?alt=media&token=a9409989-bae6-4ae4-8add-6e5d839c67f3",
              about: "A place where people can cuddle impeccably!",
              height_percent: 31.046511627906977,
              y_percent: 47.50000000000001,
            },
          ],
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          presentation: [],
          name: "ThemeCampTest1",
          theme: {
            primaryColor: "#bc271a",
          },
          config: {
            landingPageConfig: {
              subtitle: "The coolest test",
              description: "A really very good test",
              checkList: [],
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthemecamptest1%2F0.9885370951582022-Screenshot%202020-08-09%20at%2001.06.19.png?alt=media&token=7208b4b2-0eb6-4d95-abf7-d4271ed78487",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthemecamptest1%2F0.9885370951582022-Screenshot%202020-08-09%20at%2001.06.19.png?alt=media&token=7208b4b2-0eb6-4d95-abf7-d4271ed78487",
            },
          },
          profile_questions: [],
          id: "themecamptest1",
        },
        currentEvents: [],
      },
      {
        venue: {
          profile_questions: [],
          owners: ["t4ycJQQbb5fsi92P2EYigYuWqWt1"],
          quotations: [],
          placement: {
            state: "ADMIN_PLACED",
            x: 1712,
            y: 1680,
          },
          presentation: [],
          theme: {
            primaryColor: "#bc271a",
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2F0.3579350737921758-maxbull.jpg?alt=media&token=4b36de9f-3cdc-4318-ab4c-809dd78a011a",
          profileQuestions: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          code_of_conduct_questions: [],
          name: "themecampmax",
          config: {
            landingPageConfig: {
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2F0.3281613381460773-cat.jpg?alt=media&token=89f7b3dc-e3e5-4ed4-b72d-c8c3419cc78c",
              subtitle: "dfasdf",
              description: "admin made ld",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2Fcat.jpg?alt=media&token=2c13812c-787a-4fb1-a95a-512d9783938e",
              checkList: [],
            },
          },
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2F0.5599481144226235-cat.jpg?alt=media&token=e090644f-6964-43fc-8e8b-51e7d8933706",
          },
          rooms: [
            {
              height_percent: 64.0268096428159,
              width_percent: 33.40624465861383,
              title: "room",
              url: "url.com",
              y_percent: 18.207965985118488,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2Froom039085419321138204%2Fcat.jpg?alt=media&token=80cca6ce-e418-4465-9674-e6fb42611077",
              about: "about",
              x_percent: 8.553742262239728,
              subtitle: "subtitle23",
            },
            {
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2Froom039085419321138204%2Fcat.jpg?alt=media&token=80cca6ce-e418-4465-9674-e6fb42611077",
              height_percent: 55.13571215184421,
              about: "about",
              x_percent: 48.333333333333336,
              width_percent: 9.700806602888767,
              url: "url.com",
              subtitle: "admin made subtitle",
              y_percent: 11.45679012345679,
              title: "room2",
            },
            {
              x_percent: 26.666666666666668,
              url: "fgsdfgdsf",
              width_percent: 37.888888888888886,
              subtitle: "f",
              height_percent: 59.14582368192199,
              y_percent: 32.592592592592595,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2Ft4ycJQQbb5fsi92P2EYigYuWqWt1%2Fvenues%2Fthemecampmax%2Fplaya_templates05482767767109822%2Fcat.jpg?alt=media&token=14812a17-e48c-41a7-9c63-98f576107903",
              about: "dfgsdfgdfg",
              title: "PLAYA_TEMPLATESss",
            },
          ],
          template: "themecamp",
          id: "themecampmax",
        },
        currentEvents: [],
      },
      {
        venue: {
          code_of_conduct_questions: [],
          quotations: [],
          theme: {
            primaryColor: "#bc271a",
          },
          profile_questions: [],
          rooms: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F0Imzmd2iGjfdRwHq9nUNJDgwLBO2%2Fvenues%2Frockukelele%2FAdobeStock_269594463.jpg?alt=media&token=d43d70f6-ae18-4f77-a73f-366c0d76c199",
          config: {
            landingPageConfig: {
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FN7Lxf13ofpfgKoU7oRixAZrOOTr2%2Fvenues%2Fthemcampmax1%2F0.681612005371588-cat.jpg?alt=media&token=fe4f6c89-291c-452f-808a-0c47c54b0a7f",
              description: "PLAYA_TEMPLATES",
              subtitle: "PLAYA_TEMPLATES",
              checkList: [],
            },
          },
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2FN7Lxf13ofpfgKoU7oRixAZrOOTr2%2Fvenues%2Fthemcampmax1%2F0.4348362962596024-cat.jpg?alt=media&token=2f786f0e-7cf0-4eee-ad4d-73b77c4fabfa",
          },
          placement: {
            y: 1763,
            x: 1680,
            state: "ADMIN_PLACED",
          },
          owners: ["N7Lxf13ofpfgKoU7oRixAZrOOTr2"],
          name: "themcampmax1",
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_2.png?alt=media&token=ab61f5e0-8be1-4f85-b6b8-f2abb50858b7",
          template: "themecamp",
          presentation: [],
          id: "themcampmax1",
        },
        currentEvents: [],
      },
      {
        venue: {
          profile_questions: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_2.png?alt=media&token=ab61f5e0-8be1-4f85-b6b8-f2abb50858b7",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2F0.19193443472204086-derrick-treadwell-m01bajOe8E0-unsplash.jpg?alt=media&token=c06f76cd-f6d0-41c6-9534-3a1edd0f6b4f",
          },
          quotations: [],
          rooms: [
            {
              width_percent: 5,
              x_percent: 11.358024691358025,
              title: "Tent space",
              about: "The best room in the world",
              height_percent: 5,
              subtitle: "It's going to be sweet!",
              y_percent: 46.82213077274805,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2Ftentspace048005527895309186%2FSparkle_LargeTent_Single_1.png?alt=media&token=cf88b8bf-139e-4cfb-b573-e66d055f6405",
              url: "zoom.us/sghsisi",
            },
            {
              height_percent: 5,
              title: "Test room 2",
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2Ftestroom2039596462173182%2FSparkle_MediumTent_Single_1.png?alt=media&token=4df9bd37-4ac4-45a0-a847-efc9420851be",
              url: "theguardian.com",
              about: "There is so much goodness here",
              subtitle: "FUn",
              x_percent: 38.35390946502058,
              y_percent: 59.69821673525377,
              width_percent: 5,
            },
            {
              url: "theguardian.com/sport",
              x_percent: 67.32510288065843,
              width_percent: 5,
              image_url:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2Fspooon06487882448768005%2FDOME.png?alt=media&token=b57c18d3-e64c-46b9-bfca-15d88fc94221",
              title: "SPOoon",
              subtitle: "Munch",
              y_percent: 50.041152263374485,
              height_percent: 5,
              about: "Cuddle puddle area",
            },
          ],
          config: {
            landingPageConfig: {
              description:
                "The genius of burning man camps is that they’re all different. There’s no “one”. Each camp has its own rules, its own vibe, and its own internal culture. Some are reserved for VIPs, some have cool themes, some are like science labs, some are like gay clubs, some are like weird art spaces, some are like hippie communes, and some are like Burning Man itself – all of the above.\n\nIf you’re going to Burning Man as a single person, it might seem like you have no chance of getting in. And maybe you don’t",
              subtitle: "It's going to be sweet!",
              checkList: [],
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2F0.4925868260139159-bananas.jpg?alt=media&token=cdb219fb-0580-4e25-be18-2a170a4c6993",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2F0.2608118567476643-derrick-treadwell-m01bajOe8E0-unsplash.jpg?alt=media&token=100b1060-2921-4b55-9cf8-36df31ba9eb7",
            },
          },
          placement: {
            x: 2390.1234567901233,
            y: 2284.373964255666,
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Ftuesdaythemecamptest1%2F0.7441173035924555-Artboard%2030%20copy%206-100.jpg?alt=media&token=fa17fae1-60dc-4c40-987c-46d20a338a11",
          name: "TuesdayThemeCampTest1",
          profileQuestions: [],
          code_of_conduct_questions: [],
          presentation: [],
          template: "themecamp",
          theme: {
            primaryColor: "#bc271a",
          },
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          id: "tuesdaythemecamptest1",
        },
        currentEvents: [],
      },
      {
        venue: {
          config: {
            landingPageConfig: {
              subtitle: "We live photocopiers",
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fzeroxchristmasparty%2F0.44251792847082916-MagmaHeart.jpg?alt=media&token=394d86a6-cf7f-4c15-bd3e-7270e217bc8e",
              description: "They print stuff",
              checkList: [],
            },
          },
          presentation: [],
          theme: {
            primaryColor: "#bc271a",
          },
          profile_questions: [],
          mapBackgroundImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapBackgrounds%2FCamp_Background_3.png?alt=media&token=e310872c-20ce-464b-8534-b4359a42555e",
          rooms: [],
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          code_of_conduct_questions: [],
          placement: {
            state: "ADMIN_PLACED",
            x: 1681,
            y: 1846,
          },
          quotations: [],
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/assets%2FmapIcons2%2FSparkle_Toilet_1.png?alt=media&token=6b0281b2-a202-4d8c-a0f3-2b3307a00f0b",
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fzeroxchristmasparty%2F0.3258678563101247-green.png?alt=media&token=0cfd3bd1-69c1-4684-b972-4efb4fc830f3",
          },
          name: "Zerox Christmas Party",
          template: "themecamp",
          id: "zeroxchristmasparty",
        },
        currentEvents: [],
      },
      {
        venue: {
          owners: ["9ey6MNjGEvV7l9zGZOaN4kc3BMf1"],
          template: "artpiece",
          placement: {
            state: " ",
            y: 1980,
            x: 1980,
          },
          theme: {
            primaryColor: "#bc271a",
          },
          config: {
            landingPageConfig: {
              description: "This is going to be very amazing",
              bannerImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthezone%2F1_The_Zone.png?alt=media&token=861ce987-4ae3-461a-8095-f74376e5fc5a",
              subtitle: "Where all your deepest desires come true",
              checkList: [],
              coverImageUrl:
                "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthezone%2F1_The_Zone.png?alt=media&token=861ce987-4ae3-461a-8095-f74376e5fc5a",
            },
          },
          mapIconImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthezone%2FScreenshot%202020-08-13%20at%2009.06.56.png?alt=media&token=8ba0447b-8436-4664-894c-33ad4f3a46a5",
          embedIframeUrl: "https://www.youtube.com/embed/qYr29e8UqDM",
          profileQuestions: [],
          code_of_conduct_questions: [],
          presentation: [],
          name: "TheZone",
          quotations: [],
          host: {
            icon:
              "https://firebasestorage.googleapis.com/v0/b/co-reality-staging.appspot.com/o/users%2F9ey6MNjGEvV7l9zGZOaN4kc3BMf1%2Fvenues%2Fthezone%2FDOME.png?alt=media&token=c2ac3592-1d2d-4c57-976c-05465c890ab9",
          },
          profile_questions: [],
          id: "thezone",
        },
        currentEvents: [],
      },
    ],
  },
};
interface PotLuckButtonProps {
  openVenues?: Array<WithId<AnyVenue>>;
  afterSelect: () => void;
}
const PotLuckButton: React.FC<PotLuckButtonProps> = ({
  openVenues,
  afterSelect,
}) => {
  // const history = useHistory();
  const goToRandomVenue = useCallback(() => {
    if (!openVenues) return;
    const randomVenue = openVenues[getRandomInt(openVenues?.length - 1)];
    afterSelect();

    // there is a bug in useConnectCurrentVenue that does not update correctly on url change
    // history.push(venueInsideUrl(randomVenue.id));
    window.location.href = venuePlayaPreviewUrl(randomVenue.id);
  }, [/*history,*/ openVenues, afterSelect]);
  if (!openVenues) {
    return <></>;
  }
  return (
    <button onClick={goToRandomVenue} className="btn btn-primary">
      Pot Luck
    </button>
  );
};

const OnlineStats: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<
    OnlineStatsData["onlineUsers"]
  >([]);
  const [openVenues, setOpenVenues] = useState<OnlineStatsData["openVenues"]>(
    []
  );
  const [loaded, setLoaded] = useState(false);
  const [filterVenueText, setFilterVenueText] = useState("");
  const [filterUsersText, setFilterUsersText] = useState("");
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { onlineUsers, openVenues } = result.data as OnlineStatsData;
          setOnlineUsers(onlineUsers);
          setOpenVenues(openVenues);
          setLoaded(true);
        })
        .catch(() => {
          const { onlineUsers, openVenues } = dummy.result as OnlineStatsData;
          const liveEvents: Array<VenueEvent> = [];
          const venuesWithAttendance: AttendanceVenueEvent[] = [];
          openVenues.forEach(
            (venue: {
              venue: WithId<AnyVenue>;
              currentEvents: Array<VenueEvent>;
            }) => {
              const venueAttendance = peopleAttending(partygoers, venue.venue);
              liveEvents.push(...venue.currentEvents);
              venuesWithAttendance.push({
                ...venue,
                attendance: venueAttendance ? venueAttendance.length : 0,
              });
            }
          );
          venuesWithAttendance.sort((a, b) => b.attendance - a.attendance);
          setOnlineUsers(onlineUsers);
          setOpenVenues(venuesWithAttendance);
          setLiveEvents(liveEvents);
          setLoaded(true);
        }); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [partygoers]);
  const fuseVenues = useMemo(
    () =>
      openVenues
        ? new Fuse(openVenues, {
            keys: [
              "venue.name",
              "venue.config.landingPageConfig.subtitle",
              "venue.config.landingPageConfig.description",
            ],
          })
        : undefined,
    [openVenues]
  );
  const fuseUsers = useMemo(
    () =>
      new Fuse(onlineUsers, {
        keys: ["partyName"],
      }),
    [onlineUsers]
  );

  const filteredVenues = useMemo(() => {
    if (filterVenueText === "") return openVenues;
    const resultOfSearch: typeof openVenues = [];
    fuseVenues &&
      fuseVenues
        .search(filterVenueText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseVenues, filterVenueText, openVenues]);

  const filteredUsers = useMemo(() => {
    if (filterUsersText === "") return onlineUsers;
    const resultOfSearch: typeof onlineUsers = [];
    fuseUsers &&
      fuseUsers
        .search(filterUsersText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseUsers, filterUsersText, onlineUsers]);

  const liveVenues = filteredVenues.filter(
    (venue) => venue.currentEvents.length
  );
  const allVenues = filteredVenues.filter(
    (venue) => !venue.currentEvents.length
  );
  const getVenueAttendance = (venue: Venue) => {
    const attendance = peopleAttending(partygoers, venue);
    return attendance ? attendance.length : 0;
  };

  const popover = useMemo(
    () =>
      loaded ? (
        <Popover id="popover-onlinestats">
          <Popover.Content>
            <div className="stats-outer-container">
              <div className="stats-modal-container">
                <div className="open-venues">
                  {openVenues?.length || 0} venues open now
                </div>
                <div className="search-container">
                  <input
                    type={"text"}
                    className="search-bar"
                    placeholder="Search venues"
                    onChange={(e) => setFilterVenueText(e.target.value)}
                    value={filterVenueText}
                  />
                  <PotLuckButton
                    openVenues={openVenues.map((ov) => ov.venue)}
                    // Force popover to close
                    afterSelect={() => document.body.click()}
                  />
                </div>
                <div className="venues-container">
                  <div>
                    {liveVenues.length && (
                      <>
                        <h5>
                          {liveVenues.length}{" "}
                          {liveVenues.length === 1 ? "Venue" : "Venues"} with
                          live events now
                        </h5>
                        <div className="venues-container">
                          {liveVenues.map(({ venue, currentEvents }, index) => (
                            <div className="venue-card" key={index}>
                              <div className="img-container">
                                <img
                                  className="venue-icon"
                                  src={venue.host.icon}
                                  alt={venue.name}
                                  title={venue.name}
                                />
                              </div>
                              <span className="venue-name">{venue.name}</span>
                              <span className="venue-people">
                                <b>{getVenueAttendance(venue)}</b> people in
                                this room
                              </span>
                              <span className="venue-subtitle">
                                {venue.config?.landingPageConfig.subtitle}
                              </span>

                              <VenueInfoEvents
                                eventsNow={currentEvents}
                                venue={venue}
                                showButton={true}
                                futureEvents={false}
                                joinNowButton={false}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <h5>All venues</h5>
                    <div className="venues-container">
                      {allVenues.map(({ venue }, index) => (
                        <div className="venue-card" key={index}>
                          <div className="img-container">
                            <img
                              className="venue-icon"
                              src={venue.host.icon}
                              alt={venue.name}
                              title={venue.name}
                            />
                          </div>
                          <span className="venue-name">{venue.name}</span>
                          <span className="venue-subtitle">
                            {venue.config?.landingPageConfig.subtitle}
                          </span>

                          <VenueInfoEvents
                            eventsNow={[]}
                            venue={venue}
                            showButton={true}
                            futureEvents={false}
                            joinNowButton={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="users-container">
                <div className="online-users">
                  {onlineUsers.length} burners live
                </div>
                <div className="search-container">
                  <input
                    type={"text"}
                    className="search-bar"
                    placeholder="Search people"
                    onChange={(e) => setFilterUsersText(e.target.value)}
                    value={filterUsersText}
                  />
                </div>
                <div className="people">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="user-row"
                      onClick={() => setSelectedUserProfile(user)}
                    >
                      <div>
                        <img src={user.pictureUrl} alt="user profile pic" />
                        <span>{user.partyName}</span>
                      </div>
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        className="chat-icon"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      ) : (
        <></>
      ),
    [
      loaded,
      filterVenueText,
      filterUsersText,
      openVenues,
      onlineUsers,
      filteredUsers,
      allVenues,
      liveVenues,
    ]
  );

  return (
    <>
      {loaded && (
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          overlay={popover}
          rootClose={!selectedUserProfile} // allows modal inside popover
        >
          <span>
            {openVenues.length} venues open now / {onlineUsers.length} burners
            live <FontAwesomeIcon icon={faSearch} />
          </span>
        </OverlayTrigger>
      )}
      <UserProfileModal
        zIndex={2000} // popover has 1060 so needs to be greater than that to show on top
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </>
  );
};

export default OnlineStats;
