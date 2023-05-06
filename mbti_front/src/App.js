import React from 'react';
import './App.css';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import questionnaireData from './data/questionnaire.json';

const App = () => {
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
      ...Object.entries(questionnaireData).map(([questionId, question]) => ({
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

  return <Survey model={survey} id="surveyContainer" />;
};

export default App;
