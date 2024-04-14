import { api } from "../../services/axios";

const Profile = () => {
  const call = async () => {
    const make = async () => {
      const res = await api.get("/schedule");
      return res;
    };
    console.log(await make());
  };

  return (
    <div>
      Profile
      <button onClick={call}>call</button>
    </div>
  );
};

export default Profile;
