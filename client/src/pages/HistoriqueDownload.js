import React, { useState, useEffect, useMemo } from "react";
import BarSide from "../components/ui/BarSide";
import { fetchRapport } from "../services/api";
import "../contexts/styles/HistoriqueDownload.css";
import PDFViewer from "./PDFViewer";
import { downloadFile } from "../services/api";

const HistoriqueDownload = ({ onBack }) => {
  const [rapports, setRapports] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
   const [selectedPdf, setSelectedPdf] = useState(null);

    const handleDownload = async (filename) => {
  try {
    await downloadFile(filename);
    console.log("Téléchargement terminé !");
  } catch (err) {
    console.log("Erreur lors du téléchargement");
  }
};

  useEffect(() => {
    

    const loadRapports = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Chargement des rapports...");
        const data = await fetchRapport();
        console.log("Données reçues:", data);
        
        // Debug: afficher les informations sur la réponse
        setDebugInfo(`Type: ${typeof data}, Est un tableau: ${Array.isArray(data)}, Longueur: ${Array.isArray(data) ? data.length : 'N/A'}`);
        
        if (Array.isArray(data)) {
          setRapports(data);
          console.log("Rapports chargés:", data);
        } else if (data && typeof data === 'object') {
          // Si l'API retourne un objet avec une propriété contenant le tableau
          const possibleArrayProps = ['data', 'rapports', 'results', 'items', 'documents'];
          for (const prop of possibleArrayProps) {
            if (Array.isArray(data[prop])) {
              setRapports(data[prop]);
              console.log(`Données trouvées dans la propriété: ${prop}`, data[prop]);
              return;
            }
          }
          
          // Si on n'a pas trouvé de tableau, on essaye de convertir l'objet en tableau
          console.log("Conversion de l'objet en tableau");
          setRapports([data]);
        } else {
          setRapports([]);
          setError("Format de données non reconnu");
        }
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(`Impossible de charger les rapports: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadRapports();
  }, []);

  const filteredData = useMemo(() => {
    if (!rapports || !Array.isArray(rapports)) {
      console.log("Rapports n'est pas un tableau valide", rapports);
      return [];
    }
    
    console.log("Filtrage des données:", rapports.length, "éléments");
    
    const result = rapports
      .filter((r) => {
        const name = r.name || r.filename || r.title || "Sans nom";
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
        let matchesType = true;
        
        if (filterType !== "all") {
          const extension = name.split('.').pop()?.toLowerCase();
          matchesType = filterType === extension;
        }
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = a.uploadDate ? new Date(a.uploadDate) : new Date(0);
        const dateB = b.uploadDate ? new Date(b.uploadDate) : new Date(0);
        
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    
    console.log("Données filtrées:", result.length, "éléments");
    return result;
  }, [rapports, search, sortOrder, filterType]);

  const fileTypes = useMemo(() => {
    if (!rapports || !Array.isArray(rapports)) return ['all'];
    
    const types = new Set();
    rapports.forEach(r => {
      const name = r.name || r.filename || r.title || "";
      if (name) {
        const extension = name.split('.').pop()?.toLowerCase();
        if (extension) types.add(extension);
      }
    });
    return ['all', ...Array.from(types)];
  }, [rapports]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const refreshData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRapport();
      console.log("Données rafraîchies:", data);
      if (Array.isArray(data)) {
        setRapports(data);
      } else {
        setError("Format de réponse inattendu");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors du rafraîchissement");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour afficher les données brutes pour le débogage
  const displayRawData = () => {
    return (
      <div className="debug-section">
        <h3>Données brutes (débogage):</h3>
        <div className="raw-data">
          <pre>{JSON.stringify(rapports, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="historique-wrapper">
      <BarSide />
      <main className="historique-container">
        <header className="historique-header">
          <div className="header-content">
            <div className="title-section">
              <h1>📂 Historique des téléchargements</h1>
              <p>Gérez et consultez tous vos rapports exportés</p>
            </div>
            <button className="btn-back" onClick={onBack}>
              <span className="icon">←</span>
              Revenir aux graphiques
            </button>
          </div>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h3>{rapports.length}</h3>
              <p>Rapports au total</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon recent">🆕</div>
            <div className="stat-info">
              <h3>{rapports.filter(r => {
                if (!r.uploadDate) return false;
                const reportDate = new Date(r.uploadDate);
                const today = new Date();
                return reportDate.toDateString() === today.toDateString();
              }).length}</h3>
              <p>Aujourd'hui</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pdf">📄</div>
            <div className="stat-info">
              <h3>{rapports.filter(r => {
                const name = r.name || r.filename || r.title || "";
                return name.toLowerCase().endsWith('.pdf');
              }).length}</h3>
              <p>Fichiers PDF</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon excel">📊</div>
            <div className="stat-info">
              <h3>{rapports.filter(r => {
                const name = r.name || r.filename || r.title || "";
                return name.toLowerCase().endsWith('.xlsx') || name.toLowerCase().endsWith('.csv');
              }).length}</h3>
              <p>Fichiers Excel/CSV</p>
            </div>
          </div>
        </section>

        <section className="controls">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous les types' : `.${type.toUpperCase()}`}
                </option>
              ))}
            </select>
            
            <button
              className="btn-sort"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Anciens d'abord" : "Récents d'abord"}
              <span className={`sort-icon ${sortOrder}`}>▼</span>
            </button>

            <button className="btn-refresh" onClick={refreshData}>
              🔄 Actualiser
            </button>
          </div>
        </section>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Chargement des rapports...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={() => setError("")} className="error-close">×</button>
          </div>
        )}

        
         {!loading && !error && (
          <section className="rapports-list">
            <div className="list-header">
              <span className="header-name">Nom du fichier</span>
              <span className="header-date">Date de création</span>
              <span className="header-size">Taille</span>
              <span className="header-actions">Actions</span>
            </div>
            
            {filteredData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucun rapport trouvé</h3>
                <p>Essayez de modifier vos filtres ou termes de recherche</p>
              </div>
            ) : (
              filteredData.map((r, index) => {
                const name = r.name || r.filename || r.title || "Sans nom";
                const fileUrl = r.fileUrl || r.url || r.downloadUrl || "#";
                const isPdf = name.toLowerCase().endsWith('.pdf');
                
                return (
                  <div key={r._id || r.id || index} className="rapport-card">
                    <div className="file-info">
                      <div className="file-icon">
                        {isPdf ? '📄' : 
                         name.toLowerCase().endsWith('.xlsx') ? '📊' : 
                         name.toLowerCase().endsWith('.csv') ? '📝' : '📂'}
                      </div>
                      <div className="file-details">
                        <h3 title={name}>{name}</h3>
                        <span className="file-type">.{name.split('.').pop()}</span>
                      </div>
                    </div>
                    
                    <span className="rapport-date">
                      {r.uploadDate ? new Date(r.uploadDate).toLocaleString("fr-FR", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date inconnue'}
                    </span>
                    
                    <span className="file-size">
                      {formatFileSize(r.length)}
                    </span>
                    
                    <div className="actions">
                      {/* Bouton pour télécharger le PDF */}
                      {isPdf && (
                        <button
                          onClick={()=>{handleDownload(r.filename)}}
                          className="btn-download"
                          title="Télécharger"
                        >
                          ⬇️
                        </button>
                      )}
                     
    
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Afficher le visualiseur PDF si un PDF est sélectionné */}
        {selectedPdf && (
          <PDFViewer 
            fileUrl={selectedPdf.url} 
            onClose={() => setSelectedPdf(null)}
          />
        )}

        
        {/* Section de débogage pour voir les données brutes 
        <details className="debug-details">
          <summary>Données brutes (débogage)</summary>
          <pre className="debug-pre">{JSON.stringify(rapports, null, 2)}</pre>
        </details>
        */}
      </main>
    </div>
  );
};

export default HistoriqueDownload;