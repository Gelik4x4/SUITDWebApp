import  { useState } from 'react';
import './ProfilePage.css';
import ProfileTabs  from '../components/profile/ProfileTabs';
import TabData      from '../components/profile/TabData';
import TabSettings  from '../components/profile/TabSettings';
import TabSupport   from '../components/profile/TabSupport';
import TabAbout     from '../components/profile/TabAbout';

const TAB_COMPONENTS = {
  data:     <TabData />,
  settings: <TabSettings />,
  support:  <TabSupport />,
  about:    <TabAbout />,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('data');

  return (
    <div className="profile-page">
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      <div className="profile-page__content">
        {TAB_COMPONENTS[activeTab]}
      </div>
    </div>
  );
}
