import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
function Profile() {
  const { authUser, updateProfile, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // Initialize form whenever authUser changes
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullname || "");
      setBio(authUser.bio || "");
      setSelectedImg(null);
    }
  }, [authUser]);

  if (!authUser) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) return;

    if (!selectedImg) {
      await updateProfile({ fullname: name, bio }, token);
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);

    reader.onload = async () => {
      await updateProfile(
        {
          profilePic: reader.result,
          fullname: name,
          bio,
        },
        token
      );
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser.profilePic || assets.avatar_icon}
              className={`w-12 h-12 rounded-full`}
              alt="avatar"
            />
            Upload Profile Image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Your Name"
            required
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2"
            placeholder="Write profile bio"
            rows={4}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10`}
          src={ authUser?.profilePic || assets.logo_icon }
          alt=""
        />
      </div>
    </div>
  );
}

export default Profile;