import React from "react";

const RemindersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes / Reminders</h1>
      <p>Here you can keep track of your admin tasks, notes, and reminders.</p>
      <ul className="list-disc ml-6 mt-4 text-gray-700">
        <li>Add, edit, or remove your important admin notes here.</li>
        <li>Set reminders for upcoming tasks or deadlines.</li>
        <li>Stay organized and never miss an important update!</li>
      </ul>
    </div>
  );
};

export default RemindersPage;
