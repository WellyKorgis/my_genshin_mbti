import React, { useCallback } from 'react';
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
            html:
              'Find your MBTI type and your Genshin character.',
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
    completedHtml: '<h4>You completed the quiz.</h4>',
  };

  const survey = new Model(surveyJson);
  const surveyResults = useCallback((sender) => {
    const results =JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(surveyResults);

  return <Survey model={survey} id="surveyContainer" />;
};

export default App;
