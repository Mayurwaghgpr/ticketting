import Router from "next/router";
import useRequest from "../../hooks/use-request";
const TicketShow = ({ ticket }) => {
  console.log(ticket);
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      // console.log(order)
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  return (
    <div className=" container flex gap-3 flex-col text-2xl border-collapse border size-fit my-10 p-3">
      <h1>{ticket.title}</h1>
      <h2> price: {ticket.price}</h2>
      {errors}
      <button
        onClick={() => doRequest()}
        className=" bg-sky-300 p-2 rounded-lg"
      >
        purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
