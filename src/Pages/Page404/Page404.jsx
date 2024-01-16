import { Link } from "react-router-dom";
import "./Page404.scss";

const Page404 = () => {
  return (
    <>
      <p className="zoom-area">
        {" "}
        Có vẻ như trang bạn tìm ở <b> Terus </b> không tồn tại{" "}
      </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <Link to={'/'} target="_blank" className="more-link" rel="noreferrer">
          Trở về trang chủ của Terus
        </Link>
      </div>
    </>
  );
};

export default Page404;
