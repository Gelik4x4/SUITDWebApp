import { useState, useCallback } from 'react';
import SplashScreen    from './SplashScreen';
import OnboardingSlide from './OnboardingSlide';
import LoginScreen     from '../auth/LoginScreen';

import welcomeImage from '@/assets/img/auth/welcome.png';
import onboarding1Image from '@/assets/img/auth/On-Boarding-1.png';
import onboarding2Image from '@/assets/img/auth/On-Boarding-2.png';
import onboarding3Image from '@/assets/img/auth/On-Boarding-3.png';



const S = {
  SPLASH:    0,
  WELCOME:   1,
  OB1:       2,
  OB2:       3,
  OB3:       4,
  LOGIN:     5,
  REGISTER:  6,
  ACCESS:    7,
};

export default function OnboardingFlow({ onDone }) {
  const [step, setStep] = useState(S.SPLASH);

  const go    = useCallback((s) => setStep(s), []);
  const next  = useCallback(() => setStep(s => s + 1), []);
  const back  = useCallback(() => setStep(s => Math.max(s - 1, S.WELCOME)), []);
  const skip  = useCallback(() => setStep(S.LOGIN), []);

  if (step === S.SPLASH)   return <SplashScreen onDone={next} />;

  if (step === S.WELCOME)  return (
    <OnboardingSlide
      imageSrc={welcomeImage}          
      title="Добро пожаловать<br/>в ЦАТ students!"
      subtitle="Единый сервис для учёбы, карьеры и студенческой жизни"
      step={null} isWelcome
      onNext={next} onSkip={skip} nextLabel="Начать"
    />
  );

  if (step === S.OB1)  return (
    <OnboardingSlide
      imageSrc={onboarding1Image}         
      title="Расписание<br/>всегда под рукой"
      subtitle="Актуальное расписание занятий, аудитории и преподавателей"
      step={0} totalSteps={3} onBack={back} onNext={next}
    />
  );

  if (step === S.OB2)  return (
    <OnboardingSlide
      imageSrc={onboarding2Image}  
      title="Не пропустите важное"
      subtitle="Напомним о парах, дедлайнах и важных событиях вовремя"
      step={1} totalSteps={3} onBack={back} onNext={next}
    />
  );

  if (step === S.OB3)  return (
    <OnboardingSlide
      imageSrc={onboarding3Image}        
      title="Больше, чем просто учёба"
      subtitle="Конкурсы, стажировки и материалы для профессионального роста – прямо в ленте"
      step={2} totalSteps={3} onBack={back} onNext={next}
    />
  );

  if (step === S.LOGIN) return (
    <LoginScreen
      onLogin={onDone}
      // onGoRegister={() => go(S.REGISTER)}
    />
  );

  // if (step === S.REGISTER) return (
  //   <RegisterScreen
  //     onRegister={() => go(S.ACCESS)}
  //     onGoLogin={() => go(S.LOGIN)}
  //   />
  // );

  // if (step === S.ACCESS) return (
  //   <AccessScreen
  //     onConfirm={onDone}
  //     onCancel={onDone}
  //   />
  // );

  return null;
}