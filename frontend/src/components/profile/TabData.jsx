import { useNavigate } from 'react-router-dom'; 
import { useQuery } from '@tanstack/react-query';
import './TabData.css';
import ProfileField from './ProfileField';

import { supabase } from '@supabaseClient';


const fetchUserProfile = async () => {
  // 1. Получаем ID залогиненного пользователя из сессии
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 2. Запрашиваем данные из таблицы 'users'
  const { data, error } = await supabase
    .from('users')
    .select(`
      first_name, 
      last_name, 
      email,
      groups (name)
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Ошибка получения профиля:', error.message);
    return null;
  }

  return data;
};


export default function TabData() {
  const navigate = useNavigate()
  // 1. Получаем данные через React Query
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;
  if (!userProfile) return <div>Профиль не найден</div>;

  // 2. Отображаем данные напрямую из userProfile
  return (
    <div className="tab-data">
      <div className="tab-data__fields">
        <ProfileField 
          label="Имя" 
          value={userProfile.first_name || 'Имя'} 
          readOnly
        />
        <ProfileField 
          label="Фамилия" 
          value={userProfile.last_name || 'Фамилия'} 
          readOnly 
        />
        <ProfileField 
          label="Номер группы" 
          value={userProfile.groups?.name || 'Группа'} 
          readOnly 
        />
        <ProfileField 
          label="Почта" 
          value={userProfile.email || 'Адрес эл. почты'} 
          type="email" 
          readOnly 
        />
      </div>

      <div className="tab-data__actions">
        <button 
          className="btn btn--primary"
          onClick={() => navigate('/change-password')}
        >
          Сменить пароль
        </button>
      </div>
    </div>
  );
}
