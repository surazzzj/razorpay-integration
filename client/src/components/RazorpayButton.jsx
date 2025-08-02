import axios from "axios";

const RazorpayButton = () => {
  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order from backend
      const { data } = await axios.post("http://localhost:4000/api/payment/create-order", {
        amount: 500  // ₹500
      });

      if (!data || !data.order) {
        console.error("Order creation failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Make sure this env variable is set in Vite
        amount: data.order.amount,
        currency: "INR",
        name: "My App",
        description: "Test Payment",
        order_id: data.order.id,

        handler: async function (response) {
          const verifyRes = await axios.post("http://localhost:4000/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: data.order.amount / 100  // convert back to ₹
          });

          alert(verifyRes.data.message);
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "18px" }}>
      Pay ₹500
    </button>
  );
};

export default RazorpayButton;
