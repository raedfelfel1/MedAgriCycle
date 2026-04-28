import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator,FlatList,StyleSheet,Text,TextInput,TouchableOpacity,View } from "react-native";

import { downloadFile, fetchRapport } from "../../services/api";

export default function HistoriqueDownload({ onBack }) {
    const [rapports, setRapports] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const loadRapports = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchRapport();
            if (Array.isArray(data)) {
                setRapports(data);
            } else {
                setRapports([]);
                setError("Format de données non reconnu");
            }
        } catch (err) {
            console.error("Erreur fetchRapport :", err);
            setError("Impossible de récupérer les rapports");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log("historique download")
        loadRapports();
    }, [loadRapports]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(rapports)) return [];
        return rapports
            .filter((r) => {
                const name = r.name || r.filename || r.title || "Sans nom";
                const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
                let matchesType = true;
                if (filterType !== "all") {
                    const extension = name.split(".").pop()?.toLowerCase();
                    matchesType = filterType === extension;
                }
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                const dateA = a.uploadDate ? new Date(a.uploadDate) : new Date(0);
                const dateB = b.uploadDate ? new Date(b.uploadDate) : new Date(0);
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            });
    }, [rapports, search, sortOrder, filterType]);

    const formatFileSize = (bytes) => {
        if (!bytes) return "N/A";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    };

    const handleDownload = async (filename) => {
        try {
            await downloadFile(filename);
            console.log("Téléchargement terminé !");
        } catch (err) {
            console.log("Erreur lors du téléchargement");
        }
    };

    const renderItem = ({ item }) => {
        const name = item.name || item.filename || item.title || "Sans nom";
        const isPdf = name.toLowerCase().endsWith(".pdf");
        return (
            <View style={styles.card}>
                <Text style={styles.fileName}>{name}</Text>
                <Text style={styles.fileDate}>
                    {item.uploadDate
                        ? new Date(item.uploadDate).toLocaleString("fr-FR")
                        : "Date inconnue"}
                </Text>
                <Text style={styles.fileSize}>{formatFileSize(item.length)}</Text>
                {isPdf && (
                    <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => handleDownload(item.filename)}
                    >
                        <Text style={styles.downloadText}>⬇️</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="green" />
                <Text>Chargement des rapports...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity onPress={loadRapports} style={styles.refreshBtn}>
                    <Text style={styles.refreshText}>🔄 Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Text style={styles.backText}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>📂 Historique des téléchargements</Text>
            </View>

            {/* Recherche */}
            <TextInput
                style={styles.search}
                placeholder="Rechercher un rapport..."
                value={search}
                onChangeText={setSearch}
            />

            {/* Liste */}
            {filteredData.length === 0 ? (
                <View style={styles.center}>
                    <Text>Aucun rapport trouvé</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => item._id || item.id || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backBtn: { marginRight: 12 },
    backText: { fontSize: 16, color: "blue" },
    title: { fontSize: 18, fontWeight: "bold" },
    search: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
    },
    card: {
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        elevation: 2,
    },
    fileName: { fontSize: 16, fontWeight: "bold" },
    fileDate: { fontSize: 14, color: "#555" },
    fileSize: { fontSize: 12, color: "#999" },
    downloadBtn: {
        marginTop: 6,
        padding: 6,
        backgroundColor: "#4caf50",
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    downloadText: { color: "white", fontSize: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { color: "red", marginBottom: 8 },
    refreshBtn: {
        padding: 8,
        backgroundColor: "lightblue",
        borderRadius: 6,
    },
    refreshText: { fontSize: 16 },
});
