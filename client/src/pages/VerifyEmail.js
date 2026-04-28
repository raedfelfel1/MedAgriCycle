import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const env = require("../contexts/utils/env");
const API_URL = env.API_IP;

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/users/verify-email/${token}`)
      .then(res => res.json())
      .then(() => {
        alert("✅ Email vérifié avec succès ! Vous pouvez vous connecter.");
        navigate("/");
      })
      .catch(() => {
        alert("❌ Erreur lors de la vérification.");
        navigate("/");
      });
  }, [token]);

  return <p style={{ textAlign: "center", marginTop: 100 }}>Vérification en cours...</p>;
};

export default VerifyEmail;