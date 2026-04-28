import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const { API_IP } = Constants.expoConfig.extra;
const API_URL = `${API_IP}`;

/**
 * Helper pour créer les headers par défaut avec le header ngrok
 * @param {Object} additionalHeaders - Headers supplémentaires à ajouter
 * @returns {Object} - Headers complets
 */
function getDefaultHeaders(additionalHeaders = {}) {
  const headers = {
    'ngrok-skip-browser-warning': 'true',
    ...additionalHeaders,
  };
  
  // Ajouter Content-Type seulement si pas déjà présent
  if (!headers['Content-Type'] && !additionalHeaders['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
}

/**
 * Helper pour parser une réponse JSON de manière sécurisée
 * @param {Response} response - La réponse fetch
 * @returns {Promise<any>} - Les données parsées
 */

async function safeJsonParse(response) {
  const contentType = response.headers.get("content-type");

  // Vérifier si c'est du JSON
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (jsonError) {
      // Si le parsing échoue, lire le texte brut pour debug
      const text = await response.clone().text();

      // Vérifier si c'est une erreur ngrok
      if (text.includes("ngrok") || text.includes("offline") || text.includes("ERR_NGROK")) {
        const ngrokError = new Error("Le serveur est actuellement hors ligne. Vérifiez que le tunnel ngrok est actif et que le serveur est démarré.");
        ngrokError.isNgrokError = true;
        throw ngrokError;
      }

      console.error("❌ Erreur parsing JSON:", jsonError);
      console.error("📄 Contenu reçu:", text.substring(0, 200));
      throw new Error(`Erreur parsing JSON: ${jsonError.message}. Réponse: ${text.substring(0, 100)}`);
    }
  } else {
    // Si ce n'est pas du JSON, lire le texte
    const text = await response.text();
    // Vérifier si c'est une erreur ngrok
    if (text.includes("ngrok") || text.includes("offline") || text.includes("ERR_NGROK")) {
      const ngrokError = new Error("Le serveur est actuellement hors ligne. Vérifiez que le tunnel ngrok est actif et que le serveur est démarré.");
      ngrokError.isNgrokError = true;
      throw ngrokError;
    }

    // Ne pas logger les erreurs ngrok comme des erreurs critiques
    if (!text.includes("ngrok") && !text.includes("offline") && !text.includes("ERR_NGROK")) {
      console.error("❌ Réponse non-JSON reçue:", text.substring(0, 200));
    }
    throw new Error(`Réponse serveur invalide (attendu JSON, reçu ${contentType || 'texte'}): ${text.substring(0, 100)}`);
  }
}

// ========== PRODUITS ==========

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Erreur lors du chargement des produits");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchProducts:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error("Produit introuvable");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchProductById:", error);
    throw error;
  }
};

export const fetchProductsByFarm = async (farmId) => {
  try {
    const res = await fetch(`${API_URL}/products/farm/${farmId}`);
    if (!res.ok) throw new Error("Produits introuvables pour cette ferme");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchProductsByFarm:", error);
    throw error;
  }
};

export const fetchProductsByUserId = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/products/user/${userId}`);
    if (!res.ok) throw new Error("Products of this user not found");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchProductsByUserId:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Erreur lors de la création du produit');
    return await safeJsonParse(res);
  } catch (error) {
    console.error("Erreur createProduct:", error);
    throw error;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await safeJsonParse(res)
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return data;
  } catch (error) {
    console.error("Erreur updateProduct:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Échec de la suppression du produit");
    return await safeJsonParse(res);
  } catch (error) {
    console.error("Erreur deleteProduct:", error);
    throw error;
  }
};

export async function fetchFarmsAndProductsByUser(userId) {
  try {
    const res = await fetch(`${API_URL}/products/productsAndFarms?user=${userId}`);
    const data = await safeJsonParse(res)
    return {
      farms: data.farms || [],
      products: data.products || []
    };
  } catch (error) {
    console.error("fetchFarmsAndProductsByUser ERROR :", error);
    return { farms: [], products: [] };
  }
}

// ========== FERMES ==========

export const fetchFarms = async () => {
  try {
    const res = await fetch(`${API_URL}/farms`);
    if (!res.ok) throw new Error("Erreur lors du chargement des fermes");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchFarms:", error);
    throw error;
  }
};

export const fetchFarmById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/farms/${id}`);
    if (!res.ok) throw new Error("Ferme introuvable");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchFarmById:", error);
    throw error;
  }
};

