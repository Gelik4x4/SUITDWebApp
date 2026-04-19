import React from 'react';
import './OnboardingSlide.css';

export default function OnboardingSlide({
  imageSrc,          
  title,
  subtitle,
  step,             
  totalSteps,
  onBack,
  onNext,
  nextLabel = 'Далее',
  isWelcome = false,
  onSkip,
}) {
  return (
    <div className={`ob-slide${isWelcome ? ' ob-slide--welcome' : ''}`}>
      <div className="ob-slide__left">
        <div className="ob-slide__image-wrap">
          <img src={imageSrc} alt="onboarding" className="ob-slide__image" />
        </div>
      </div>

      <div className="ob-slide__right">
        <div className="ob-slide__content">
          <h1 className="ob-slide__title" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="ob-slide__sub">{subtitle}</p>

          {(isWelcome || step === null) && (
            <div className="ob-slide__actions">
              <button className="ob-btn ob-btn--primary" onClick={onNext}>
                {nextLabel}
              </button>
              {onSkip && (
                <button className="ob-btn ob-btn--outline" onClick={onSkip}>
                  Пропустить
                </button>
              )}
            </div>
          )}

          {step !== null && (
            <div className="ob-slide__nav">
              <button className="ob-nav-link" onClick={onBack}>Назад</button>
              <div className="ob-dots">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span key={i} className={`ob-dot${i === step ? ' ob-dot--active' : ''}`} />
                ))}
              </div>
              <button className="ob-nav-link" onClick={onNext}>Далее</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}