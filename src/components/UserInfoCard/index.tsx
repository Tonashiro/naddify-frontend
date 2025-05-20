import { Medal, Stars } from "lucide-react";
import React from "react";

interface IUserInfoCard {
  totalVotes: number;
  points: number;
}

export const UserInfoCard: React.FC<IUserInfoCard> = ({
  totalVotes,
  points,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-10 items-center bg-gradient-to-b from-purple-900 to-gray-900 p-6 rounded-lg shadow-md max-w-xl">
      {/* Total Votes Section */}
      <div className="flex items-center text-center text-white gap-4">
        <Medal className="w-14 h-14 text-purple-400" />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Total Votes</h3>
          <p className="text-2xl font-bold">{totalVotes}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px sm:w-px sm:h-14 bg-purple-800/70"></div>

      {/* Points Section */}
      <div className="flex items-center text-center text-white gap-4">
        <Stars className="w-14 h-14 text-purple-400" />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Earned Points</h3>
          <p className="text-2xl font-bold">{points}</p>
        </div>
      </div>
    </div>
  );
};
