import { useRouter } from 'expo-router';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createUser } from "../services/api";

export default function Inscription(){
    const [etape, setEtape] = useState(1);
    const [donnees, setDonnees] = useState({
        firstName: "",
        lastName: "",
        age: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        confirmation: "",
        location: "",
    });
    const [message, setMessage] = useState("");
    const [erreurs, setErreurs] = useState({});
    const [error, setError] = useState("");
    const router = useRouter();
    
    // Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const passwordRegex =/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const adresseRegex = /^[a-zA-Z0-9\s,'-]{5,100}$/;
    
    // Gestion des inputs
    const handleChange = (name, value) => {
        setDonnees({ ...donnees, [name]: value });
    };
    
    // Validation
    const validerEtape = () => {
        const erreursActuelles = {};
        if (etape === 1) {
            if (!donnees.lastName.trim()) erreursActuelles.lastName = "Le nom est requis.";
            if (!donnees.firstName.trim()) erreursActuelles.firstName = "Le prénom est requis.";
            if (!donnees.age.trim() || isNaN(donnees.age) || Number(donnees.age) < 15)
                erreursActuelles.age = "Âge invalide (minimum 15 ans).";
        }
        if (etape === 2) {
            if (!donnees.email || !emailRegex.test(donnees.email))
                erreursActuelles.email = "Adresse email invalide.";
            if (!donnees.phone || !phoneRegex.test(donnees.phone))
                erreursActuelles.phone = "Numéro invalide (8 à 15 chiffres).";
            if (donnees.address && !adresseRegex.test(donnees.address))
                erreursActuelles.address = "Adresse invalide (5 à 100 caractères).";
        }
        if (etape === 3) {
            if (!donnees.password)
                erreursActuelles.password = "Le mot de passe est requis.";
            else if (!passwordRegex.test(donnees.password))
                erreursActuelles.password =
            "Au moins 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.";
            if (!donnees.confirmation)
                erreursActuelles.confirmation = "Confirmez le mot de passe.";
            else if (donnees.password !== donnees.confirmation)
                erreursActuelles.confirmation = "Les mots de passe ne correspondent pas.";
        }
        setErreurs(erreursActuelles);
        return Object.keys(erreursActuelles).length === 0;
    };
    
    const suivant = () => {
        if (validerEtape()) setEtape((e) => e + 1);
    };
    
    const precedent = () => setEtape((e) => e - 1);
    
    const handleSubmit = async () => {
        setMessage("");
        setError("");
        
        if (!validerEtape()) {
            return; 
        }
        
        try {
            const toSend = { ...donnees };
            delete toSend.confirmation;
            console.log("donnée envoyée inscription : ",toSend)
            await createUser(toSend);
            setMessage("Inscription réussie !");
            setDonnees({
                firstName: "",
                lastName: "",
                age: "",
                phone: "",
                email: "",
                address: "",
                password: "",
                confirmation: "",
                location: "",
            });
            Alert.alert("Succès", "Inscription réussie !", [
            { text: "OK", onPress: () => router.replace("/connexion") },
        ]);
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription.");
            Alert.alert("Erreur", error);
        }
    };
    
    
    return (
        <View style={styles.conteneur}>
        <Text style={styles.titre}>Registration form</Text>
        <View style={styles.etapes}>
        <Text style={etape >= 1 ? styles.etapeActive : styles.etape}>1</Text>
        <Text style={etape >= 2 ? styles.etapeActive : styles.etape}>2</Text>
        <Text style={etape >= 3 ? styles.etapeActive : styles.etape}>3</Text>
        </View>
        
        {etape === 1 && (
            <>
            <TextInput
            style={styles.input}
            placeholder="Name"
            value={donnees.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            />
            {erreurs.lastName && <Text style={styles.erreur}>{erreurs.lastName}</Text>}
            <TextInput
            style={styles.input}
            placeholder="First name"
            value={donnees.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            />
            {erreurs.firstName && <Text style={styles.erreur}>{erreurs.firstName}</Text>}
            <TextInput
            style={styles.input}
            placeholder="Age"
            value={donnees.age}
            onChangeText={(text) => handleChange("age", text)}
            keyboardType="numeric"
            />
            {erreurs.age && <Text style={styles.erreur}>{erreurs.age}</Text>}
            </>
        )}
        
        {etape === 2 && (
            <>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={donnees.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            />
            {erreurs.email && <Text style={styles.erreur}>{erreurs.email}</Text>}
            <TextInput
            style={styles.input}
            placeholder="Phone"
            value={donnees.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
            />
            {erreurs.phone && <Text style={styles.erreur}>{erreurs.phone}</Text>}
            <TextInput
            style={styles.input}
            placeholder="Adress (optional)"
            value={donnees.address}
            onChangeText={(text) => handleChange("address", text)}
            />
            {erreurs.address && <Text style={styles.erreur}>{erreurs.address}</Text>}
            </>
        )}
        
        {etape === 3 && (
            <>
            <TextInput
            style={styles.input}
            placeholder="Password"
            value={donnees.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            />
            {erreurs.password && <Text style={styles.erreur}>{erreurs.password}</Text>}
            <TextInput
            style={styles.input}
            placeholder="Confirmation"
            value={donnees.confirmation}
            onChangeText={(text) => handleChange("confirmation", text)}
            secureTextEntry
            />
            {erreurs.confirmation && <Text style={styles.erreur}>{erreurs.confirmation}</Text>}
            </>
        )}
        
        <View style={styles.boutons}>
        {etape > 1 && (
            <TouchableOpacity style={styles.bouton} onPress={precedent}>
            <Text style={styles.texteBouton}>Previous</Text>
            </TouchableOpacity>
        )}
        {etape < 3 ? (
            <TouchableOpacity style={styles.bouton} onPress={suivant}>
            <Text style={styles.texteBouton}>Next</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.bouton} onPress={handleSubmit}>
            <Text style={styles.texteBouton}>Validate</Text>
            </TouchableOpacity>
        )}
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        padding: 20,
        paddingTop: 150,
    },
    titre: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    etapes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    etape: {
        color: "#ccc",
        fontSize: 18,
    },
    etapeActive: {
        color: "#007AFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    erreur: {
        color: "red",
        marginBottom: 10,
    },
    boutons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    bouton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
    },
    texteBouton: {
        color: "white",
        fontWeight: "bold",
    },
});
