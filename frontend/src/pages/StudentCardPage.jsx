import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@supabaseClient';
import './StudentCardPage.css';
import StudentCardView from '../components/studentcard/StudentCardView';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';

const fetchStudentData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { data, error } = await supabase
    .from('users')
    .select('first_name, middle_name, last_name, group_id, faculty, role, groups(name)')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  const fullName = [data.last_name, data.first_name, data.middle_name]
    .filter(Boolean)
    .join(' ');

  return {
    qualification: data.role ?? 'Студент',
    name:          fullName || '—',
    group:         data.groups?.name ?? '—',
    faculty:       data.faculty ?? '—',
    studentId:     null,   // появится позже
    birthDate:     null,   // появится позже
  };
};

export default function StudentCardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['studentCard'],
    queryFn: fetchStudentData,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div className="scp-page" />;
  if (error) return <div className="scp-page" style={{ color: 'red' }}>Ошибка загрузки</div>;

  return (
    <div className="scp-page">
      <MobilePageHeader title="Студенческий билет" backTo="/services" />
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => navigate('/services') },
        { label: 'Студенческий билет' },
      ]} />
      <StudentCardView data={data} />
    </div>
  );
}
