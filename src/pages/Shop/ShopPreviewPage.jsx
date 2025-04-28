import React from 'react'
import ShopInfo from '../../components/Shop/ShopInfo';
import ShopProfileData from '../../components/Shop/ShopProfileData';

const ShopPreviewPage = () => {
  return (
    <div className="bg-[#f5f5f5] py-10">
      <div className="w-full flex flex-col 800px:flex-row justify-between">
        <div className="bg-white rounded-[4px] shadow-sm overflow-y-scroll 800px:w-[25%] 800px:h-[90vh] 800px:sticky top-10 left-0 z-10">
          <ShopInfo isOwner={false} />
        </div>
        <div className="mt-5 800px:mt-0 rounded-[4px] 800px:w-[72%]">
          <ShopProfileData isOwner={false} />
        </div>
      </div>
    </div>
  )
}

export default ShopPreviewPage;