export const fetchFarmsByUser = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/farms/user/${userId}`);
    if (!res.ok) throw new Error("Fermes introuvables pour cet utilisateur");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchFarmsByUser:", error);
    throw error;
  }
};

export const createFarm = async (farmData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token d\'authentification manquant');

    const res = await fetch(`${API_URL}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(farmData)
    });
    if (!res.ok) throw new Error("Erreur lors de la création de la ferme");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur createFarm:", error);
    throw error;
  }
};

export const updateFarm = async (id, updates) => {
  try {
    const token = await await AsyncStorage.getItem('token');
    if (!token) throw new Error("Token d'authentification manquant");

    const payload = typeof updates === "string" ? { name: updates } : updates;

    const res = await fetch(`${API_URL}/farms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Échec de la mise à jour");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur updateFarm:", error);
    throw error;
  }
};

export const deleteFarm = async (id) => {
  try {
    const token = await await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token d\'authentification manquant');

    const res = await fetch(`${API_URL}/farms/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteFarm:", error);
    throw error;
  }
};

// ========== CAPTEURS ==========

export const fetchSensors = async () => {
  try {
    const res = await fetch(`${API_URL}/sensors`);
    if (!res.ok) throw new Error("Erreur lors du chargement des capteurs");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchSensors:", error);
    throw error;
  }
};

export const fetchSensorById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/sensors/${id}`);
    if (!res.ok) throw new Error("Capteur introuvable");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchSensorById:", error);
    throw error;
  }
};

export const createSensor = async (sensorData) => {
  try {
    const res = await fetch(`${API_URL}/sensors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensorData)
    });
    if (!res.ok) throw new Error("Erreur lors de la création du capteur");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur createSensor:", error);
    throw error;
  }
};

export const updateSensor = async (id, updates) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${API_URL}/sensors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Erreur mise à jour sensor");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur updateSensor:", error);
    throw error;
  }
};

export const deleteSensor = async (id) => {
  try {
    const res = await fetch(`${API_URL}/sensors/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Erreur lors de la suppression du capteur");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteSensor:", error);
    throw error;
  }
};

export const fetchSensorsByFarm = async (farmId) => {
  try {
    const res = await fetch(`${API_URL}/sensors/farm/${farmId}`);
    if (!res.ok) throw new Error("Erreur de chargement des capteurs");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchSensorsByFarm:", error);
    throw error;
  }
};

export const fetchSensorsByProduct = async (productId) => {
  try {
    const res = await fetch(`${API_URL}/sensors/product/${productId}`);
    const data = await safeJsonParse(res)
    if (!res.ok) throw new Error("Erreur de chargement des capteurs du produit");
    return data.data;
  } catch (error) {
    console.error("Erreur fetchSensorsByProduct:", error);
    throw error;
  }
};
export const fetchSensorsByUser = async (userId)=>{
  try{
    const res = await fetch(`${API_URL}/sensors/user/${userId}`);
    const data = await safeJsonParse(res);
    if(!res.ok) throw new Error("Loading error for user sensors");
    return data.data;
  } catch(e){
    console.error("Error fetchSensorByUser",e);
    throw e;
  }
}
// ========== TANKS ==========

export const fetchTanks = async () => {
  try {
    const res = await fetch(`${API_URL}/tanks`);
    if (!res.ok) throw new Error("Erreur lors du chargement des tanks");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchTanks:", error);
    throw error;
  }
};

export const createTank = async (tankData) => {
  try {
    const token = await await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token d'authentification manquant");

    const res = await fetch(`${API_URL}/tanks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(tankData),
    });

    if (!res.ok) throw new Error("Erreur lors de la création du réservoir");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur createTank:", error);
    throw error;
  }
};

