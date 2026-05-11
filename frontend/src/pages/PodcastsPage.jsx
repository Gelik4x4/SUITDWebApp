import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PodcastsPage.css';
import Breadcrumbs    from '../components/breadcrumbs/Breadcrumbs';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';
import PodcastCard    from '../components/podcasts/PodcastCard';
import PodcastDetail  from '../components/podcasts/PodcastDetail';
import { SHOWS }      from '@constants/podcastsData';

export default function PodcastsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const show = SHOWS.find(s => s.id === selected);

  // Скрываем таббар на всей странице подкастов
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  if (show) {
    return (
      <PodcastDetail
        show={show}
        onBack={() => setSelected(null)}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="podp-page podp-page--list">
      {/* Desktop */}
      <div className="podp-desktop-bc">
        <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Подкасты' },
        ]} />
      </div>

      {/* Mobile */}
      <MobilePageHeader title="Подкасты" backTo="/services" />

      <div className="podp-grid">
        {SHOWS.map(s => (
          <PodcastCard key={s.id} show={s} onClick={() => setSelected(s.id)} />
        ))}
      </div>
    </div>
  );
}
