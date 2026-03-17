import "@/App.css";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_bc03b78b-3e8e-4ca3-a590-f89c2a1fcb05/artifacts/7r5zq0iq_logo-wtf%209.31.23%E2%80%AFPM.png";
const BG_VIDEO = "https://customer-assets.emergentagent.com/job_wtf-flows/artifacts/l5kofv0g_Image_Video_Project_CPL6LVcT.mp4";

function App() {
  return (
    <div className="landing">
      <video 
        className="video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={BG_VIDEO} type="video/mp4" />
      </video>
      <div className="overlay">
        <img src={LOGO_URL} alt="WTF Agency" className="logo" />
        <p className="tagline">Projects by WTF Agency</p>
      </div>
    </div>
  );
}

export default App;
