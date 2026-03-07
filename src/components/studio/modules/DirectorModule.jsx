import React, { useState } from 'react';
import DirectorProgressBar from '@/components/studio/director/DirectorProgressBar';
import Step1Character from '@/components/studio/director/Step1Character';
import Step2Wardrobe from '@/components/studio/director/Step2Wardrobe';
import Step3Location from '@/components/studio/director/Step3Location';
import Step4SceneCompose from '@/components/studio/director/Step4SceneCompose';
import Step5DirectShot from '@/components/studio/director/Step5DirectShot';
import Step6GenerateVideo from '@/components/studio/director/Step6GenerateVideo';
import Step7Timeline from '@/components/studio/director/Step7Timeline';

export default function DirectorModule({ characters, locations, activeScene, onGenerateScene, isGenerating, generationProgress }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [character, setCharacter] = useState(null);
  const [wardrobe, setWardrobe] = useState(null);
  const [location, setLocation] = useState(null);
  const [composed, setComposed] = useState(null);
  const [shot, setShot] = useState(null);
  const [clips, setClips] = useState([]);

  const completeStep = (step, data) => {
    setCompletedSteps(prev => [...new Set([...prev, step])]);
    setCurrentStep(step + 1);
    return data;
  };

  const goToStep = (step) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      <DirectorProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {currentStep === 1 && (
          <Step1Character
            savedCharacters={characters}
            onComplete={(data) => {
              setCharacter(data);
              completeStep(1, data);
            }}
          />
        )}
        {currentStep === 2 && (
          <Step2Wardrobe
            character={character}
            onComplete={(data) => {
              setWardrobe(data);
              completeStep(2, data);
            }}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Location
            character={character}
            wardrobe={wardrobe}
            onComplete={(data) => {
              setLocation(data);
              completeStep(3, data);
            }}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4SceneCompose
            character={character}
            wardrobe={wardrobe}
            location={location}
            onComplete={(data) => {
              setComposed(data);
              completeStep(4, data);
            }}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5DirectShot
            character={character}
            wardrobe={wardrobe}
            location={location}
            composed={composed}
            onComplete={(data) => {
              setShot(data);
              completeStep(5, data);
            }}
            onBack={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 6 && (
          <Step6GenerateVideo
            shot={shot}
            character={character}
            wardrobe={wardrobe}
            location={location}
            onComplete={(data) => {
              setClips(prev => [...prev, { url: data.video_url, duration: 5 }]);
              completeStep(6, data);
            }}
            onBack={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 7 && (
          <Step7Timeline
            clips={clips}
            onAddNewScene={() => {
              setCurrentStep(1);
              setCompletedSteps([]);
              setCharacter(null);
              setWardrobe(null);
              setLocation(null);
              setComposed(null);
              setShot(null);
            }}
            onExport={() => {}}
          />
        )}
      </div>
    </div>
  );
}