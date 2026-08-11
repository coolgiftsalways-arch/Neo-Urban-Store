import {

FiBell,

FiSearch,

FiUser,

} from "react-icons/fi";

import "../styles/topbar.css";

export default function Topbar() {

return (

<header className="topbar">

<div className="search-box">

<FiSearch />

<input

type="text"

placeholder="Search..."

/>

</div>

<div className="topbar-right">

<button>

<FiBell />

</button>

<div className="profile">

<FiUser />

<span>

Admin

</span>

</div>

</div>

</header>

);

}