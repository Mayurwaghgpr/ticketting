import buildClient from "../apis/build-client";
import Link from "next/link";
const LandingPage = ({ currentuser, tickets }) => {
  const ticketList = tickets?.map((ticket) => (
    <tr
      key={ticket.id}
      className="border-b border-gray-200 hover:bg-gray-100 transition"
    >
      <td className="px-4 py-2 text-gray-700">{ticket.title}</td>
      <td className="px-4 py-2 text-gray-700">{ticket.price}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link></td>
    </tr>
  ));

  return (
    <div className="container mx-auto px-4 py-8 flex items-center flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket List</h2>
      <table className="table-auto w-full max-w-[50rem] border-collapse border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Price</th>
             <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, current) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
