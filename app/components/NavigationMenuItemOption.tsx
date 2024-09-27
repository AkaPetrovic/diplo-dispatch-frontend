import Link from "next/link";

interface Props {
  action: String;
  link: String;
}

const NavigationMenuItemOption = ({ action, link }: Props) => {
  return (
    <li className="bg-[rgba(255,255,255,0.5)] text-center hover:bg-[rgba(225,225,225,0.5)]">
      <Link href={`${link}`} className="block h-full w-full px-4 py-2">
        {action}
      </Link>
    </li>
  );
};

export default NavigationMenuItemOption;
