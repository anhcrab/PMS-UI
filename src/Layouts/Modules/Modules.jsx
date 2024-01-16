import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Loading from "../../Components/Loading/Loading";

const Modules = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2 * 1000)
  }, [])
  return (
    <>
      { loading && <Loading/> }
      <div>Modules {slug}</div>
    </>
  )
}

export default Modules