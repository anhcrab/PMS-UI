import "./Loading.scss";

// eslint-disable-next-line react/prop-types
const Loading = ({isBlur = false}) => {
  return (
    <div className={`terus-loading__container${isBlur ? ' blur' : ''}`}>
      <div className="terus-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
