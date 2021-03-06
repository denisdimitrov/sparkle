import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./EditProfileModal.scss";
import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { updateUserProfile } from "pages/Account/helpers";
import { QuestionType } from "types/Question";
import ProfilePictureInput from "components/molecules/ProfilePictureInput";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { currentVenueSelectorData } from "utils/selectors";

interface PropsType {
  show: boolean;
  onHide: () => void;
}

const EditProfileModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
}) => {
  const { user, profile } = useUser();
  const profileQuestions = useSelector(
    (state) => currentVenueSelectorData(state)?.profile_questions
  );
  const onSubmit = async (data: ProfileFormData & QuestionsFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    onHide();
  };
  const defaultValues: Record<string, string | undefined> = {
    partyName: profile?.partyName,
    pictureUrl: profile?.pictureUrl,
  };
  profileQuestions &&
    profileQuestions.map(
      (question: QuestionType) =>
        (defaultValues[question.name] = profile
          ? //@ts-ignore
            profile[question.name]
          : undefined) // no idea what's going on here. Typescript will clarify.
    );

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    triggerValidation,
    watch,
  } = useForm<ProfileFormData & QuestionsFormData>({
    mode: "onChange",
    defaultValues,
  });

  // this useEffect forces the form validation when the component is mounted
  useEffect(() => {
    triggerValidation();
  }, [triggerValidation]);

  const pictureUrl = watch("pictureUrl");

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="edit-profile-modal">
        <h1 className="title">Edit profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your display name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
            />
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Display name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Display name is less than 16 characters
              </span>
            )}
            {user && (
              <ProfilePictureInput
                setValue={setValue}
                user={user}
                errors={errors}
                pictureUrl={pictureUrl}
                register={register}
              />
            )}
          </div>
          {profileQuestions &&
            profileQuestions.map((question: QuestionType) => (
              <>
                <div className="question">{question.text}</div>
                <div className="input-group">
                  <textarea
                    className="input-block input-centered"
                    name={question.name}
                    ref={register({
                      required: true,
                    })}
                  />
                </div>
              </>
            ))}
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Save changes"
            disabled={!formState.isValid}
          />
        </form>
        <div
          className="cancel-button"
          onClick={onHide}
          id="edit-profile-modal-cancel"
        >
          Cancel
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
