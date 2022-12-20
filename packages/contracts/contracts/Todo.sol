// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Habit {
    uint256 public numberOfDays;
    // mapping from user address to number of days completed
    mapping(address => uint) public daysCompleted;

    // mapping from user address to deposit amount
    mapping(address => uint) public deposits;

    // event for when a user completes a habit
    event HabitCompleted(address user, uint daysCompleted);

    // function to start a habit campaign and make a deposit
    function startHabit(uint _deposit) public payable {
        require(_deposit > 0, "Deposit must be greater than 0");
        deposits[msg.sender] = _deposit;
        daysCompleted[msg.sender] = 0;
    }

    // function to record a day of habit completion
    function completeHabit() public {
        require(
            deposits[msg.sender] > 0,
            "You must start a habit before completing one"
        );
        daysCompleted[msg.sender]++;
        if (daysCompleted[msg.sender] == numberOfDays) {
            // trigger event if user has completed set number of days
            emit HabitCompleted(msg.sender, daysCompleted[msg.sender]);
        }
    }

    // function to withdraw deposit
    function withdraw() public {
        require(
            daysCompleted[msg.sender] > 0 && daysCompleted[msg.sender] <= numberOfDays,
            "You must have started a habit to request a refund"
        );
        uint refundAmount;
        if (daysCompleted[msg.sender] == numberOfDays) {
            refundAmount = deposits[msg.sender];
        } else {
            uint balanceAmount =
                (daysCompleted[msg.sender] / numberOfDays) *
                deposits[msg.sender];
            refundAmount = deposits[msg.sender] - balanceAmount;
        }
        payable(msg.sender).transfer(refundAmount);
        deposits[msg.sender] = 0;
        daysCompleted[msg.sender] = 0;
        // todo : send balance amount to smart contract wallet to be distributed among the people who complete the streak
    }

    // function to refund a partially completed habit

    // function refund() public {
    //     require(
    //         daysCompleted[msg.sender] > 0 && daysCompleted[msg.sender] < numberOfDays,
    //         "You must have started a habit and not completed it to request a refund"
    //     );
    //     uint refundAmount = deposits[msg.sender] - (numberOfDays - daysCompleted[msg.sender]);
    //     payable(msg.sender).transfer(refundAmount);
    //     deposits[msg.sender] = 0;
    //     daysCompleted[msg.sender] = 0;
    // }
}
