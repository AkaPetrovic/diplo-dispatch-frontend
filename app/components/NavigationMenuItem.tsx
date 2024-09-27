import NavigationMenuItemOption from "./NavigationMenuItemOption";

interface Props {
  item: String;
}

const NavigationMenuItem = ({ item }: Props) => {
  return (
    <li className="h-full">
      <div
        tabIndex={0}
        className="peer flex h-full w-36 select-none items-center justify-center rounded-none border-none bg-[rgba(255,255,255,0.5)] text-base font-light text-gray-950 shadow-none backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)]"
      >
        {item}
      </div>
      <div className="grid grid-rows-animate-height-closed transition-all duration-200 hover:grid-rows-animate-height-open peer-hover:grid-rows-animate-height-open">
        <ul className="w-36 grid-rows-animate-height-closed overflow-hidden rounded-none shadow">
          <NavigationMenuItemOption
            action="Add"
            link={`/${item.toLowerCase().trim().replace(" ", "-")}/add`}
          />
          <NavigationMenuItemOption
            action="Edit"
            link={`/${item.toLowerCase().trim().replace(" ", "-")}/edit`}
          />
          <NavigationMenuItemOption
            action="Delete"
            link={`/${item.toLowerCase().trim().replace(" ", "-")}/delete`}
          />
          <NavigationMenuItemOption
            action="Find"
            link={`/${item.toLowerCase().trim().replace(" ", "-")}/find`}
          />
        </ul>
      </div>
    </li>
  );
};

export default NavigationMenuItem;
