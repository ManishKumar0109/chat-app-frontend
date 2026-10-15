import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../../store/index";
import { api } from "@/lib/api-client";
import { GET_USER_INFO, HOST } from "@/utils/constants";
import { useEffect } from "react";

const Protected = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useStore();

  async function checkUserInfo() {
    if (!userInfo) {
      try {
        const res =await api.get(`${HOST}${GET_USER_INFO}`);
        if (res.data.success) {
          setUserInfo(res?.data?.data);
          
        }
      } catch (err) {
        console.log(err.response , err)
        if (!err.response) {
          return navigate('/coldstart')
        }
        return navigate("/auth");
      }
    }
  }

  useEffect(()=>{
    checkUserInfo()
  },[]) 

  if(!userInfo){
    return(<div>Loading....</div>)
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};
export default Protected;
