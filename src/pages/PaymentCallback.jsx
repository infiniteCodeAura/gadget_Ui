import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Button, Box } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying");
    const pidx = searchParams.get("pidx");

    useEffect(() => {
        const verifyPayment = async () => {
            if (!pidx) {
                setStatus("failed");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                await axios.post(
                    "http://localhost:9090/api/v3/payment/khalti/verify",
                    { pidx },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStatus("success");
                // Optionally clear cart here if not done by backend
                await axios.delete("http://localhost:9090/api/v3/user/cart/flush", {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Verification failed", error);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [pidx]);

    return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
            {status === "verifying" && (
                <>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Verifying your payment...</Typography>
                </>
            )}
            {status === "success" && (
                <>
                    <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
                    <Typography paragraph>Your order has been placed successfully.</Typography>
                    <Button variant="contained" onClick={() => navigate("/products")}>Continue Shopping</Button>
                </>
            )}
            {status === "failed" && (
                <>
                    <Error color="error" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Payment Failed</Typography>
                    <Typography paragraph>Something went wrong with your payment.</Typography>
                    <Button variant="contained" onClick={() => navigate("/cart")}>Try Again</Button>
                </>
            )}
        </Container>
    );
};

export default PaymentCallback;
