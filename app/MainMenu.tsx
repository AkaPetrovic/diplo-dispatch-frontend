interface Props {
  userRole: String | null;
}

const MainMenu = ({ userRole }: Props) => {
  if (userRole === "MANAGER")
    return (
      <nav>
        <ul className="list-none text-center">
          <li
            tabIndex={0}
            className="group mb-2 animate-slide-down-fade cursor-pointer overflow-hidden rounded-[50px] bg-[rgba(255,255,255,0.5)] opacity-0 shadow backdrop-blur-md transition-all duration-300 animation-delay-300 animation-duration-300 hover:bg-[rgba(225,225,225,0.5)] focus:rounded-3xl focus:bg-[rgba(225,225,225,0.5)]"
          >
            <div className="py-4">Drivers</div>

            <div className="grid grid-rows-animate-height-closed transition-all duration-300 group-focus:grid-rows-animate-height-open">
              <ul className="overflow-hidden px-5 text-left font-extralight">
                <li>Item 1</li>
                <li>Item 2</li>
                <li className="pb-4">Item 3</li>
              </ul>
            </div>
          </li>
          <li
            tabIndex={0}
            className="group mb-2 animate-slide-down-fade cursor-pointer overflow-hidden rounded-[50px] bg-[rgba(255,255,255,0.5)] opacity-0 shadow backdrop-blur-md transition-all duration-300 animation-delay-300 animation-duration-300 hover:bg-[rgba(225,225,225,0.5)] focus:rounded-3xl focus:bg-[rgba(225,225,225,0.5)]"
          >
            <div className="py-4">Trucks</div>

            <div className="grid grid-rows-animate-height-closed transition-all duration-300 group-focus:grid-rows-animate-height-open">
              <ul className="overflow-hidden px-5 text-left font-extralight">
                <li>Item 1</li>
                <li>Item 2</li>
                <li className="pb-4">Item 3</li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    );

  if (userRole === "DISPATCHER")
    return (
      <nav>
        <ul className="list-none">
          <li className="glass">Truck Loads</li>
        </ul>
      </nav>
    );

  return null;
};

export default MainMenu;
