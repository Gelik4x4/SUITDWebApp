import { useState, useCallback } from 'react';
import SplashScreen    from './SplashScreen';
import OnboardingSlide from './OnboardingSlide';
import LoginScreen     from '../auth/LoginScreen';



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
      imageSrc="/src/assets/img/auth/welcome.png"          
      title="Добро пожаловать<br/>в SUITD students!"
      subtitle="Расписание, уведомления, новости, конкурсы и полезные сервисы в одном приложении."
      step={null} isWelcome
      onNext={next} onSkip={skip} nextLabel="Начать"
    />
  );

  if (step === S.OB1)  return (
    <OnboardingSlide
      imageSrc="/src/assets/img/auth/on-boarding-1.png"         
      title="Расписание —<br/>всегда под рукой"
      subtitle="Актуальное расписание занятий, аудитории и преподавателей."
      step={0} totalSteps={3} onBack={back} onNext={next}
    />
  );

  if (step === S.OB2)  return (
    <OnboardingSlide
      imageSrc="/src/assets/img/auth/on-boarding-2.png"  
      title="Не пропустите важное"
      subtitle="Приложение напомнит о парах, дедлайнах, экзаменах и событиях кафедры."
      step={1} totalSteps={3} onBack={back} onNext={next}
    />
  );

  if (step === S.OB3)  return (
    <OnboardingSlide
      imageSrc="/src/assets/img/auth/on-boarding-3.png"        
      title="Полезные сервисы<br/>для эффективности"
      subtitle="Мероприятия, стажировки, конкурсы и многое другое всегда рядом."
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