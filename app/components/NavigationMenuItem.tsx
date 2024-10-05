import Link from "next/link";
import NavigationMenuItemOption from "./NavigationMenuItemOption";

interface Props {
  item: String;
  options: String[];
  isLink: boolean;
  link?: String;
}

const NavigationMenuItem = ({ item, options, isLink, link }: Props) => {
  return (
    <li className="h-full">
      {isLink && link ? (
        <div
          tabIndex={0}
          className="peer flex h-full w-36 select-none items-center justify-center rounded-none border-none bg-[rgba(255,255,255,0.5)] text-base font-light text-gray-950 shadow-none backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)] hover:shadow"
        >
          <Link
            href={`${link}`}
            className="flex h-full w-full items-center justify-center"
          >
            {item}
          </Link>
        </div>
      ) : (
        <div
          tabIndex={0}
          className="peer flex h-full w-36 select-none items-center justify-center rounded-none border-none bg-[rgba(255,255,255,0.5)] text-base font-light text-gray-950 shadow-none backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)] hover:shadow"
        >
          {item}
        </div>
      )}
      <div className="grid grid-rows-animate-height-closed transition-all duration-200 hover:grid-rows-animate-height-open peer-hover:grid-rows-animate-height-open">
        <ul className="w-36 grid-rows-animate-height-closed overflow-hidden rounded-none shadow">
          {options.map((option, index) => (
            <NavigationMenuItemOption
              key={index}
              action={option}
              link={`/${item.toLowerCase().trim().replace(" ", "-")}/${option.toLowerCase()}`}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

export default NavigationMenuItem;