export const updateTank = async (id, updates) => {
  try {
    const token = await await AsyncStorage.getItem('token');
    const res = await fetch(`${API_URL}/tanks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Erreur mise à jour tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur updateTank:", error);
    throw error;
  }
};

export const deleteTank = async (id) => {
  try {
    const token = await await AsyncStorage.getItem('token');
    const res = await fetch(`${API_URL}/tanks/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur suppression tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteTank:", error);
    throw error;
  }
};

export const fetchTanksByFarm = async (id) => {
  try {
    if (!id) throw new Error("Aucun farmId fourni");
    const res = await fetch(`${API_URL}/tanks/farm/${id}`);
    if (!res.ok && res.status!="404") throw new Error(`Erreur lors du chargement des tanks : ${res.status} ${res.statusText}`);
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchTanksByFarm:", error);
    throw error;
  }
};

export const updateTankName = async (tankId, newName) => {
  try {
    const res = await fetch(`${API_URL}/tanks/${tankId}/name`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du nom du tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur updateTankName:", error);
    throw error;
  }
};

export const fetchProductsByTank = async (tankId) => {
  try {
    const res = await fetch(`${API_URL}/tanks/${tankId}/products`);
    if (!res.ok) throw new Error("Erreur récupération produits du tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchProductsByTank:", error);
    throw error;
  }
};
export const getTankByUser=async(userId)=>{
  try {
    const res = await fetch (`${API_URL}/tanks/${userId}`);
    if(!res.ok){
      throw new Error("Fail to fetch the tank of this user")
    }
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur getTankByUser : ",error.message)
  }
}
// ========== HISTORIQUES DES TANKS ==========

export const fetchTankById = async (tankId) => {
  try {
    if (!tankId) throw new Error("Aucun tankId fourni");
    const res = await fetch(`${API_URL}/tankHistory/getTank/${tankId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération du tank");
    return await safeJsonParse(res)
  } catch (err) {
    console.error("❌ Erreur fetchTankById:", err);
    throw err;
  }
};

export const fetchTankHistoryByTank = async (tankId) => {
  try {
    if (!tankId) throw new Error("Aucun tankId fourni");
    const res = await fetch(`${API_URL}/tankHistory/${tankId}`);
    if (!res.ok) throw new Error("Erreur lors du chargement de l'historique du tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchTankHistoryByTank:", error);
    throw error;
  }
};

export const fetchTankHistoryByProductAndTank = async (productId, tankId) => {
  try {
    if (!tankId || !productId) throw new Error("tankId ou productId manquant");
    const res = await fetch(`${API_URL}/tankHistory?tank=${tankId}&product=${productId}`);
    if (!res.ok) throw new Error("Erreur lors du chargement de l'historique du tank pour le produit");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchTankHistoryByProductAndTank:", error);
    throw error;
  }
};

export const createTankHistory = async (tankId, productId, consumptionUsed, remainingQuantity, action) => {
  try {
    const res = await fetch(`${API_URL}/tankHistory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tankId: tankId,
        product: productId,
        quantity: consumptionUsed,
        action: action,
        newLevel: remainingQuantity,
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const errorData = await safeJsonParse(res)
      throw new Error(errorData.message || "Erreur lors de l'enregistrement de l'historique");
    }
    return await safeJsonParse(res)
  } catch (err) {
    console.error("❌ Erreur createTankHistory:", err);
    throw err;
  }
};

export const deleteTankHistory = async (id) => {
  try {
    const token = await await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token d'authentification manquant");

    const res = await fetch(`${API_URL}/tankHistory/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression de l'historique du tank");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteTankHistory:", error);
    throw error;
  }
};

export const fetchTankHistoryByTankAndProduct = async (tankId, productId) => {
  try {
    if (!tankId || !productId) throw new Error("tankId ou productId manquant");
    const res = await fetch(`${API_URL}/tankHistory/tank/${tankId}/product/${productId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des historiques pour ce tank et produit");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchTankHistoryByTankAndProduct:", error);
    throw error;
  }
};

export const fetchTankHistoryById = async (tankId) => {
  try {
    if (!tankId) throw new Error("ID du tank manquant");
    const res = await fetch(`${API_URL}/tankHistory/${tankId}`);
    if (!res.ok) throw new Error("Erreur lors du chargement de l'historique du tank");
    const data = await safeJsonParse(res)
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error("Erreur fetchTankHistoryById:", error);
    throw error;
  }
};

export async function fetchEveryTanksLastLevel(user) {
  try {
    if (!user) throw new Error("farms manquant");
    const res = await fetch(`${API_URL}/tankHistory/everyTanksLastLevel/${user}`);
    if (!res.ok) throw new Error("Erreur récupération niveaux des tanks");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchEveryTanksLastLevel :", error);
    throw error;
  }
}

// ========== UTILISATEURS ==========

export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchUsers:", error);
    throw error;
  }
};

export const fetchUserById = async (id) => {

  const res = await fetch(`${API_URL}/users/${id}`);
  try {
    if (!res.ok) throw new Error("Utilisateur introuvable");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchUserById:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur createUser:", error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur updateUser:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    throw error;
  }
};

export const changePassword = async (id, passwordData) => {
  try {
    const res = await fetch(`${API_URL}/users/${id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData)
    });
    if (!res.ok) throw new Error("Erreur de modification du mot de passe");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur changePassword:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error("Échec de l'authentification");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur loginUser:", error);
    throw error;
  }
};

// ========== DONNÉES DES CAPTEURS ==========

export const fetchSensorHistory = async (sensorId, hours) => {
  try {
    if (!sensorId) throw new Error("Aucun sensorId fourni");

    let aggregation = "hourly";

    if (hours === "live") {
      aggregation = "live";
    } else {
      if (hours > 72) aggregation = "daily";
      if (hours > 720) aggregation = "weekly";
    }

    const res = await fetch(
      `${API_URL}/sensors-data/history/${sensorId}?hours=${hours}&aggregation=${aggregation}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ ERREUR API :", errorText);
      throw new Error("Erreur lors du chargement de l'historique des capteurs");
    }

    return await safeJsonParse(res)
  } catch (error) {
    console.error("❌ ERREUR fetchSensorHistory :", error);
    throw error;
  }
};

export async function fetchLiveInit(sensorId) {
  try {
    const res = await fetch(`${API_URL}/sensors-data/history/liveInit/${sensorId}`);
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur fetchLiveInit:", error);
    throw error;
  }
}

// ========== RECOMMANDATIONS ==========

export async function fetchRecommendations(user) {
  try {
    const res = await fetch(`${API_URL}/recommendations/farm/${user}`);
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return await safeJsonParse(res)
  } catch (err) {
    console.error("Erreur dans fetchRecommendations :", err);
    throw err;
  }
}

export async function generateRecommendations(farmId, language) {
  try {
    const res = await fetch(`${API_URL}/recommendations/generate?lang=${language}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ farmId }),
    });
    return await safeJsonParse(res)
  } catch (err) {
    console.error("Erreur dans generateRecommendations :", err);
    throw err;
  }
}

// ========== RAPPORTS ==========

export const uploadRapport = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erreur lors de l’upload du rapport");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("❌ Upload échoué :", error);
    throw error;
  }
};

export const fetchRapport = async () => {
  try {
    const res = await fetch(`${API_URL}/files/filesListe`);
    if (!res.ok) throw new Error("Impossible de récupérer les rapports");
    return await safeJsonParse(res)
  } catch (error) {
    console.error("❌ Erreur fetchRapport :", error);
    throw error;
  }
};

export const deleteRapport = async (rapportId) => {
  try {
    const res = await fetch(`${API_URL}/files/delete/${rapportId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression du rapport');
    return await safeJsonParse(res)
  } catch (error) {
    console.error("Erreur deleteRapport:", error);
    throw error;
  }
};

export const downloadFile = async (filename) => {
  try {
    const res = await fetch(`${API_URL}/files/file/${filename}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Erreur téléchargement: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erreur téléchargement :", error);
    throw error;
  }
};
