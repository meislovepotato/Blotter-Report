"use client";

const StatCard = ({ value, label, icon }) => {
  return (
    <div className="flex flex-col h-full w-full gap-2 select-none">
      <div className="flex-1 w-full flex flex-row justify-center items-start">
        <div className=" w-full h-full justify-between">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm">{label}</p>
        </div>
        <div className="h-full aspect-square p-1 ">
          <div className="flex bg-accent/20 h-full aspect-auto justify-center items-center rounded-full shadow-2xl shadow-primary/25 *:text-text">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
