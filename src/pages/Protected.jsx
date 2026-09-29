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
        if (!err.response) {
          navigate('/coldstart')
        }
        return navigate("/auth");
      }
    }
  }

  useEffect(()=>{
    checkUserInfo()
  },[]) 

  if(!userInfo){
    <div>Loading....</div>
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};
export default Protected;
