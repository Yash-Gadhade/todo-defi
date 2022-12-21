import React from 'react';
import { useContractRead } from 'wagmi';
import { ethers } from 'ethers';

import ChooseCampaign from '../components/ChooseCampaign';
import SetHabits from '../components/SetHabits';
import Review from '../components/Review';
import DepositTokensAndStart from '../components/DepositTokensAndStart';
import { Campaign } from '../types';
import HabitAppJson from '../assets/HabitApp.json';
import { CONTRACT_ADDRESS } from '../config';

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
    case 'GO_TO_REVIEW':
      return {
        ...state,
        step: state.step + 1,
      };
    case 'START_CAMPAIGN':
      return {
        ...state,
        step: state.step + 1,
      };
    default:
      return { ...state };
  }
};

const JoinCampaign: React.FC<{}> = () => {
  const [state, dispatch] = React.useReducer(joinCampaignReducer, initialState);

  const [campaigns, setCampaigns] = React.useState<Array<Campaign>>([]);

  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: HabitAppJson.abi,
    functionName: 'getCampaigns',
  });
  React.useEffect(() => {
    if (data) {
      console.log(data);
      const parsedData = (data as Campaign[]).map((campaign) => {
        return {
          ...campaign,
          name: ethers.utils.parseBytes32String(campaign.name),
        };
      });
      setCampaigns(parsedData as Campaign[]);
    }
  }, [data]);

  let stepContent = null;

  switch (state.step) {
    case 0:
      stepContent = (
        <ChooseCampaign
          selectedCampaign={state.selectedCampaign}
          dispatch={dispatch}
          campaigns={campaigns}
        />
      );
      break;
    case 1:
      stepContent = <SetHabits habits={state.habits} dispatch={dispatch} />;
      break;
    case 2:
      stepContent = (
        <Review
          habits={state.habits}
          selectedCampaign={state.selectedCampaign}
          dispatch={dispatch}
          campaigns={campaigns}
        />
      );
      break;
    case 3:
      stepContent = (
        <DepositTokensAndStart
          habits={state.habits}
          selectedCampaign={state.selectedCampaign}
          dispatch={dispatch}
          campaigns={campaigns}
        />
      );
      break;
  }
  return (
    <div className="min-page-height bg-base-200 p-8 flex flex-col justify-start items-center">
      <ul className="steps">
        <li className={`step ${state.step >= 0 ? 'step-secondary' : ''}`}>
          Choose a Campaign
        </li>
        <li className={`step ${state.step >= 1 ? 'step-secondary' : ''}`}>
          Set habits
        </li>
        <li className={`step ${state.step >= 2 ? 'step-secondary' : ''}`}>
          Review
        </li>
        <li className={`step ${state.step >= 3 ? 'step-secondary' : ''}`}>
          Start your journey
        </li>
      </ul>
      <div className="py-8 w-full">{stepContent}</div>
    </div>
  );
};

export default JoinCampaign;
