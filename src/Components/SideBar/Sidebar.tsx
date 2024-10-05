interface Props {
  data: any;
  onClose: () => void;
}

const Sidebar = ({ data, onClose }: Props) => {
  return (
    <aside className="absolute flex flex-col  w-[400px] px-5 -top-12 z-20 bottom-0 right-0 bg-white border-l shadow-lg">
      <div className="border-b">
        <div className="flex justify-between py-2">
          <h3 className="w-full font-bold">{data.strMeal}</h3>

          <span
            onClick={onClose}
            className="material-icons text-sm cursor-pointer font-bold rounded-full border w-6 h-5 text-center hover:bg-gray-400"
          >
            close
          </span>
        </div>
      </div>

      <div className="overflow-y-auto space-y-5 mt-5 text-xs pb-16">
        <div>
          <img
            width={400}
            height={400}
            src={data.strMealThumb}
            alt={data.strMeal}
          />
        </div>

        <div className="flex flex-wrap space-x-1 ">
          {data.strTags?.split(",")?.map((tag: string) => (
            <div
              key={tag}
              className="px-5 py-1 border-2 border-violet-900 rounded-full w-fit bg-violet-300"
            >
              {tag}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <div>Category</div>
          <div>{data.strCategory}</div>

          <div>Area</div>
          <div>{data.strArea}</div>

          <div>Youtube</div>
          <a
            href={data.strYoutube}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline  break-all"
          >
            {data.strYoutube}
          </a>

          <div>Recipe</div>

          <a
            href={data.strSource}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline  break-all"
          >
            {data.strSource}
          </a>
        </div>

        <div className="border-2 p-2 space-y-5">
          <h4 className="text-sm font-bold">Instructions</h4>
          <p>{data.strInstructions}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
