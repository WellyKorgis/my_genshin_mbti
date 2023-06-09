import React, { useCallback, useState } from 'react';
import './App.css';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import questionnaireData from './data/questionnaire.json';

const shuffleArray = (array) => {
  // Create a copy of the original array
  const shuffledArray = [...array];

  // Perform Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const App = () => {
  const [result, setResult] = useState('');
  const [showResultPage, setShowResultPage] = useState(false);

  const shuffledQuestions = shuffleArray(Object.entries(questionnaireData));

  const surveyJson = {
    title: 'Genshin MBTI Test',
    showProgressBar: 'bottom',
    firstPageIsStarted: true,
    startSurveyText: "Let's do it",
    pages: [
      {
        elements: [
          {
            type: 'html',
            html: 'Find your MBTI type and your Genshin character.',
          },
        ],
      },
      ...shuffledQuestions.map(([questionId, question]) => ({
        elements: [
          {
            type: 'radiogroup',
            name: questionId,
            title: question.text,
            isRequired: true,
            choices: Object.entries(question.answers).map(([answerId, answerText]) => ({
              value: answerId,
              text: answerText,
            })),
          },
        ],
      })),
    ],
    completedHtml: `You are <h3>${result}</h3>`,
  };

  const survey = new Model(surveyJson);

  const calculate = useCallback((data) => {
    const mbti = new Map([
      ['E', 0],
      ['I', 0],
      ['S', 0],
      ['N', 0],
      ['F', 0],
      ['T', 0],
      ['J', 0],
      ['P', 0],
    ]);

    Object.values(data).forEach((value) => {
      mbti[value]++;
    });

    const EI = mbti.get('E') > mbti.get('I') ? 'E' : 'I';
    const SN = mbti.get('S') > mbti.get('N') ? 'S' : 'N';
    const FT = mbti.get('F') > mbti.get('T') ? 'F' : 'T';
    const JP = mbti.get('J') > mbti.get('P') ? 'J' : 'P';

    return EI + SN + FT + JP;
  }, []);

  const surveyResults = useCallback((sender) => {
    const calculatedResult = calculate(sender.data);
    setResult(calculatedResult);
    setShowResultPage(true);
  }, [calculate]);

  survey.onComplete.add(surveyResults);

  return <Survey model={survey} id="surveyContainer" />;
};

export default App;
