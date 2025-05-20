import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

export const Leaderboard = () => {
  // Generate 20 fake rows
  const fakeRows = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    totalVotes: Math.floor(Math.random() * 100),
    totalPoints: Math.floor(Math.random() * 1000),
  }));

  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
        <span className="text-white text-4xl font-bold">Coming Soon</span>
      </div>

      {/* Table */}
      <Table className="relative z-0 bg-black-40">
        {/* Fake Headers */}
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Total Votes</TableHead>
            <TableHead>Total Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fakeRows.map((row, index) => (
            <TableRow
              key={row.id}
              className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-900"}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.totalVotes}</TableCell>
              <TableCell>{row.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
