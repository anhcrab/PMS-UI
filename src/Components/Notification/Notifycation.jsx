import { useContext, useEffect } from "react";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import { Toast } from "bootstrap";

const Notifycation = () => {
  const { notification } = useContext(AdminContext);
  useEffect(() => {
    Array.from(notification).forEach((message, index) => {
      if (message.status === "show") {
        Toast.getOrCreateInstance(
          document.getElementById(`liveMessage-${index}`)
        ).show();
      }
    });
  }, [notification]);
  return (
    <>
      {Array.from(notification).map((message, index) => (
        <div key={index} className="toast-container position-fixed bottom-0 end-0 p-3" data-bs-theme="dark">
          <div
            id={`liveMessage-${index}`}
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <img
                src="https://terusvn.com/wp-content/uploads/2023/10/cropped-1-1-192x192.png"
                width={30}
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{message.title}</strong>
              <small>{(new Date().getMinutes() - new Date(message.time).getMinutes()) > 0 ? `${new Date().getMinutes() - new Date(message.time).getMinutes()} phút trước` : 'Vừa xong'}</small>
              {/* <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button> */}
            </div>
            <div className="toast-body">{message.content}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Notifycation;
