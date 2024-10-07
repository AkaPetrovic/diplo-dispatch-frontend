import MainMenuItem from "./MainMenuItem";

interface Props {
  userRole: string | null;
}

const MainMenu = ({ userRole }: Props) => {
  if (userRole === "MANAGER")
    return (
      <>
        <h1 className="mb-3 animate-fade-in text-center text-3xl font-medium opacity-0 animation-delay-[775ms] animation-duration-300">
          Main menu
        </h1>
        <nav>
          <ul className="select-none list-none text-center">
            <li
              tabIndex={0}
              className="group relative mb-2 animate-slide-down-fade overflow-hidden rounded-[50px] bg-[rgba(255,255,255,0.5)] opacity-0 shadow backdrop-blur-md transition-all duration-300 animation-delay-[400ms] animation-duration-300 hover:bg-[rgba(225,225,225,0.5)] focus:rounded-3xl focus:bg-[rgba(225,225,225,0.5)]"
            >
              <div className="animate-fade-in cursor-pointer py-4 opacity-0 animation-delay-[600ms] animation-duration-300 group-focus:cursor-default">
                Drivers
              </div>

              <div className="grid grid-rows-animate-height-closed transition-all duration-300 group-focus:grid-rows-animate-height-open">
                <ul className="overflow-hidden px-5 text-left font-light">
                  <li className="mb-1">
                    <MainMenuItem action="Add" link="/driver/add" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Edit" link="/driver/edit" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Delete" link="/driver/delete" />
                  </li>
                  <li className="pb-4">
                    <MainMenuItem action="Find" link="/driver/find" />
                  </li>
                </ul>
              </div>
            </li>
            <li
              tabIndex={0}
              className="group mb-2 animate-slide-down-fade cursor-pointer overflow-hidden rounded-[50px] bg-[rgba(255,255,255,0.5)] opacity-0 shadow backdrop-blur-md transition-all duration-300 animation-delay-300 animation-duration-300 hover:bg-[rgba(225,225,225,0.5)] focus:rounded-3xl focus:bg-[rgba(225,225,225,0.5)]"
            >
              <div className="animate-fade-in cursor-pointer py-4 opacity-0 animation-delay-[500ms] animation-duration-300 group-focus:cursor-default">
                Trucks
              </div>

              <div className="grid grid-rows-animate-height-closed transition-all duration-300 group-focus:grid-rows-animate-height-open">
                <ul className="overflow-hidden px-5 text-left font-light">
                  <li className="mb-1">
                    <MainMenuItem action="Add" link="/truck/add" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Edit" link="/truck/edit" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Delete" link="/truck/delete" />
                  </li>
                  <li className="pb-4">
                    <MainMenuItem action="Find" link="/truck/find" />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </>
    );

  if (userRole === "DISPATCHER")
    return (
      <>
        <h1 className="mb-3 animate-fade-in text-center text-3xl font-medium opacity-0 animation-delay-[675ms] animation-duration-300">
          Main menu
        </h1>
        <nav>
          <ul className="select-none list-none text-center">
            <li
              tabIndex={0}
              className="group relative mb-2 animate-slide-down-fade overflow-hidden rounded-[50px] bg-[rgba(255,255,255,0.5)] opacity-0 shadow backdrop-blur-md transition-all duration-300 animation-delay-300 animation-duration-300 hover:bg-[rgba(225,225,225,0.5)] focus:rounded-3xl focus:bg-[rgba(225,225,225,0.5)]"
            >
              <div className="animate-fade-in cursor-pointer py-4 opacity-0 animation-delay-[500ms] animation-duration-300 group-focus:cursor-default">
                Truck Load
              </div>

              <div className="grid grid-rows-animate-height-closed transition-all duration-300 group-focus:grid-rows-animate-height-open">
                <ul className="overflow-hidden px-5 text-left text-lg font-light">
                  <li className="mb-1">
                    <MainMenuItem action="Add" link="/truck-load/add" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Edit" link="/truck-load/edit" />
                  </li>
                  <li className="mb-1">
                    <MainMenuItem action="Delete" link="/truck-load/delete" />
                  </li>
                  <li className="pb-4">
                    <MainMenuItem action="Find" link="/truck-load/find" />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </>
    );

  return null;
};

export default MainMenu;
