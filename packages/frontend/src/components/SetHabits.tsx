import React, { SyntheticEvent } from 'react';

interface Props {
  habits: Array<string>;
  dispatch: any;
}

const SetHabits: React.FC<Props> = ({ habits, dispatch }) => {
  console.log(habits);
  const addHabit = (event: SyntheticEvent) => {
    event.preventDefault();

    const { habit } = event.target as HTMLFormElement;

    dispatch({
      type: 'ADD_HABIT',
      payload: {
        habit: habit.value,
      },
    });

    (event.target as HTMLFormElement).reset();
  };

  const removeHabit = (habitIndex: number) => {
    dispatch({
      type: 'REMOVE_HABIT',
      payload: {
        habitIndex,
      },
    });
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <form className="form-control w-full max-w-lg" onSubmit={addHabit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Write a habit you'd like to form..."
            className="input input-bordered input-primary w-full input-lg"
            name="habit"
            id="habit"
            required
          />
          <button className="btn btn-square btn-lg" type="submit">
            Add
          </button>
        </div>
      </form>
      <div className="overflow-x-auto mt-8 w-full max-w-lg">
        <table className="table w-full table-zebra">
          <tbody>
            {habits.map((habit: string, index: number) => {
              return (
                <tr key={index} className="hover">
                  <td>{index + 1}</td>
                  <td>{habit}</td>
                  <td className="text-right">
                    <button
                      className="btn btn-error btn-xs btn-circle"
                      onClick={() => removeHabit(index)}
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-wide btn-primary mt-24"
        onClick={() => dispatch({ type: 'GO_TO_REVIEW' })}
      >
        Submit
      </button>
    </div>
  );
};

export default SetHabits;
