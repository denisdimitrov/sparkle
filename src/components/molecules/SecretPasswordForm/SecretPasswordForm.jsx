import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import "./SecretPasswordForm.scss";
import { venueEntranceUrl } from "utils/url";
import { localStorageTokenKey } from "utils/localStorage";

const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const firebase = useFirebase();
  const history = useHistory();
  const { venueId } = useParams();

  const [invalidPassword, setInvalidPassword] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();

  function passwordChanged(e) {
    setPassword(e.target.value);
    setInvalidPassword(false);
    setError(false);
  }

  const passwordSubmitted = async (e) => {
    e.preventDefault();
    setMessage("Checking password...");

    try {
      const result = await firebase
        .functions()
        .httpsCallable("access-checkAccess")({
        venueId,
        password,
      });
      localStorage.setItem(localStorageTokenKey(venueId), result.data.token);

      setInvalidPassword(false);
      setMessage("Password OK! Proceeding...");
      history.push(venueEntranceUrl(venueId));
    } catch (error) {
      setInvalidPassword(true);
      setMessage(`Password error: ${error.toString()}`);
    }
  };

  return (
    <>
      <form className="secret-password-form" onSubmit={passwordSubmitted}>
        <p className="small-text">
          Got an invite? Join in with the secret password
        </p>
        <input
          className={
            "secret-password-input " + (invalidPassword ? " is-invalid" : "")
          }
          required
          placeholder="password"
          autoFocus
          onChange={passwordChanged}
          id="password"
        />
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value={buttonText}
        />
        <div className="form-group">
          {message && <small>{message}</small>}
          {invalidPassword && (
            <small className="error-message">Wrong password!</small>
          )}
          {error && <small className="error-message">An error occured</small>}
        </div>
      </form>
    </>
  );
};

export default SecretPasswordForm;
