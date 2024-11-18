jest.doMock("razorpay", () => {
  return jest.fn(() => ({
    customers: {
      create: jest.fn(() =>
        Promise.resolve({
          id: "cust_123", // Mocked customer ID
          name: "Jest_User", // Mocked name
          currency: "sgd", // Mocked currency
          description: "Jest User Account created", // Mocked description
        })
      ),
    },
    orders: {
      create: jest.fn(() =>
        Promise.resolve({
          id: "7JS8SH", // Mocked order ID
        })
      ),
      fetchPayments: jest.fn(() =>
        Promise.resolve([
          // Mocked payment response
          {
            entity: "collection",
            count: 1,
            items: [
              {
                id: "pay_DaaSOvhgcOfzgR", // Mocked payment ID
                entity: "payment",
                amount: 2200, // Mocked amount in cents
                currency: "INR", // Mocked currency
              },
            ],
          },
        ])
      ),
    },
    subscriptions: {
      fetch: jest.fn(() =>
        Promise.resolve({
          id: "sub_00000000000001", // Mocked subscription ID
          entity: "subscription",
          plan_id: "plan_00000000000001", // Mocked plan ID
        })
      ),
      cancel: jest.fn(() =>
        Promise.resolve({
          id: "sub_00000000000001", // Mocked subscription ID for cancellation
          entity: "subscription",
        })
      ),
    },
  }));
});
