import "./AuthLoading.scss";

const AuthLoading = () => {
  return (
    <div className="terus-auth__loading">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default AuthLoading;
