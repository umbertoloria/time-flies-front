import {Outlet} from "react-router-dom";

export default function Root() {
  return (<>
      <h1 className="text-3xl font-bold underline">
          Hello world!
      </h1>
      <div>
          <Outlet/>
      </div>
  </>)
}
