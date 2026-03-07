import React, { useState, useEffect, useCallback } from 'react';
import DirectorProgressBar from '../director/DirectorProgressBar';
import Step1Character from '../director/Step1Character';
import Step2Wardrobe from '../director/Step2Wardrobe';
import Step3Location from '../director/Step3Location';
import Step4SceneCompose from '../director/Step4SceneCompose';
import Step5DirectShot from '../director/Step5DirectShot';
import Step6GenerateVideo from '../director/Step6GenerateVideo';
import Step7Timeline from '../director/Step7Timeline';

export default function DirectorModule({ characters }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timelineClips, setTimelineClips] = useState([]);

  // Step data
  const [characterData, setCharacterData] = useState(null);
  const [wardrobeData, setWardrobeData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [composedData, setComposedData] = useState(null);
  const [shotData, setShotData] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const completeStep = useCallback((step, data) => {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step]);
    setCurrentStep(step + 1);
    if (step === 1) setCharacterData(data);
    else if (step === 2) setWardrobeData(data);
    else if (step === 3) setLocationData(data);
    else if (step === 4) setComposedData(data);
    else if (step === 5) setShotData(data);
    else if (step === 6) {
      setVideoData(data);
      setTimelineClips(prev => [...prev, { url: data.video_url, duration: 5 }]);
    }
  }, []);

  const goBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const handleStepClick = useCallback((step) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    }
  }, [completedSteps, currentStep]);

  const handleAddNewScene = () => {
    // Reset all steps except character — keep the same character
    setWardrobeData(null);
    setLocationData(null);
    setComposedData(null);
    setShotData(null);
    setVideoData(null);
    setCompletedSteps(prev => prev.filter(s => s === 1));
    setCurrentStep(2); // Skip character step, start at wardrobe
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        // Handled by parent
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Character
            savedCharacters={characters || []}
            onComplete={(data) => completeStep(1, data)}
          />
        );
      case 2:
        return (
          <Step2Wardrobe
            character={characterData}
            onComplete={(data) => completeStep(2, data)}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <Step3Location
            character={characterData}
            wardrobe={wardrobeData}
            onComplete={(data) => completeStep(3, data)}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <Step4SceneCompose
            character={characterData}
            wardrobe={wardrobeData}
            location={locationData}
            onComplete={(data) => completeStep(4, data)}
            onBack={goBack}
          />
        );
      case 5:
        return (
          <Step5DirectShot
            character={characterData}
            wardrobe={wardrobeData}
            location={locationData}
            composed={composedData}
            onComplete={(data) => completeStep(5, data)}
            onBack={goBack}
          />
        );
      case 6:
        return (
          <Step6GenerateVideo
            shot={shotData}
            character={characterData}
            wardrobe={wardrobeData}
            location={locationData}
            onComplete={(data) => completeStep(6, data)}
            onBack={goBack}
          />
        );
      case 7:
        return (
          <Step7Timeline
            clips={timelineClips}
            onAddNewScene={handleAddNewScene}
            onExport={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <DirectorProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'opacity 0.25s ease' }}>
        {renderStep()}
      </div>
    </div>
  );
}