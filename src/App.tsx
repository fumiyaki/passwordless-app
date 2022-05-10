import { useState } from "react";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

const JAPAN_PHONE_COUNTRY_CODE = "+81";
const PASSWORD = "e2D3ZfMT";
function App() {
  const [signUpPhoneNumber, setSignUpPhoneNumber] = useState("");
  const [confirmSignUpCode, setConfirmSignUpCode] = useState("");

  const [signInPhoneNumber, setSignInPhoneNumber] = useState("");
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
  const [confirmSignInCode, setConfirmSignInCode] = useState("");

  const signUp = async () => {
    try {
      const { user } = await Auth.signUp(
        JAPAN_PHONE_COUNTRY_CODE + signUpPhoneNumber,
        PASSWORD
      );
      console.log("仮登録をしました。user:", { user });
    } catch (error) {
      console.log("error signing up:", { error });
    }
  };

  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(
        JAPAN_PHONE_COUNTRY_CODE + signUpPhoneNumber,
        confirmSignUpCode
      );
      alert("登録完了しました。");
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  };

  async function signIn() {
    try {
      const user = await Auth.signIn(
        JAPAN_PHONE_COUNTRY_CODE + signInPhoneNumber,
        PASSWORD
      );
      setCognitoUser(user);
    } catch (error) {
      console.log("error sign in", error);
    }
  }

  const signInChallenge = async () => {
    if (!cognitoUser) {
      return;
    }
    try {
      const loggedUser = await Auth.confirmSignIn(
        cognitoUser,
        confirmSignInCode,
        "SMS_MFA"
      );
      console.log(loggedUser);
      alert("ログインしました。");
    } catch (error) {
      console.log("error confirming sign in", error);
    }
  };

  return (
    <div>
      <div className="signUpSeriesContainer">
        <div className="signUpContainer">
          <input
            type="text"
            placeholder="signUpPhoneNumber"
            value={signUpPhoneNumber}
            onChange={(e) => setSignUpPhoneNumber(e.target.value)}
          />
          <button onClick={() => signUp()}>仮登録</button>
        </div>
        <div className="confirmSignUpContainer">
          <input
            type="text"
            placeholder="confirmSignUpCode"
            value={confirmSignUpCode}
            onChange={(e) => setConfirmSignUpCode(e.target.value)}
          />
          <button onClick={() => confirmSignUp()}>登録</button>
        </div>
      </div>
      <div className="signInSeriesContainer">
        <div className="signInContainer">
          <input
            type="text"
            placeholder="signInPhoneNumber"
            value={signInPhoneNumber}
            onChange={(e) => setSignInPhoneNumber(e.target.value)}
          />
          <button onClick={() => signIn()}>SMSを送る</button>
        </div>
        <div className="confirmSignUpContainer">
          <input
            type="text"
            placeholder="confirmSignInCode"
            value={confirmSignInCode}
            onChange={(e) => setConfirmSignInCode(e.target.value)}
          />
          <button onClick={() => signInChallenge()}>確認する</button>
        </div>
      </div>
      <div
        className="singOutContainer"
        onClick={() => {
          Auth.signOut();
        }}
      >
        ログアウト
      </div>
    </div>
  );
}

export default App;
