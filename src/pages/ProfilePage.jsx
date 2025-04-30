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

            {/* Responsive Layout */}
            <div className="flex flex-col lg:flex-row w-full min-h-screen p-4 space-y-6 lg:space-y-0 lg:space-x-6">
              
              {/* Sidebar */}
              <div className="w-full lg:w-[300px] bg-white shadow-md rounded-lg p-4">
                <ProfileSidebar active={active} setActive={setActive} />
              </div>

              {/* Content */}
              <div className="flex-1 bg-white shadow-md rounded-lg p-4">
                <ProfileContent active={active} />
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
