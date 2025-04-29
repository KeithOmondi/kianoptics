import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Layout/Header';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileContent from '../components/Profile/ProfileContent';
import Footer from '../components/Layout/Footer';

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <>
    
    <div className="bg-gray-100 min-h-screen">
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Header */}
          <Header />

          {/* Profile Page Layout */}
          <div className="flex w-full min-h-screen p-4 md:p-8 space-y-6 800px:space-y-0">
            {/* Sidebar */}
            <div className="w-[10%] 800px:w-[300px] sticky top-0 bg-white shadow-lg rounded-lg z-10">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-4 800px:ml-[320px]">
              <ProfileContent active={active} />
            </div>
          </div>
        </>
      )}
    </div>

    <Footer />
    </>
  );
};

export default ProfilePage;
