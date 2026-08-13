import Sidebar from "./Sidebar";


import "../styles/admin.css";

export default function AdminLayout({

children,

}) {

return (

<div className="admin-layout">

<Sidebar />

<div className="admin-main">


<div className="admin-content">

{children}

</div>

</div>

</div>

);

}