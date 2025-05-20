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
    <div className="flex justify-between items-center bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-md">
      {/* Total Votes Section */}
      <div className="flex flex-col items-center text-center text-white">
        <Medal className="text-4xl text-teal-400 mb-2" />
        <h3 className="text-lg font-semibold">Total Votes</h3>
        <p className="text-2xl font-bold">{totalVotes}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-16 bg-gray-700"></div>

      {/* Points Section */}
      <div className="flex flex-col items-center text-center text-white">
        <Stars className="text-4xl text-teal-400 mb-2" />
        <h3 className="text-lg font-semibold">Earned Points</h3>
        <p className="text-2xl font-bold">{points}</p>
      </div>
    </div>
  );
};
