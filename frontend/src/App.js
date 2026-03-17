import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Link2, Plus, Trash2, ExternalLink } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_bc03b78b-3e8e-4ca3-a590-f89c2a1fcb05/artifacts/7r5zq0iq_logo-wtf%209.31.23%E2%80%AFPM.png";

const CATEGORIES = [
  { value: "proyecto", label: "Proyecto" },
  { value: "flujo", label: "Flujo" },
  { value: "referencia", label: "Referencia" },
  { value: "otro", label: "Otro" },
];

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    category: "proyecto",
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  const fetchProjects = async () => {
    try {
      const url = filterCategory 
        ? `${API}/projects?category=${filterCategory}` 
        : `${API}/projects`;
      const response = await axios.get(url);
      setProjects(response.data);
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url || !formData.title) {
      toast.error("URL y título son requeridos");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/projects`, formData);
      toast.success("Link agregado");
      setFormData({ url: "", title: "", description: "", category: "proyecto" });
      fetchProjects();
    } catch (e) {
      console.error(e);
      toast.error("Error al agregar link");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`);
      toast.success("Link eliminado");
      fetchProjects();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="app-container" data-testid="wtf-app">
      <Toaster position="top-center" theme="dark" />
      
      {/* Header */}
      <header className="header" data-testid="header">
        <img 
          src={LOGO_URL} 
          alt="WTF Agency" 
          className="logo"
          data-testid="wtf-logo"
        />
        <p className="tagline">Brief Destroyers</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Form Section */}
        <section className="form-section" data-testid="form-section">
          <h2 className="section-title">
            <Link2 size={20} />
            Agregar Link
          </h2>
          
          <form onSubmit={handleSubmit} className="link-form" data-testid="link-form">
            <div className="form-row">
              <input
                type="url"
                placeholder="URL del proyecto"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="input-field"
                data-testid="input-url"
                required
              />
            </div>
            
            <div className="form-row">
              <input
                type="text"
                placeholder="Titulo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                data-testid="input-title"
                required
              />
            </div>
            
            <div className="form-row">
              <input
                type="text"
                placeholder="Descripcion (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                data-testid="input-description"
              />
            </div>
            
            <div className="form-row">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select-field"
                data-testid="select-category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
              data-testid="submit-btn"
            >
              <Plus size={18} />
              {submitting ? "Agregando..." : "Agregar"}
            </button>
          </form>
        </section>

        {/* Projects List */}
        <section className="projects-section" data-testid="projects-section">
          <div className="section-header">
            <h2 className="section-title">Links</h2>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
              data-testid="filter-category"
            >
              <option value="">Todos</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading" data-testid="loading">Cargando...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state" data-testid="empty-state">
              No hay links todavia
            </div>
          ) : (
            <ul className="projects-list" data-testid="projects-list">
              {projects.map((project) => (
                <li key={project.id} className="project-item" data-testid={`project-${project.id}`}>
                  <div className="project-info">
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-title"
                      data-testid={`project-link-${project.id}`}
                    >
                      {project.title}
                      <ExternalLink size={14} />
                    </a>
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}
                    <span className="project-category">{project.category}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="delete-btn"
                    data-testid={`delete-${project.id}`}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <p>WTF Agency - Battle Tested Creativity Since 2010</p>
      </footer>
    </div>
  );
}

export default App;
