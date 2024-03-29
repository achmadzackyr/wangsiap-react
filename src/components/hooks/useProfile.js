import { useState } from 'react';

export default function useProfile() {
  const getProfile = () => {
    const profileString = localStorage.getItem('profile');
    const userProfile = JSON.parse(profileString);
    return userProfile;
  };

  const [profile, setProfile] = useState(getProfile());

  const saveProfile = (userProfile) => {
    localStorage.setItem('profile', JSON.stringify(userProfile));
    setProfile(userProfile);
  };

  return {
    setProfile: saveProfile,
    profile
  };
}
