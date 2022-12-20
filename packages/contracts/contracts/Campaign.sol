// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaign {
    struct UserCampaign {
        bytes32 name;
        uint256 duration;
        uint256 noOfDaysLeft;
        string[] habits;
    }

    UserCampaign public campaign;

    address private _owner;
    uint256 private _fundsLocked;
    uint256 private _fundsClaimable;

    // store the current date and the address of the last transaction
    uint256 private _currentDate;

    constructor(
        string[] memory habits,
        bytes32 name,
        uint256 duration,
        address owner
    ) {
        campaign.name = name;
        campaign.habits = habits;
        campaign.duration = duration;
        campaign.noOfDaysLeft = duration;
        _owner = owner;

        _currentDate = block.timestamp / 86400; // divide by number of seconds in a day to get current date
    }

    receive() external payable {
        _fundsLocked += msg.value;
    }

    function withdrawClaimableFunds(uint256 amount) external {
        require(
            amount <= _fundsClaimable,
            "You don't have enough funds to withdraw"
        );

        uint256 fundsAvailable = _fundsClaimable;
        _fundsClaimable -= amount;

        payable(_owner).transfer(fundsAvailable);
    }

    function markHabitsDoneToday(uint256 noOfHabitsDoneToday) external {
        // check if the last transaction is being made another day
        require(
            _currentDate != block.timestamp / 86400,
            "You can only mark done once per day"
        );
        require(campaign.noOfDaysLeft > 0, "This campaign has ended");
        require(
            noOfHabitsDoneToday <= campaign.habits.length,
            "Invalid noOfHabitsDoneToday"
        );

        // update the current date and last transaction address
        _currentDate = block.timestamp / 86400;

        if (campaign.noOfDaysLeft == 1) {
            _fundsClaimable += _fundsLocked;
        } else {
            uint256 fundsUnlocked = _fundsLocked /
                (campaign.noOfDaysLeft * noOfHabitsDoneToday);
            _fundsLocked -= fundsUnlocked;
            _fundsClaimable += fundsUnlocked;
        }

        campaign.noOfDaysLeft--;
    }
}
