import "@/App.css";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_bc03b78b-3e8e-4ca3-a590-f89c2a1fcb05/artifacts/7r5zq0iq_logo-wtf%209.31.23%E2%80%AFPM.png";
const BG_IMAGE = "https://customer-assets.emergentagent.com/job_wtf-flows/artifacts/n2o0y7nx_u2462154512_A_highly_photorealistic_image_of_a_standard_moder_151001ab-f0e9-4d04-abed-83ad5adf53ce_3.png";

function App() {
  return (
    <div className="landing" style={{ backgroundImage: `url(${BG_IMAGE})` }}>
      <div className="overlay">
        <img src={LOGO_URL} alt="WTF Agency" className="logo" />
        <p className="tagline">Projects by WTF Agency</p>
      </div>
    </div>
  );
}

export default App;
