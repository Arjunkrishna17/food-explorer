import React from "react";

const Sidebar = ({ data, onClose }) => {
  console.log(data.strTag?.split(","));
  return (
    <aside className="absolute flex flex-col  w-[400px] px-5 top-0 z-20 bottom-0 right-0 bg-white border-l">
      <div className="border-b">
        <div className="flex justify-between py-2">
          <h3 className="w-full">{data.strMeal}</h3>
          <span
            onClick={onClose}
            className="material-icons text-sm cursor-pointer"
          >
            close
          </span>
        </div>
      </div>

      <div className="overflow-y-auto space-y-3 mt-5 text-xs">
        <div>
          <img src={data.strMealThumb} alt={data.strMeal} />
        </div>

        <div className="flex flex-wrap space-x-1 ">
          {data.strTags?.split(",")?.map((tag) => (
            <div className="px-5 py-1 border-2 border-violet-900 rounded-full w-fit bg-violet-300">
              {tag}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <div>Category</div>
          <div>{data.strCategory}</div>

          <div>Area</div>
          <div>{data.strArea}</div>

          <div>Youtube</div>
          <div>{data.strYoutube}</div>

          <div>Recipe</div>
          <div>{data.strSource}</div>
        </div>

        <div className="border-2 p-2">{data.strInstructions}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
