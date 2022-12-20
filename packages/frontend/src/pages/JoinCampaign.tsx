import React from 'react';

import ChooseCampaign from '../components/ChooseCampaign';
import SetHabits from '../components/SetHabits';

interface State {
  step: number;
  selectedCampaign: string | null;
  habits: Array<string>;
}

const initialState: State = { step: 0, selectedCampaign: null, habits: [] };

const joinCampaignReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SELECT_CAMPAIGN':
      return {
        ...state,
        step: state.step + 1,
        selectedCampaign: action.payload.selectedCampaign,
      };
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload.habit],
      };
    case 'REMOVE_HABIT':
      const index = action.payload.habitIndex;
      const habitsLength = state.habits.length;
      const newHabits = [
        ...state.habits.slice(0, index),
        ...state.habits.slice(index + 1, habitsLength),
      ];
      return {
        ...state,
        habits: [...newHabits],
      };
    default:
      return { ...state };
  }
};

const JoinCampaign: React.FC<{}> = () => {
  const [state, dispatch] = React.useReducer(joinCampaignReducer, initialState);

  let stepContent = null;

  switch (state.step) {
    case 0:
      stepContent = (
        <ChooseCampaign
          selectedCampaign={state.selectedCampaign}
          dispatch={dispatch}
        />
      );
      break;
    case 1:
      stepContent = <SetHabits habits={state.habits} dispatch={dispatch} />;
      break;
  }
  return (
    <div className="min-page-height bg-base-200 p-8 flex flex-col justify-start items-center">
      <ul className="steps">
        <li className="step step-secondary">Choose a Campaign</li>
        <li className="step">Set habits</li>
        <li className="step">Stake coins</li>
        <li className="step">Confirm</li>
      </ul>
      <div className="py-8 w-full">{stepContent}</div>
    </div>
  );
};

export default JoinCampaign;
