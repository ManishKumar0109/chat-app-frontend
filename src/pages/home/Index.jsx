import { useStore } from "../../../store/index.js";

const Home = () => {
  const { userInfo } = useStore();
  return (
    <div className="bg-amber-400">
      <div>{userInfo?.username}</div>
      <div>{userInfo?.email}</div>
    </div>
  );
};

export default Home;
