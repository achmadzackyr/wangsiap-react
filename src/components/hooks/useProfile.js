import { useState } from 'react';

export default function useProfile() {
  const getProfile = () => {
    const profileString = localStorage.getItem('profile');
    const userProfile = JSON.parse(profileString);
    return userProfile?.nama;
  };

  const [profile, setProfile] = useState(getProfile());

  const saveProfile = (userProfile) => {
    localStorage.setItem('profile', JSON.stringify(userProfile));
    setProfile(userProfile.nama);
  };

  return {
    setProfile: saveProfile,
    profile
  };
}
