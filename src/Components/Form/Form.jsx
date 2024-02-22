import React, { useState } from 'react'
import { authenticate } from '../../Utils/utils';
import api from '../../Utils/api';

const Form = (props) => {
  // eslint-disable-next-line react/prop-types
  const { method, endpoint, children } = props;
  const [payload, setPayload] = useState({})

  function handleChange(e) {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault();
    authenticate('/Auth', true);
    api[`${method}`.toLowerCase()](endpoint, payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default Form