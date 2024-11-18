import Link from "next/link"
export default ({ currentuser }) => {
    const Links = [
        !currentuser && { label: "Sign Up", href: "/auth/signup" },
        !currentuser && { label: "Sign In", href: "/auth/signin" },

        currentuser && { label: 'Sell Tickets', href: "/tickets/new" },
        currentuser && {label: "My Orders", href:"/orders"},
        
        currentuser && { label: "Sign Out", href: "/auth/signout" },
    
    ].filter(linkconfig =>linkconfig).map((link,idx) => (
                    <li className=" text-blue-400 w-fit" key={idx}><Link href={link?.href}>{link.label}</Link></li>
            ))
    return <nav className="flex justify-between p-3 px-4 border-b">
        <Link href={"/"}>ticketBus
        </Link>
        <div className=" px-5">
            <ul className=" flex gap-5 " >
                {Links}
            </ul>
        </div>
    </nav>
}